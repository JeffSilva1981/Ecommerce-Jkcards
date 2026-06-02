package com.jeffsilva.jkcards.Dtos;

import com.jeffsilva.jkcards.entities.Category;

public class CategoryDto {

    private Long id;
    private String name;

    public CategoryDto(){

    }

    public CategoryDto(Category entity) {
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
