package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.dtos.OrderCreateDto;
import com.jeffsilva.jkcards.dtos.OrderDto;
import com.jeffsilva.jkcards.dtos.OrderStatusDto;
import com.jeffsilva.jkcards.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping(value = "/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> findById(@PathVariable Long id) {
        OrderDto result = service.findById(id);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<OrderDto>> findAll(
            @RequestParam(value = "client", required = false) Long client,
            Pageable pageable) {

        Page<OrderDto> result = service.findAll(client, pageable);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ROLE_OPERATOR')")
    @GetMapping("/my")
    public ResponseEntity<Page<OrderDto>> findMyOrders(Pageable pageable) {
        Page<OrderDto> result = service.findMyOrders(pageable);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ROLE_OPERATOR')")
    @PostMapping
    public ResponseEntity<OrderDto> created(@Valid @RequestBody OrderCreateDto dto) {
        OrderDto result = service.insert(dto);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(result.getId())
                .toUri();

        return ResponseEntity.created(uri).body(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusDto dto) {

        OrderDto result = service.updateStatus(id, dto);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}