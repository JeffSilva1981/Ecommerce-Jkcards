package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.CategoryDto;
import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.dtos.ProductMinDto;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Transactional(readOnly = true)
    public Page<ProductMinDto> findAll(
            String name,
            Long categoryId,
            Long excludeCategoryId,
            Boolean inStock,
            Pageable pageable
    ) {
        String normalizedName =
                name == null ? "" : name.trim();

        boolean onlyInStock =
                Boolean.TRUE.equals(inStock);

        Page<Product> result = repository.search(
                normalizedName,
                categoryId,
                excludeCategoryId,
                onlyInStock,
                pageable
        );

        return result.map(ProductMinDto::new);
    }

    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        Product result = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return new ProductDto(result);
    }

    @Transactional
    public ProductDto insert(ProductDto dto) {
        Product entity = new Product();
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new ProductDto(entity);
    }

    @Transactional
    public ProductDto update(Long id, ProductDto dto) {
        Product entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new ProductDto(entity);
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public void delete(Long id) {
        if (!repository.existsById(id)) {throw new ResourceNotFoundException("Product not found");
        }

        try {
            repository.deleteById(id);
        }
        catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation - product is related to other entities");
        }
    }

    private void copyDtoToEntity(
            ProductDto dto,
            Product entity
    ) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setImgUrl(dto.getImgUrl());
        entity.setStockQuantity(dto.getStockQuantity());

        entity.setWeight(dto.getWeight());
        entity.setWidth(dto.getWidth());
        entity.setHeight(dto.getHeight());
        entity.setLength(dto.getLength());

        entity.getCategories().clear();

        for (CategoryDto categoryDto : dto.getCategories()) {
            Category category = new Category();
            category.setId(categoryDto.getId());

            entity.getCategories().add(category);
        }
    }
}