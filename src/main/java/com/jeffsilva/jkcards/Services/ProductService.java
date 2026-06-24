package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Dtos.CategoryDto;
import com.jeffsilva.jkcards.Dtos.ProductDto;
import com.jeffsilva.jkcards.Dtos.ProductMinDto;
import com.jeffsilva.jkcards.Repositories.ProductRepository;
import com.jeffsilva.jkcards.Services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.Services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
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
    public Page<ProductMinDto> findAll(String name, Pageable pageable) {
        Page<Product> result;

        if (name == null || name.isBlank()) {
            result = repository.findAll(pageable);
        } else {
            result = repository.searchByName(name, pageable);
        }

        return result.map(ProductMinDto::new);
    }

    @Transactional
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
        Product entity = repository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Product Not Found"));
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new ProductDto(entity);
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }

        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation - product is related to other entities");
        }
    }

    private void copyDtoToEntity(ProductDto dto, Product entity) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setImgUrl(dto.getImgUrl());
        entity.setStockQuantity(dto.getStockQuantity());

        entity.getCategories().clear();

        for (CategoryDto categoryDto : dto.getCategories()) {
            Category cat = new Category();
            cat.setId(categoryDto.getId());
            entity.getCategories().add(cat);
        }
    }

}
