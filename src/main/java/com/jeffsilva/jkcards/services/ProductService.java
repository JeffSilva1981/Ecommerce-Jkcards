package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.CategoryDto;
import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.dtos.ProductMinDto;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProductRepository repository;

    /**
     * Catálogo público.
     * Produtos indisponíveis não são retornados.
     */
    @Transactional(readOnly = true)
    public Page<ProductMinDto> findAll(
            String name,
            Long categoryId,
            Long excludeCategoryId,
            Boolean inStock,
            Pageable pageable
    ) {
        String normalizedName = name == null
                ? ""
                : name.trim();

        boolean onlyInStock = Boolean.TRUE.equals(inStock);

        Page<Product> result = repository.search(
                normalizedName,
                categoryId,
                excludeCategoryId,
                onlyInStock,
                pageable
        );

        return result.map(ProductMinDto::new);
    }

    /**
     * Catálogo administrativo.
     * Inclui produtos disponíveis, ocultos e sem estoque.
     */
    @Transactional(readOnly = true)
    public Page<ProductMinDto> findAllAdmin(
            String name,
            Long categoryId,
            Long excludeCategoryId,
            Boolean inStock,
            Pageable pageable
    ) {
        String normalizedName = name == null
                ? ""
                : name.trim();

        boolean onlyInStock = Boolean.TRUE.equals(inStock);

        Page<Product> result = repository.searchAdmin(
                normalizedName,
                categoryId,
                excludeCategoryId,
                onlyInStock,
                pageable
        );

        return result.map(ProductMinDto::new);
    }

    /**
     * Consulta pública de produto.
     * Produtos ocultos se comportam como inexistentes para clientes.
     */
    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        Product result = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        if (!result.isAvailable()) {
            throw new ResourceNotFoundException("Product not found");
        }

        return new ProductDto(result);
    }

    /**
     * Consulta administrativa de produto.
     * Permite visualizar produtos ocultos.
     */
    @Transactional(readOnly = true)
    public ProductDto findByIdAdmin(Long id) {
        Product result = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

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
        Product entity = repository.findByIdForUpdate(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        entityManager.refresh(
                entity,
                LockModeType.PESSIMISTIC_WRITE
        );

        Integer expectedStock = dto.getExpectedStockQuantity();

        if (expectedStock == null) {
            throw new DataBaseException(
                    "Recarregue o produto antes de salvar. "
                            + "O estoque original do formulário não foi informado."
            );
        }

        int currentStock = entity.getStockQuantity() == null
                ? 0
                : entity.getStockQuantity();

        if (expectedStock.intValue() != currentStock) {
            throw new DataBaseException(
                    "O estoque foi alterado desde que você abriu o formulário. "
                            + "Estoque atual: " + currentStock + ". "
                            + "Recarregue o produto e revise a quantidade antes de salvar."
            );
        }

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
            throw new DataBaseException(
                    "Integrity violation - product is related to other entities"
            );
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

        entity.setAvailable(dto.isAvailable());
        entity.setMaxQuantityPerOrder(
                dto.getMaxQuantityPerOrder()
        );

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