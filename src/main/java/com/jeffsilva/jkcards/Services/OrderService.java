package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Dtos.OrderDto;
import com.jeffsilva.jkcards.Dtos.OrderItemDto;
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

    @Transactional
    public OrderDto findById(Long id) {
        Order result = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return new OrderDto(result);
    }

    @Transactional
    public OrderDto insert(OrderDto dto) {

        Order order = new Order();
        order.setMoment(Instant.now());
        order.setStatus(OrderStatus.WAITING_PAYMENT);

        User user = service.authenticated();
        order.setClient(user);

        for (OrderItemDto itemDto : dto.getItems()){
            Product product = productRepository.getReferenceById(itemDto.getProductId());
            OrderItem item = new OrderItem(order, product, itemDto.getQuantity(), itemDto.getPrice());
            order.getItems().add(item);
        }

        repository.save(order);
        orderItemRepository.saveAll(order.getItems());

        return new OrderDto(order);
    }
}
