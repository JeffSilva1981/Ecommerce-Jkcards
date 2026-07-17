package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.tests.Factory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
public class ProductRepositoryTests {

    @Autowired
    private ProductRepository repository;

    private Product p1, p2, p3, p4;

    @BeforeEach
    void setUp() throws Exception {

        repository.deleteAll();

        p1 = Factory.createProduct("Booster Box Pokémon", 100.0, 2);
        p2 = Factory.createProduct("Sleeves Premium", 40.0, 5);
        p3 = Factory.createProduct("Carta Avulsa", 10.0, 0);
        p4 = Factory.createProduct("Deck Teste", 80.0, null);

        repository.save(p1);
        repository.save(p2);
        repository.save(p3);
        repository.save(p4);
    }

    @Test
    public void sumInventoryValueShouldReturnCorrectValue(){
       Double result = repository.sumInventoryValue();

       Assertions.assertEquals(400.00, result);
    }

    @Test
    public void sumStockUnitsShouldReturnCorrectQuantity(){
        Long result = repository.sumStockUnits();

        Assertions.assertEquals(7L, result);
    }

    @Test
    public void countOutOfStockProductsShouldReturnCorrectCount(){
        Long result = repository.countOutOfStockProducts();

        Assertions.assertEquals(2, result);
    }

    @Test
    public void searchByNameShouldReturnProductByName(){

        Page<Product> result = repository.searchByName("Booster Box Pokémon", Pageable.ofSize(4));

        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals("Booster Box Pokémon", result.getContent().get(0).getName());
    }

    @Test
    public void searchByNameShouldIgnoreCase() {
        Page<Product> result = repository.searchByName("booster", Pageable.ofSize(4));

        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals("Booster Box Pokémon", result.getContent().get(0).getName());
    }

    @Test
    public void searchByNameShouldReturnEmptyPageWhenNameDoesNotExist() {
        Page<Product> result = repository.searchByName("Produto Inexistente", Pageable.ofSize(4));

        Assertions.assertTrue(result.isEmpty());
        Assertions.assertEquals(0, result.getTotalElements());
    }
}
