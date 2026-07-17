package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepository extends JpaRepository<Category, Long> {

}
