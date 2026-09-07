package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteItemDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteRequestDto;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.integrations.melhorenvio.MelhorEnvioClient;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioCompanyResponse;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioOptionsRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioPostalCodeRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioProductRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioQuoteRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioQuoteResponse;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.services.exceptions.ShippingException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Service
public class ShippingService {

    private static final int MAX_CARDS_PER_PACKAGE = 50;
    private static final double CARD_WEIGHT = 0.003;

    private final ProductRepository productRepository;
    private final MelhorEnvioClient melhorEnvioClient;
    private final MelhorEnvioProperties properties;

    public ShippingService(
            ProductRepository productRepository,
            MelhorEnvioClient melhorEnvioClient,
            MelhorEnvioProperties properties
    ) {
        this.productRepository = productRepository;
        this.melhorEnvioClient = melhorEnvioClient;
        this.properties = properties;
    }

    @Transactional(readOnly = true)
    public List<ShippingQuoteDto> calculateQuotes(ShippingQuoteRequestDto dto) {
        if (dto == null) {
            throw new ShippingException("The shipping request is required.");
        }

        String origin = normalizePostalCode(
                properties.getOriginPostalCode(),
                "The shipping origin postal code is not configured."
        );

        String destination = normalizePostalCode(
                dto.getDestinationPostalCode(),
                "The destination postal code is invalid."
        );

        Map<Long, Integer> consolidatedItems = consolidateItems(dto.getItems());

        List<MelhorEnvioProductRequest> products =
                buildProducts(consolidatedItems);

        MelhorEnvioQuoteRequest request = new MelhorEnvioQuoteRequest(
                new MelhorEnvioPostalCodeRequest(origin),
                new MelhorEnvioPostalCodeRequest(destination),
                products,
                new MelhorEnvioOptionsRequest(false, false)
        );

        List<ShippingQuoteDto> quotes =
                normalizeQuotes(melhorEnvioClient.calculate(request));

        if (quotes.isEmpty()) {
            throw new ShippingException(
                    "No shipping services are available for the informed postal code."
            );
        }

        return quotes;
    }

    @Transactional(readOnly = true)
    public ShippingQuoteDto validateSelectedQuote(
            ShippingQuoteRequestDto request,
            Long serviceId
    ) {
        if (serviceId == null || serviceId <= 0) {
            throw new ShippingException(
                    "The selected shipping service is invalid."
            );
        }

        return calculateQuotes(request).stream()
                .filter(quote ->
                        Objects.equals(quote.getServiceId(), serviceId))
                .findFirst()
                .orElseThrow(() ->
                        new ShippingException(
                                "The selected shipping service is no longer available."
                        )
                );
    }

    private Map<Long, Integer> consolidateItems(
            List<ShippingQuoteItemDto> items
    ) {
        if (items == null || items.isEmpty()) {
            throw new ShippingException(
                    "The shipping request must contain at least one item."
            );
        }

        Map<Long, Integer> consolidated = new LinkedHashMap<>();

        for (ShippingQuoteItemDto item : items) {
            if (item == null
                    || item.getProductId() == null
                    || item.getProductId() <= 0) {
                throw new ShippingException(
                        "The product identifier is invalid."
                );
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new ShippingException(
                        "Invalid quantity for product: " + item.getProductId()
                );
            }

            try {
                consolidated.merge(
                        item.getProductId(),
                        item.getQuantity(),
                        Math::addExact
                );
            } catch (ArithmeticException e) {
                throw new ShippingException(
                        "The product quantity is too large."
                );
            }
        }

        return consolidated;
    }

