package com.jeffsilva.jkcards.Dtos;

import com.jeffsilva.jkcards.entities.User;

public class ClientDto {

    private Long id;
    private String name;

    public ClientDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public ClientDto(User entity) {
        id = entity.getId();
        name = entity.getName();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
