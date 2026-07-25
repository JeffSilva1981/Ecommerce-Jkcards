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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ShippingService {

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
    public List<ShippingQuoteDto> calculateQuotes(
            ShippingQuoteRequestDto dto
    ) {
        String originPostalCode = normalizePostalCode(
                properties.getOriginPostalCode(),
                "The shipping origin postal code is not configured."
        );

        String destinationPostalCode = normalizePostalCode(
                dto.getDestinationPostalCode(),
                "The destination postal code is invalid."
        );

        Map<Long, Integer> consolidatedItems =
                consolidateItems(dto.getItems());

        List<MelhorEnvioProductRequest> products =
                buildProducts(consolidatedItems);

        MelhorEnvioQuoteRequest request =
                new MelhorEnvioQuoteRequest(
                        new MelhorEnvioPostalCodeRequest(
                                originPostalCode
                        ),
                        new MelhorEnvioPostalCodeRequest(
                                destinationPostalCode
                        ),
                        products,
                        new MelhorEnvioOptionsRequest(
                                false,
                                false
                        )
                );

        List<MelhorEnvioQuoteResponse> response =
                melhorEnvioClient.calculate(request);

        List<ShippingQuoteDto> quotes =
                normalizeQuotes(response);

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

        List<ShippingQuoteDto> availableQuotes =
                calculateQuotes(request);

        return availableQuotes.stream()
                .filter(
                        quote -> Objects.equals(
                                quote.getServiceId(),
                                serviceId
                        )
                )
                .findFirst()
                .orElseThrow(
                        () -> new ShippingException(
                                "The selected shipping service is no longer available."
                        )
                );
    }

    private Map<Long, Integer> consolidateItems(
            List<ShippingQuoteItemDto> items
    ) {
        Map<Long, Integer> consolidatedItems =
                new LinkedHashMap<>();

        for (ShippingQuoteItemDto item : items) {
            Long productId = item.getProductId();
            Integer quantity = item.getQuantity();

            try {
                consolidatedItems.merge(
                        productId,
                        quantity,
                        Math::addExact
                );
            } catch (ArithmeticException e) {
                throw new ShippingException(
                        "The product quantity is too large."
                );
            }
        }

        return consolidatedItems;
    }

    private List<MelhorEnvioProductRequest> buildProducts(
            Map<Long, Integer> consolidatedItems
    ) {
        List<MelhorEnvioProductRequest> products =
                new ArrayList<>();

        for (Map.Entry<Long, Integer> entry :
                consolidatedItems.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(
                            () -> new ResourceNotFoundException(
                                    "Product not found: "
                                            + productId
                            )
                    );

            validateProduct(product, quantity);

            MelhorEnvioProductRequest productRequest =
                    new MelhorEnvioProductRequest(
                            String.valueOf(product.getId()),
                            product.getWidth(),
                            product.getHeight(),
                            product.getLength(),
                            product.getWeight(),
                            BigDecimal.valueOf(
                                    product.getPrice()
                            ),
                            quantity
                    );

            products.add(productRequest);
        }

        return products;
    }

    private void validateProduct(
            Product product,
            Integer quantity
    ) {
        Integer stockQuantity =
                product.getStockQuantity() == null
                        ? 0
                        : product.getStockQuantity();

        if (stockQuantity < quantity) {
            throw new ShippingException(
                    "Insufficient stock for product: "
                            + product.getName()
            );
        }

        if (!isPositive(product.getPrice())) {
            throw new ShippingException(
                    "The product does not have a valid price: "
                            + product.getName()
            );
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
        return response.stream()
                .filter(this::isValidQuote)
                .map(this::toShippingQuoteDto)
                .sorted(
                        Comparator.comparing(
                                ShippingQuoteDto::getPrice
                        )
                )
                .toList();
    }

    private boolean isValidQuote(
            MelhorEnvioQuoteResponse quote
    ) {
        if (quote == null) {
            return false;
        }

        if (StringUtils.hasText(quote.getError())) {
            return false;
        }

        if (quote.getId() == null) {
            return false;
        }

        if (!StringUtils.hasText(quote.getName())) {
            return false;
        }

        BigDecimal price = selectPrice(quote);

        return price != null
                && price.compareTo(BigDecimal.ZERO) > 0;
    }

    private ShippingQuoteDto toShippingQuoteDto(
            MelhorEnvioQuoteResponse quote
    ) {
        MelhorEnvioCompanyResponse company =
                quote.getCompany();

        String carrier = company == null
                || !StringUtils.hasText(company.getName())
                ? "Shipping company"
                : company.getName();

        String carrierPicture =
                company == null
                        ? null
                        : company.getPicture();

        return new ShippingQuoteDto(
                quote.getId(),
                quote.getName(),
                carrier,
                carrierPicture,
                selectPrice(quote),
                selectDeliveryTime(quote)
        );
    }

    private BigDecimal selectPrice(
            MelhorEnvioQuoteResponse quote
    ) {
        if (quote.getCustomPrice() != null) {
            return quote.getCustomPrice();
        }

        return quote.getPrice();
    }

    private Integer selectDeliveryTime(
            MelhorEnvioQuoteResponse quote
    ) {
        if (quote.getCustomDeliveryTime() != null) {
            return quote.getCustomDeliveryTime();
        }

        return quote.getDeliveryTime();
    }

    private String normalizePostalCode(
            String postalCode,
            String errorMessage
    ) {
        if (!StringUtils.hasText(postalCode)) {
            throw new ShippingException(errorMessage);
        }

        String normalized =
                postalCode.replaceAll("\\D", "");

        if (!normalized.matches("\\d{8}")) {
            throw new ShippingException(errorMessage);
        }

        return normalized;
    }

    private boolean isPositive(Double value) {
        return value != null && value > 0;
    }
}