package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.CategoryDto;
import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.dtos.ProductMinDto;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(
            ProductRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<ProductMinDto> findAll(
            String name,
            Long categoryId,
            Long excludeCategoryId,
            boolean inStock,
            Pageable pageable
    ) {
        String normalizedName =
                name == null ? "" : name.trim();

        Page<Product> result = repository.search(
                normalizedName,
                categoryId,
                excludeCategoryId,
                inStock,
                pageable
        );

        return result.map(ProductMinDto::new);
    }

    /*
     * Mantém compatibilidade com testes e chamadas
     * antigas que ainda utilizem a assinatura anterior.
     */
    @Transactional(readOnly = true)
    public Page<ProductMinDto> findAll(
            String name,
            Long categoryId,
            Pageable pageable
    ) {
        return findAll(
                name,
                categoryId,
                null,
                false,
                pageable
        );
    }

    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        return new ProductDto(product);
    }

    @Transactional
    public ProductDto insert(ProductDto dto) {
        Product product = new Product();

        copyDtoToEntity(dto, product);

        product = repository.save(product);

        return new ProductDto(product);
    }

    @Transactional
    public ProductDto update(
            Long id,
            ProductDto dto
    ) {
        Product product = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        copyDtoToEntity(dto, product);

        product = repository.save(product);

        return new ProductDto(product);
    }

    @Transactional(
            propagation = Propagation.SUPPORTS
    )
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Product not found"
            );
        }

        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException(
                    "Integrity violation - product " +
                            "is related to other entities"
            );
        }
    }

    private void copyDtoToEntity(
            ProductDto dto,
            Product product
    ) {
        product.setName(dto.getName());
        product.setDescription(
                dto.getDescription()
        );
        product.setPrice(dto.getPrice());
        product.setImgUrl(dto.getImgUrl());
        product.setStockQuantity(
                dto.getStockQuantity()
        );

        product.getCategories().clear();

        for (
                CategoryDto categoryDto
                : dto.getCategories()
        ) {
            Category category = new Category();

            category.setId(categoryDto.getId());

            product.getCategories().add(category);
        }
    }
}