package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Dtos.OrderDto;
import com.jeffsilva.jkcards.Repositories.OrderRepository;
import com.jeffsilva.jkcards.Services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.entities.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    @Transactional
    public OrderDto findById(Long id) {
        Order result = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return new OrderDto(result);
    }
}
