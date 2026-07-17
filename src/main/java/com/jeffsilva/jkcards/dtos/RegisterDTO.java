package com.jeffsilva.jkcards.dtos;

public record RegisterDTO(
        String name,
        String email,
        String password,
        String phone
) {}
