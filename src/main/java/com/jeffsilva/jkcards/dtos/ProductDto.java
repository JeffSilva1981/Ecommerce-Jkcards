package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;

public class ProductDto {

    private Long id;

    @Size(min = 3, max = 100, message = "The name must be between 3 and 10 characters long.")
    @NotBlank(message = "Name must be empty.")
    private String name;

    @Size(min = 10, max = 1500, message = "The name must be between 10 and 1500 characters long.")
    @NotBlank(message = "Description must be empty.")
    private String description;

    @NotNull(message = "The price must not be empty.")
    @Positive(message = "The price cannot be zero or negative.")
    private Double price;

    private String imgUrl;

    @NotNull(message = "The stock quantity must not be empty.")
    @PositiveOrZero(message = "The stock quantity cannot be negative.")
    private Integer stockQuantity;

    @NotEmpty(message = "The product must belong to at least one category.")
    private List<CategoryDto> categories = new ArrayList<>();

    public ProductDto() {

    }

    public ProductDto(Long id, String name, String description, Double price, String imgUrl, Integer stockQuantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgUrl = imgUrl;
        this.stockQuantity = stockQuantity;
    }

    public ProductDto(Product entity) {
        id = entity.getId();
        name = entity.getName();
        description = entity.getDescription();
        price = entity.getPrice();
        imgUrl = entity.getImgUrl();
        stockQuantity = entity.getStockQuantity();

        for (Category cat : entity.getCategories()) {
            categories.add(new CategoryDto(cat));
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public List<CategoryDto> getCategories() {
        return categories;
    }
}
