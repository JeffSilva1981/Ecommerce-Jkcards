package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT obj FROM Product obj " +
            "WHERE UPPER(obj.name) LIKE UPPER(CONCAT('%', :name, '%'))")
    Page<Product> searchByName(String name, Pageable pageable);

    @Query("""
            SELECT COALESCE(SUM(obj.price * COALESCE(obj.stockQuantity, 0)), 0)
            FROM Product obj
            """)
    Double sumInventoryValue();

    @Query("""
            SELECT COALESCE(SUM(COALESCE(obj.stockQuantity, 0)), 0)
            FROM Product obj
            """)
    Long sumStockUnits();

    @Query("""
            SELECT COUNT(obj.id)
            FROM Product obj 
            WHERE obj.stockQuantity = 0 OR obj.stockQuantity IS NULL
            """)
    Long countOutOfStockProducts();
}