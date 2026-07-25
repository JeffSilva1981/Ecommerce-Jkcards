package com.jeffsilva.jkcards.tests;

import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;

public class Factory {

    private static final String PRODUCT_IMAGE_URL =
            "https://res.cloudinary.com/"
                    + "detskmzps/image/upload/"
                    + "v1782307265/jkcards/products/"
                    + "p5ppzfvnwqgalpzdlxar.png";

    private static final Double PRODUCT_WEIGHT = 0.5;
    private static final Double PRODUCT_WIDTH = 20.0;
    private static final Double PRODUCT_HEIGHT = 10.0;
    private static final Double PRODUCT_LENGTH = 30.0;

    public static Product createProduct() {
        Product product = new Product(
                null,
                "Booster Box",
                "36 Boosters",
                490.00,
                PRODUCT_IMAGE_URL,
                10,
                PRODUCT_WEIGHT,
                PRODUCT_WIDTH,
                PRODUCT_HEIGHT,
                PRODUCT_LENGTH
        );

        product.getCategories().add(
                createCategory()
        );

        return product;
    }

    public static Product createProduct(
            String name,
            Double price,
            Integer stockQuantity
    ) {
        Product product = new Product(
                null,
                name,
                "36 Boosters",
                price,
                PRODUCT_IMAGE_URL,
                stockQuantity,
                PRODUCT_WEIGHT,
                PRODUCT_WIDTH,
                PRODUCT_HEIGHT,
                PRODUCT_LENGTH
        );

        product.getCategories().add(
                createCategory()
        );

        return product;
    }

    public static Category createCategory() {
        return new Category(
                1L,
                "Boosters"
        );
    }

    public static ProductDto createProductDto() {
        Product product = createProduct();

        return new ProductDto(product);
    }
}