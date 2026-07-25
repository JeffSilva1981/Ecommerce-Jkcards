package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class ProductDto {

    private Long id;

    @Size(min = 3, max = 100, message = "The name must be between 3 and 100 characters long.")
    @NotBlank(message = "Name must not be empty.")
    private String name;

    @Size(min = 10, max = 1500, message = "The description must be between 10 and 1500 characters long.")
    @NotBlank(message = "Description must not be empty.")
    private String description;

    @NotNull(message = "The price must not be empty.")
    @Positive(message = "The price cannot be zero or negative.")
    private Double price;

    private String imgUrl;

    @NotNull(message = "The stock quantity must not be empty.")
    @PositiveOrZero(message = "The stock quantity cannot be negative.")
    private Integer stockQuantity;

    @Positive(message = "The weight must be greater than zero.")
    private Double weight;

    @Positive(message = "The width must be greater than zero.")
    private Double width;

    @Positive(message = "The height must be greater than zero.")
    private Double height;

    @Positive(message = "The length must be greater than zero.")
    private Double length;

    @NotEmpty(message = "The product must belong to at least one category.")
    private List<CategoryDto> categories = new ArrayList<>();

    public ProductDto() {
    }

    public ProductDto(
            Long id,
            String name,
            String description,
            Double price,
            String imgUrl,
            Integer stockQuantity,
            Double weight,
            Double width,
            Double height,
            Double length
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgUrl = imgUrl;
        this.stockQuantity = stockQuantity;
        this.weight = weight;
        this.width = width;
        this.height = height;
        this.length = length;
    }

    public ProductDto(Product entity) {
        id = entity.getId();
        name = entity.getName();
        description = entity.getDescription();
        price = entity.getPrice();
        imgUrl = entity.getImgUrl();
        stockQuantity = entity.getStockQuantity();
        weight = entity.getWeight();
        width = entity.getWidth();
        height = entity.getHeight();
        length = entity.getLength();

        for (Category category : entity.getCategories()) {
            categories.add(new CategoryDto(category));
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

    public Double getWeight() {
        return weight;
    }

    public Double getWidth() {
        return width;
    }

    public Double getHeight() {
        return height;
    }

    public Double getLength() {
        return length;
    }

    public List<CategoryDto> getCategories() {
        return categories;
    }
}