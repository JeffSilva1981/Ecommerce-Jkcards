package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Dtos.OrderDto;
import com.jeffsilva.jkcards.Dtos.OrderItemDto;
import com.jeffsilva.jkcards.Dtos.OrderStatusDto;
import com.jeffsilva.jkcards.Repositories.OrderItemRepository;
import com.jeffsilva.jkcards.Repositories.OrderRepository;
import com.jeffsilva.jkcards.Repositories.ProductRepository;
import com.jeffsilva.jkcards.Services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Transactional
    public OrderDto findById(Long id) {
        Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        authService.validateSelfOrdAdmin(order.getClient().getId());
        return new OrderDto(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> findAll(Long client, Pageable pageable) {
        Page<Order> entity;

        if (client != null){
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
            Product product = productRepository.getReferenceById(itemDto.getProductId());
            OrderItem item = new OrderItem(order, product, itemDto.getQuantity(), product.getPrice());
            order.getItems().add(item);
        }

        repository.save(order);
        orderItemRepository.saveAll(order.getItems());

        return new OrderDto(order);
    }

    @Transactional
    public OrderDto updateStatus(Long id, OrderStatusDto dto) {

        Order order = repository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Order Not Found"));
        order.setStatus(dto.status());
        order = repository.save(order);
        return new OrderDto(order);
    }
}
