package com.jeffsilva.jkcards.Dtos;

import com.jeffsilva.jkcards.entities.Product;

public class ProductMinDto {

    private Long id;
    private String name;
    private Double price;
    private String imgUrl;

    public ProductMinDto() {

    }

    public ProductMinDto(Long id, String name, Double price, String imgUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imgUrl = imgUrl;
    }

    public ProductMinDto(Product entity) {
        id = entity.getId();
        name = entity.getName();
        price = entity.getPrice();
        imgUrl = entity.getImgUrl();
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
}
