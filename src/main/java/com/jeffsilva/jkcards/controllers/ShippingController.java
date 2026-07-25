package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteRequestDto;
import com.jeffsilva.jkcards.services.ShippingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/shipping")
public class ShippingController {

    private final ShippingService service;

    public ShippingController(ShippingService service) {
        this.service = service;
    }

    @PostMapping("/quotes")
    public ResponseEntity<List<ShippingQuoteDto>>
    calculateQuotes(@Valid @RequestBody ShippingQuoteRequestDto dto) {
        List<ShippingQuoteDto> result = service.calculateQuotes(dto);
        return ResponseEntity.ok(result);
    }
}