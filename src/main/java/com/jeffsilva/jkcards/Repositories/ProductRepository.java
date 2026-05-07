package com.jeffsilva.jkcards.Repositories;

import com.jeffsilva.jkcards.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
