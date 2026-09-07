package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.entities.Product;

public class ProductMinDto {

    private Long id;
    private String name;
    private Double price;
    private String imgUrl;
    private Integer stockQuantity;
    private boolean available;
    private Integer maxQuantityPerOrder;

    public ProductMinDto() {
    }

    public ProductMinDto(
            Long id,
            String name,
            Double price,
            String imgUrl,
            Integer stockQuantity
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imgUrl = imgUrl;
        this.stockQuantity = stockQuantity;
        this.available = true;
        this.maxQuantityPerOrder = null;
    }

    public ProductMinDto(Product entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.price = entity.getPrice();
        this.imgUrl = entity.getImgUrl();
        this.stockQuantity = entity.getStockQuantity();
        this.available = entity.isAvailable();
        this.maxQuantityPerOrder = entity.getMaxQuantityPerOrder();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
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
}