    private List<MelhorEnvioProductRequest> buildProducts(
            Map<Long, Integer> items
    ) {
        List<MelhorEnvioProductRequest> products = new ArrayList<>();
        int cardQuantity = 0;
        BigDecimal cardValue = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : items.entrySet()) {
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product not found: " + entry.getKey()
                            )
                    );

            int quantity = entry.getValue();
            boolean card = isCard(product);

            validateProduct(product, quantity, card);

            if (card) {
                try {
                    cardQuantity = Math.addExact(cardQuantity, quantity);
                } catch (ArithmeticException e) {
                    throw new ShippingException(
                            "The product quantity is too large."
                    );
                }

                cardValue = cardValue.add(
                        BigDecimal.valueOf(product.getPrice())
                                .multiply(BigDecimal.valueOf(quantity))
                );

                continue;
            }

            products.add(new MelhorEnvioProductRequest(
                    String.valueOf(product.getId()),
                    product.getWidth(),
                    product.getHeight(),
                    product.getLength(),
                    product.getWeight(),
                    BigDecimal.valueOf(product.getPrice()),
                    quantity
            ));
        }

        addCardPackages(products, cardQuantity, cardValue);

        return products;
    }

    private void addCardPackages(
            List<MelhorEnvioProductRequest> products,
            int totalQuantity,
            BigDecimal totalValue
    ) {
        int remaining = totalQuantity;
        BigDecimal remainingValue = totalValue;
        int packageNumber = 1;

        while (remaining > 0) {
            int quantity = Math.min(remaining, MAX_CARDS_PER_PACKAGE);

            BigDecimal packageValue = quantity == remaining
                    ? remainingValue
                    : totalValue.multiply(BigDecimal.valueOf(quantity))
                    .divide(
                            BigDecimal.valueOf(totalQuantity),
                            2,
                            RoundingMode.HALF_UP
                    );

            double[] dimensions = cardPackageDimensions(quantity);

            double weight = Math.max(
                    0.1,
                    dimensions[3] + quantity * CARD_WEIGHT
            );

            products.add(new MelhorEnvioProductRequest(
                    "cards-" + packageNumber++,
                    dimensions[0],
                    dimensions[1],
                    dimensions[2],
                    BigDecimal.valueOf(weight)
                            .setScale(3, RoundingMode.UP)
                            .doubleValue(),
                    packageValue,
                    1
            ));

            remaining -= quantity;
            remainingValue = remainingValue.subtract(packageValue);
        }
    }

    private double[] cardPackageDimensions(int quantity) {
        if (quantity <= 10) {
            return new double[]{11, 2, 16, 0.05};
        }

        if (quantity <= 30) {
            return new double[]{15, 5, 20, 0.10};
        }

        return new double[]{16, 8, 22, 0.15};
    }

    private boolean isCard(Product product) {
        return product.getCategories().stream().anyMatch(category -> {
            String name = normalizeText(category.getName());

            return name.equals("carta") || name.equals("cartas");
        });
    }

    private String normalizeText(String value) {
        return Normalizer.normalize(
                        value == null ? "" : value,
                        Normalizer.Form.NFD
                )
                .replaceAll("\\p{M}", "")
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private void validateProduct(
            Product product,
            int quantity,
            boolean card
    ) {
        if (!product.isAvailable()) {
            throw new ShippingException(
                    "Produto indisponível para compra: " + product.getName()
            );
        }

        if (quantity <= 0) {
            throw new ShippingException(
                    "Invalid quantity for product: " + product.getName()
            );
        }

        Integer maxQuantityPerOrder = product.getMaxQuantityPerOrder();

        if (maxQuantityPerOrder != null
                && quantity > maxQuantityPerOrder) {
            throw new ShippingException(
                    "Limite de " + maxQuantityPerOrder
                            + " unidade(s) por pedido para: "
                            + product.getName()
            );
        }

        int stock = product.getStockQuantity() == null
                ? 0
                : product.getStockQuantity();

        if (stock < quantity) {
            throw new ShippingException(
                    "Insufficient stock for product: " + product.getName()
            );
        }

        if (!isPositive(product.getPrice())) {
            throw new ShippingException(
                    "The product does not have a valid price: "
                            + product.getName()
            );
        }

        if (card) {
            return;
        }

        if (!isPositive(product.getWeight())) {
            throw new ShippingException(
                    "The product does not have a valid shipping weight: "
                            + product.getName()
            );
        }

        if (!isPositive(product.getWidth())) {
            throw new ShippingException(
                    "The product does not have a valid shipping width: "
                            + product.getName()
            );
        }

        if (!isPositive(product.getHeight())) {
            throw new ShippingException(
                    "The product does not have a valid shipping height: "
                            + product.getName()
            );
        }

        if (!isPositive(product.getLength())) {
            throw new ShippingException(
                    "The product does not have a valid shipping length: "
                            + product.getName()
            );
        }
    }

    private List<ShippingQuoteDto> normalizeQuotes(
            List<MelhorEnvioQuoteResponse> response
    ) {
        if (response == null) {
            throw new ShippingException(
                    "The shipping provider returned an invalid response."
            );
        }

        return response.stream()
                .filter(this::isValidQuote)
                .map(this::toShippingQuoteDto)
                .sorted(Comparator.comparing(ShippingQuoteDto::getPrice))
                .toList();
    }

    private boolean isValidQuote(MelhorEnvioQuoteResponse quote) {
        if (quote == null
                || StringUtils.hasText(quote.getError())
                || quote.getId() == null
                || !StringUtils.hasText(quote.getName())) {
            return false;
        }

        BigDecimal price = selectPrice(quote);

        return price != null && price.compareTo(BigDecimal.ZERO) > 0;
    }

    private ShippingQuoteDto toShippingQuoteDto(
            MelhorEnvioQuoteResponse quote
    ) {
        MelhorEnvioCompanyResponse company = quote.getCompany();

        String carrier = company == null
                || !StringUtils.hasText(company.getName())
                ? "Shipping company"
                : company.getName();

        return new ShippingQuoteDto(
                quote.getId(),
                quote.getName(),
                carrier,
                company == null ? null : company.getPicture(),
                selectPrice(quote),
                selectDeliveryTime(quote)
        );
    }

    private BigDecimal selectPrice(MelhorEnvioQuoteResponse quote) {
        return quote.getCustomPrice() != null
                ? quote.getCustomPrice()
                : quote.getPrice();
    }

    private Integer selectDeliveryTime(MelhorEnvioQuoteResponse quote) {
        return quote.getCustomDeliveryTime() != null
                ? quote.getCustomDeliveryTime()
                : quote.getDeliveryTime();
    }

    private String normalizePostalCode(
            String postalCode,
            String errorMessage
    ) {
        if (!StringUtils.hasText(postalCode)) {
            throw new ShippingException(errorMessage);
        }

        String normalized = postalCode.replaceAll("\\D", "");

        if (!normalized.matches("\\d{8}")) {
            throw new ShippingException(errorMessage);
        }

        return normalized;
    }

    private boolean isPositive(Double value) {
        return value != null && Double.isFinite(value) && value > 0;
    }
}