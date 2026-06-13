package com.jeffsilva.jkcards.Controllers;

import com.jeffsilva.jkcards.Dtos.OrderDto;
import com.jeffsilva.jkcards.Services.OrderService;
import com.jeffsilva.jkcards.entities.User;
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

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Page<OrderDto>> findAll(@RequestParam(value = "client",
            required = false) Long client, Pageable pageable){
        Page<OrderDto> result = service.findAll(client, pageable);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('ROLE_OPERATOR')")
    @GetMapping("/my")
    public ResponseEntity<Page<OrderDto>> findMyOrders(Pageable pageable) {
        Page<OrderDto> result = service.findMyOrders(pageable);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('ROLE_OPERATOR')")
    @PostMapping
    public ResponseEntity<OrderDto> created(@Valid @RequestBody OrderDto dto) {
        OrderDto result = service.insert(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(result.getId()).toUri();
        return ResponseEntity.created(uri).body(result);
    }

}
