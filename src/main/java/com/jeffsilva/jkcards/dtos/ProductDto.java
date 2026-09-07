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

    @Size(
            min = 3,
            max = 100,
            message = "The name must be between 3 and 100 characters long."
    )
    @NotBlank(message = "Name must not be empty.")
    private String name;

    @Size(
            min = 10,
            max = 1500,
            message = "The description must be between 10 and 1500 characters long."
    )
    @NotBlank(message = "Description must not be empty.")
    private String description;

    @NotNull(message = "The price must not be empty.")
    @Positive(message = "The price cannot be zero or negative.")
    private Double price;

    private String imgUrl;

    @NotNull(message = "The stock quantity must not be empty.")
    @PositiveOrZero(message = "The stock quantity cannot be negative.")
    private Integer stockQuantity;

    /**
     * Estoque recebido pelo administrador ao abrir o formulário.
     * Usado para detectar edição com dados desatualizados.
     */
    @PositiveOrZero(
            message = "The expected stock quantity cannot be negative."
    )
    private Integer expectedStockQuantity;

    /**
     * Define se o produto pode aparecer e ser comprado pelos clientes.
     */
    private boolean available = true;

    /**
     * Limite máximo deste produto por pedido.
     * Null significa sem limite.
     */
    @Positive(
            message = "The maximum quantity per order must be greater than zero."
    )
    private Integer maxQuantityPerOrder;

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
        this.expectedStockQuantity = stockQuantity;
        this.available = true;
        this.maxQuantityPerOrder = null;
        this.weight = weight;
        this.width = width;
        this.height = height;
        this.length = length;
    }

    public ProductDto(Product entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.description = entity.getDescription();
        this.price = entity.getPrice();
        this.imgUrl = entity.getImgUrl();
        this.stockQuantity = entity.getStockQuantity();

        this.expectedStockQuantity = entity.getStockQuantity() == null
                ? 0
                : entity.getStockQuantity();

        this.available = entity.isAvailable();
        this.maxQuantityPerOrder = entity.getMaxQuantityPerOrder();

        this.weight = entity.getWeight();
        this.width = entity.getWidth();
        this.height = entity.getHeight();
        this.length = entity.getLength();

        for (Category category : entity.getCategories()) {
            this.categories.add(new CategoryDto(category));
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

    public Integer getExpectedStockQuantity() {
        return expectedStockQuantity;
    }

    public void setExpectedStockQuantity(Integer expectedStockQuantity) {
        this.expectedStockQuantity = expectedStockQuantity;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Integer getMaxQuantityPerOrder() {
        return maxQuantityPerOrder;
    }

    public void setMaxQuantityPerOrder(Integer maxQuantityPerOrder) {
        this.maxQuantityPerOrder = maxQuantityPerOrder;
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