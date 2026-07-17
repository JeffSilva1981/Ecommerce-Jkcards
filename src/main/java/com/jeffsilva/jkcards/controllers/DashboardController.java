package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.dtos.DashboardDto;
import com.jeffsilva.jkcards.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<DashboardDto> getSummary() {
        DashboardDto result = service.getSummary();
        return ResponseEntity.ok(result);
    }
}
