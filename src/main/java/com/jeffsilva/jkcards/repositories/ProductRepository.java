package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    @Query("""
            SELECT obj
            FROM Product obj
            WHERE UPPER(obj.name)
                LIKE UPPER(CONCAT('%', :name, '%'))
            """)
    Page<Product> searchByName(
            @Param("name") String name,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT obj
            FROM Product obj
            JOIN obj.categories category
            WHERE category.id = :categoryId
              AND (
                  :name = ''
                  OR UPPER(obj.name)
                     LIKE UPPER(CONCAT('%', :name, '%'))
              )
            """)
    Page<Product> searchByNameAndCategory(
            @Param("name") String name,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    @Query(
            value = """
                    SELECT DISTINCT obj
                    FROM Product obj
                    LEFT JOIN obj.categories category
                    WHERE (
                        :name = ''
                        OR UPPER(obj.name)
                           LIKE UPPER(CONCAT('%', :name, '%'))
                    )
                    AND (
                        :categoryId IS NULL
                        OR category.id = :categoryId
                    )
                    AND (
                        :excludeCategoryId IS NULL
                        OR obj.id NOT IN (
                            SELECT excludedProduct.id
                            FROM Product excludedProduct
                            JOIN excludedProduct.categories excludedCategory
                            WHERE excludedCategory.id = :excludeCategoryId
                        )
                    )
                    AND (
                        :inStock = false
                        OR COALESCE(obj.stockQuantity, 0) > 0
                    )
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT obj.id)
                    FROM Product obj
                    LEFT JOIN obj.categories category
                    WHERE (
                        :name = ''
                        OR UPPER(obj.name)
                           LIKE UPPER(CONCAT('%', :name, '%'))
                    )
                    AND (
                        :categoryId IS NULL
                        OR category.id = :categoryId
                    )
                    AND (
                        :excludeCategoryId IS NULL
                        OR obj.id NOT IN (
                            SELECT excludedProduct.id
                            FROM Product excludedProduct
                            JOIN excludedProduct.categories excludedCategory
                            WHERE excludedCategory.id = :excludeCategoryId
                        )
                    )
                    AND (
                        :inStock = false
                        OR COALESCE(obj.stockQuantity, 0) > 0
                    )
                    """
    )
    Page<Product> search(
            @Param("name") String name,
            @Param("categoryId") Long categoryId,
            @Param("excludeCategoryId")
            Long excludeCategoryId,
            @Param("inStock") boolean inStock,
            Pageable pageable
    );

    @Query("""
            SELECT COALESCE(
                SUM(
                    obj.price *
                    COALESCE(obj.stockQuantity, 0)
                ),
                0
            )
            FROM Product obj
            """)
    Double sumInventoryValue();

    @Query("""
            SELECT COALESCE(
                SUM(COALESCE(obj.stockQuantity, 0)),
                0
            )
            FROM Product obj
            """)
    Long sumStockUnits();

    @Query("""
            SELECT COUNT(obj.id)
            FROM Product obj
            WHERE obj.stockQuantity = 0
               OR obj.stockQuantity IS NULL
            """)
    Long countOutOfStockProducts();
}