package com.jeffsilva.jkcards.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev")
@RestController
@RequestMapping("/test")
public class TestController {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @GetMapping
    public String test() {
        return cloudName;
    }
}