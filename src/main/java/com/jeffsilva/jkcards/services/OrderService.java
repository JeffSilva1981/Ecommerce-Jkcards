package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.OrderCreateDto;
import com.jeffsilva.jkcards.dtos.OrderCreateItemDto;
import com.jeffsilva.jkcards.dtos.OrderDto;
import com.jeffsilva.jkcards.dtos.OrderStatusDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingAddressDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteItemDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteRequestDto;
import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.Payment;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.entities.ShippingAddress;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderItemRepository;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.services.exceptions.ShippingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class OrderService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private OrderRepository repository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService service;

    @Autowired
    private AuthService authService;

    @Autowired
    private MercadoPagoService mercadoPagoService;

    @Autowired
    private ShippingService shippingService;

    @Transactional
    public OrderDto findById(Long id) {
        Order order = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        authService.validateSelfOrdAdmin(order.getClient().getId());

        return new OrderDto(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> findAll(Long client, Pageable pageable) {
        Page<Order> entity;

        if (client != null) {
            entity = repository.findByClientId(client, pageable);
        } else {
            entity = repository.findAll(pageable);
        }

        return entity.map(OrderDto::new);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> findFiltered(Long client, String search, OrderStatus status,
                                      Instant from, Instant until, Pageable pageable) {
        return repository.findAll((root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();
            if (client != null) predicates.add(cb.equal(root.get("client").get("id"), client));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            if (from != null) predicates.add(cb.greaterThanOrEqualTo(root.get("moment"), from));
            if (until != null) predicates.add(cb.lessThan(root.get("moment"), until));
            if (search != null && !search.isBlank()) {
                String term = search.strip().toLowerCase(Locale.ROOT);
                String escaped = term.replace("!", "!!").replace("%", "!%").replace("_", "!_");
                var name = cb.like(cb.lower(root.get("client").get("name")), "%" + escaped + "%", '!');
                try {
                    predicates.add(cb.or(name, cb.equal(root.get("id"), Long.parseLong(term.replaceFirst("^#", "")))));
                } catch (NumberFormatException ignored) {
                    predicates.add(name);
                }
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        }, pageable).map(OrderDto::new);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> findMyOrders(Pageable pageable) {
        User user = service.authenticated();
        Page<Order> entity = repository.findByClientId(user.getId(), pageable);

        return entity.map(OrderDto::new);
    }

    @Transactional
    public OrderDto insert(OrderCreateDto dto) {
        if (dto == null) {
            throw new DataBaseException("The order data is required.");
        }

        Map<Long, Integer> consolidatedItems = consolidateItems(dto.getItems());

        Order order = new Order();
        order.setMoment(Instant.now());
        order.setStatus(OrderStatus.WAITING_PAYMENT);
        order.setClient(service.authenticated());

        configureDelivery(dto, consolidatedItems, order);

        // Revalida os produtos sob bloqueio após a cotação de frete.
        // Também executa essas validações para retirada na loja.
        addOrderItems(consolidatedItems, order);

        order = repository.save(order);
        orderItemRepository.saveAll(order.getItems());

        Payment payment = mercadoPagoService.createPaymentPreference(order);
        order.setPayment(payment);
        order = repository.save(order);

        return new OrderDto(order);
    }

    @Transactional
    public OrderDto updateStatus(Long id, OrderStatusDto dto) {
        if (dto == null || dto.status() == null) {
            throw new DataBaseException("The order status is required.");
        }

        Order order = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        // Usa o mesmo bloqueio do webhook antes da alteração manual.
        entityManager.refresh(order, LockModeType.PESSIMISTIC_WRITE);

        order.setStatus(dto.status());
        order = repository.save(order);

        return new OrderDto(order);
    }

    @Transactional
    public void delete(Long id) {
        Order order = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        entityManager.refresh(order, LockModeType.PESSIMISTIC_WRITE);

        try {
            List<OrderItem> items = new ArrayList<>(order.getItems());

            // Usa a mesma ordem de bloqueio da criação de pedidos.
            items.sort((first, second) ->
                    first.getProduct().getId()
                            .compareTo(second.getProduct().getId())
            );

            for (OrderItem item : items) {
                Long productId = item.getProduct().getId();

                Product product = productRepository.findByIdForUpdate(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found: " + productId
                                )
                        );

                entityManager.refresh(product, LockModeType.PESSIMISTIC_WRITE);

                int currentStock = product.getStockQuantity() == null
                        ? 0
                        : product.getStockQuantity();

                int quantityToReturn = item.getQuantity() == null
                        ? 0
                        : item.getQuantity();

                // A devolução ao estoque também vale para produtos ocultos.
                product.setStockQuantity(
                        Math.addExact(currentStock, quantityToReturn)
                );
            }

            orderItemRepository.deleteAll(items);
            repository.delete(order);
            repository.flush();
        } catch (ArithmeticException e) {
            throw new DataBaseException("The product quantity is too large.");
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    private void configureDelivery(
            OrderCreateDto dto,
            Map<Long, Integer> consolidatedItems,
            Order order
    ) {
        if (dto.getShipping() == null
                || dto.getShipping().getMethod() == null) {
            throw new ShippingException("A delivery method must be selected.");
        }

        DeliveryMethod method = dto.getShipping().getMethod();
        order.setDeliveryMethod(method);

        if (method == DeliveryMethod.PICKUP) {
            configurePickup(order);
            return;
        }

        if (dto.getShippingAddress() == null) {
            throw new ShippingException("The shipping address is required.");
        }

        if (dto.getShipping().getServiceId() == null) {
            throw new ShippingException("A shipping service must be selected.");
        }

        ShippingQuoteRequestDto quoteRequest =
                createShippingQuoteRequest(dto, consolidatedItems);

        ShippingQuoteDto selectedQuote = shippingService.validateSelectedQuote(
                quoteRequest,
                dto.getShipping().getServiceId()
        );

        copyShippingAddress(dto.getShippingAddress(), order);
        copyShippingQuote(selectedQuote, order);
    }

    private void configurePickup(Order order) {
        order.setShippingAddress(null);
        order.setShippingServiceId(null);
        order.setShippingServiceName("Retirada na loja");
        order.setShippingCarrier("JKCards");
        order.setShippingPrice(0.0);
        order.setShippingDeliveryDays(null);
    }

    private Map<Long, Integer> consolidateItems(List<OrderCreateItemDto> items) {
        if (items == null || items.isEmpty()) {
            throw new DataBaseException(
                    "The order must contain at least one item."
            );
        }

        Map<Long, Integer> consolidatedItems = new LinkedHashMap<>();

        for (OrderCreateItemDto item : items) {
            if (item == null
                    || item.getProductId() == null
                    || item.getProductId() <= 0) {
                throw new DataBaseException(
                        "The product identifier is invalid."
                );
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new DataBaseException(
                        "Invalid quantity for product: " + item.getProductId()
                );
            }

            try {
                consolidatedItems.merge(
                        item.getProductId(),
                        item.getQuantity(),
                        Math::addExact
                );
            } catch (ArithmeticException e) {
                throw new DataBaseException("The product quantity is too large.");
            }
        }

        return consolidatedItems;
    }

    private ShippingQuoteRequestDto createShippingQuoteRequest(
            OrderCreateDto dto,
            Map<Long, Integer> consolidatedItems
    ) {
        List<ShippingQuoteItemDto> quoteItems = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : consolidatedItems.entrySet()) {
            quoteItems.add(
                    new ShippingQuoteItemDto(entry.getKey(), entry.getValue())
            );
        }

        return new ShippingQuoteRequestDto(
                dto.getShippingAddress().getPostalCode(),
                quoteItems
        );
    }

    private void addOrderItems(
            Map<Long, Integer> consolidatedItems,
            Order order
    ) {
        List<Long> productIds = new ArrayList<>(consolidatedItems.keySet());
        productIds.sort(Long::compareTo);

        for (Long productId : productIds) {
            Integer requestedQuantity = consolidatedItems.get(productId);

            if (requestedQuantity == null || requestedQuantity <= 0) {
                throw new DataBaseException(
                        "Invalid quantity for product: " + productId
                );
            }

            Product product = productRepository.findByIdForUpdate(productId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product not found: " + productId
                            )
                    );

            // Atualiza os dados que podem ter sido lidos durante a cotação.
            entityManager.refresh(product, LockModeType.PESSIMISTIC_WRITE);

            validateProductForPurchase(product, requestedQuantity);

            int currentStock = product.getStockQuantity() == null
                    ? 0
                    : product.getStockQuantity();

            product.setStockQuantity(currentStock - requestedQuantity);

            OrderItem item = new OrderItem(
                    order,
                    product,
                    requestedQuantity,
                    product.getPrice()
            );

            order.getItems().add(item);
        }
    }

    private void validateProductForPurchase(
            Product product,
            int requestedQuantity
    ) {
        if (!product.isAvailable()) {
            throw new DataBaseException(
                    "Produto indisponível para compra: " + product.getName()
            );
        }

        Integer maxQuantityPerOrder = product.getMaxQuantityPerOrder();

        if (maxQuantityPerOrder != null
                && requestedQuantity > maxQuantityPerOrder) {
            throw new DataBaseException(
                    "Limite de " + maxQuantityPerOrder
                            + " unidade(s) por pedido para: "
                            + product.getName()
            );
        }

        int currentStock = product.getStockQuantity() == null
                ? 0
                : product.getStockQuantity();

        if (currentStock < requestedQuantity) {
            throw new DataBaseException(
                    "Insufficient stock for product: " + product.getName()
            );
        }

        Double price = product.getPrice();

        if (price == null || !Double.isFinite(price) || price <= 0) {
            throw new DataBaseException(
                    "Invalid price for product: " + product.getName()
            );
        }
    }

    private void copyShippingAddress(ShippingAddressDto source, Order order) {
        ShippingAddress address = new ShippingAddress(
                source.getRecipientName().trim(),
                source.getRecipientPhone().trim(),
                normalizePostalCode(source.getPostalCode()),
                source.getStreet().trim(),
                source.getNumber().trim(),
                normalizeOptionalText(source.getComplement()),
                source.getNeighborhood().trim(),
                source.getCity().trim(),
                source.getState().trim().toUpperCase(Locale.ROOT)
        );

        order.setShippingAddress(address);
    }

    private void copyShippingQuote(ShippingQuoteDto source, Order order) {
        order.setShippingServiceId(source.getServiceId());
        order.setShippingServiceName(source.getServiceName());
        order.setShippingCarrier(source.getCarrier());
        order.setShippingPrice(source.getPrice().doubleValue());
        order.setShippingDeliveryDays(source.getDeliveryDays());
    }

    private String normalizePostalCode(String postalCode) {
        return postalCode.replaceAll("\\D", "");
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
