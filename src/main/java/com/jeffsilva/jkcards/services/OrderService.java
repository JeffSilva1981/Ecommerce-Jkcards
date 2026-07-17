package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.OrderDto;
import com.jeffsilva.jkcards.dtos.OrderItemDto;
import com.jeffsilva.jkcards.dtos.OrderStatusDto;
import com.jeffsilva.jkcards.repositories.OrderItemRepository;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.Payment;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

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

        return entity.map(x -> new OrderDto(x));
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> findMyOrders(Pageable pageable) {
        User user = service.authenticated();

        Page<Order> entity = repository.findByClientId(
                user.getId(),
                pageable
        );

        return entity.map(OrderDto::new);
    }

    @Transactional
    public OrderDto insert(OrderDto dto) {
        Order order = new Order();
        order.setMoment(Instant.now());
        order.setStatus(OrderStatus.WAITING_PAYMENT);

        User user = service.authenticated();
        order.setClient(user);

        for (OrderItemDto itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            Integer currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            Integer requestedQuantity = itemDto.getQuantity() == null ? 0 : itemDto.getQuantity();

            if (requestedQuantity <= 0) {
                throw new DataBaseException("Invalid quantity for product: " + product.getName());
            }

            if (currentStock < requestedQuantity) {
                throw new DataBaseException("Insufficient stock for product: " + product.getName());
            }

            product.setStockQuantity(currentStock - requestedQuantity);

            OrderItem item = new OrderItem(
                    order,
                    product,
                    requestedQuantity,
                    product.getPrice()
            );

            order.getItems().add(item);
        }

        order = repository.save(order);
        orderItemRepository.saveAll(order.getItems());

        Payment payment = mercadoPagoService.createPaymentPreference(order);
        order.setPayment(payment);

        order = repository.save(order);

        return new OrderDto(order);
    }

    @Transactional
    public OrderDto updateStatus(Long id, OrderStatusDto dto) {
        Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order Not Found"));
        order.setStatus(dto.status());
        order = repository.save(order);
        return new OrderDto(order);
    }

    @Transactional
    public void delete(Long id) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order Not Found"));

        try {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();

                Integer currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
                Integer quantityToReturn = item.getQuantity() == null ? 0 : item.getQuantity();

                product.setStockQuantity(currentStock + quantityToReturn);
            }

            orderItemRepository.deleteAll(order.getItems());
            repository.delete(order);
        }
        catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}