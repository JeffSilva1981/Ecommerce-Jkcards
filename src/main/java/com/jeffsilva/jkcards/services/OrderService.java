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
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderItemRepository;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
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
import java.util.Map;

@Service
public class OrderService {

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
        Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
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
    public Page<OrderDto> findMyOrders(Pageable pageable) {
        User user = service.authenticated();
        Page<Order> entity = repository.findByClientId(user.getId(), pageable);

        return entity.map(OrderDto::new);
    }

    @Transactional
    public OrderDto insert(OrderCreateDto dto) {
        Map<Long, Integer> consolidatedItems = consolidateItems(dto.getItems());

        ShippingQuoteRequestDto quoteRequest = createShippingQuoteRequest(dto, consolidatedItems);
        ShippingQuoteDto selectedQuote = shippingService.validateSelectedQuote(quoteRequest, dto.getShipping().getServiceId());

        Order order = new Order();
        order.setMoment(Instant.now());
        order.setStatus(OrderStatus.WAITING_PAYMENT);
        User user = service.authenticated();
        order.setClient(user);
        copyShippingAddress(dto.getShippingAddress(), order);
        copyShippingQuote(selectedQuote, order);
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
        Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(dto.status());
        order = repository.save(order);

        return new OrderDto(order);
    }

    @Transactional
    public void delete(Long id) {
        Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                Integer currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
                Integer quantityToReturn = item.getQuantity() == null ? 0 : item.getQuantity();
                product.setStockQuantity(currentStock + quantityToReturn);
            }

            orderItemRepository.deleteAll(order.getItems());

            repository.delete(order);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    private Map<Long, Integer> consolidateItems(List<OrderCreateItemDto> items) {
        Map<Long, Integer> consolidatedItems = new LinkedHashMap<>();

        for (OrderCreateItemDto item : items) {
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

    private ShippingQuoteRequestDto createShippingQuoteRequest(OrderCreateDto dto, Map<Long, Integer> consolidatedItems) {
        List<ShippingQuoteItemDto> quoteItems = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : consolidatedItems.entrySet()) {
            quoteItems.add(new ShippingQuoteItemDto(entry.getKey(), entry.getValue()));
        }

        return new ShippingQuoteRequestDto(dto.getShippingAddress().getPostalCode(), quoteItems);
    }

    private void addOrderItems(
            Map<Long, Integer> consolidatedItems, Order order) {

        for (Map.Entry<Long, Integer> entry : consolidatedItems.entrySet()) {
            Long productId = entry.getKey();
            Integer requestedQuantity = entry.getValue();

            Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

            Integer currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

            if (requestedQuantity <= 0) {
                throw new DataBaseException(
                        "Invalid quantity for product: "
                                + product.getName()
                );
            }

            if (currentStock < requestedQuantity) {
                throw new DataBaseException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }

            if (product.getPrice() == null
                    || product.getPrice() <= 0) {
                throw new DataBaseException(
                        "Invalid price for product: "
                                + product.getName()
                );
            }

            product.setStockQuantity(
                    currentStock - requestedQuantity
            );

            OrderItem item = new OrderItem(
                    order,
                    product,
                    requestedQuantity,
                    product.getPrice()
            );

            order.getItems().add(item);
        }
    }

    private void copyShippingAddress(
            ShippingAddressDto source,
            Order order
    ) {
        ShippingAddress address =
                new ShippingAddress(
                        source.getRecipientName().trim(),
                        source.getRecipientPhone().trim(),
                        normalizePostalCode(
                                source.getPostalCode()
                        ),
                        source.getStreet().trim(),
                        source.getNumber().trim(),
                        normalizeOptionalText(
                                source.getComplement()
                        ),
                        source.getNeighborhood().trim(),
                        source.getCity().trim(),
                        source.getState()
                                .trim()
                                .toUpperCase()
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