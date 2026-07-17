package com.jeffsilva.jkcards.tests;

import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;

public class Factory {

    public static Product createProduct(){
        Product product = new Product(null, "Booster Box", "36 Boosters", 490.00, "https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png", 10);
        product.getCategories().add(createCategory());
        return product;
    }

    public static Product createProduct(String name, Double price, Integer stockQuantity ){
        Product product = new Product(null, name, "36 Boosters", price, "https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png", stockQuantity);
        product.getCategories().add(createCategory());
        return product;
    }

    public static Category createCategory(){
        Category category = new Category(1L, "Boosters");
        return category;
    }

    public static ProductDto createProductDto(){
        Product product = createProduct();
        return new ProductDto(product);
    }

}
