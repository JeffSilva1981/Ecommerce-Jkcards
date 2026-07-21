package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.tests.Factory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class ProductServiceTests {

    @InjectMocks
    private ProductService service;

    @Mock
    private ProductRepository repository;

    private long existingId;
    private long nonExistingId;
    private long dependentId;

    private PageImpl<Product> page;
    private Product product;
    private Pageable pageable;
    private ProductDto productDto;

    @BeforeEach
    void setUp() {
        existingId = 1L;
        nonExistingId = 1000L;
        dependentId = 2L;

        product = Factory.createProduct();

        page = new PageImpl<>(List.of(product));
        pageable = Pageable.unpaged();
        productDto = Factory.createProductDto();
    }

    @Test
    public void findAllShouldReturnPageOfProductsWhenNameIsNull() {
        Mockito.when(
                repository.search("", null, null, false, pageable)).thenReturn(page);

        var result = service.findAll(null, null, pageable);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals(product.getName(), result.getContent().get(0).getName());

        Mockito.verify(repository, Mockito.times(1)).search("", null, null, false, pageable);
    }

    @Test
    public void findAllShouldReturnPageOfProductsWhenNameIsBlank() {
        String name = " ";
        Mockito.when(repository.search("", null, null, false, pageable)).thenReturn(page);

        var result = service.findAll(name, null, pageable);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals(product.getName(), result.getContent().get(0).getName());

        Mockito.verify(repository, Mockito.times(1)).search("", null, null, false, pageable);
    }

    @Test
    public void findAllShouldReturnPageOfProductsWhenNameIsNotBlank() {
        String name = "booster";

        Mockito.when(repository.search(name, null, null, false, pageable)).thenReturn(page);

        var result = service.findAll(name, null, pageable);

        Assertions.assertFalse(result.isEmpty());

        Assertions.assertEquals(1, result.getTotalElements());

        Assertions.assertEquals(product.getName(), result.getContent().get(0).getName());

        Mockito.verify(repository, Mockito.times(1)).search(name, null, null, false, pageable);
    }

    @Test
    public void findAllShouldForwardCategoryExclusionAndStockFilters() {
        String name = "carta";
        Long categoryId = 6L;
        Long excludeCategoryId = 3L;
        boolean inStock = true;

        Mockito.when(repository.search(name, categoryId, excludeCategoryId, inStock, pageable)).thenReturn(page);

        var result = service.findAll(name, categoryId, excludeCategoryId, inStock, pageable);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(1, result.getTotalElements());

        Mockito.verify(repository, Mockito.times(1)).search(name, categoryId, excludeCategoryId, inStock, pageable);
    }

    @Test
    public void findByIdShouldReturnProductDtoWhenExistingId() {
        Mockito.when(
                repository.findById(existingId)
        ).thenReturn(
                Optional.of(product)
        );

        var result =
                service.findById(existingId);

        Assertions.assertNotNull(result);

        Assertions.assertEquals(
                product.getName(),
                result.getName()
        );

        Assertions.assertEquals(
                product.getDescription(),
                result.getDescription()
        );

        Assertions.assertEquals(
                product.getPrice(),
                result.getPrice()
        );

        Mockito.verify(
                repository,
                Mockito.times(1)
        ).findById(existingId);
    }

    @Test
    public void findByIdShouldThrowResourceNotFoundExceptionWhenNonExistingId() {
        Mockito.when(repository.findById(nonExistingId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class, () -> service.findById(nonExistingId));

        Mockito.verify(repository, Mockito.times(1)).findById(nonExistingId);
    }

    @Test
    public void insertShouldReturnProductDtoWhenValidData() {
        Mockito.when(repository.save(ArgumentMatchers.any())).thenReturn(product);

        var result = service.insert(productDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(productDto.getName(), result.getName());
        Assertions.assertEquals(productDto.getDescription(), result.getDescription());
        Assertions.assertEquals(productDto.getPrice(), result.getPrice());
        Assertions.assertEquals(productDto.getImgUrl(), result.getImgUrl());
        Assertions.assertEquals(productDto.getCategories().size(), result.getCategories().size());

        Mockito.verify(repository, Mockito.times(1)).save(ArgumentMatchers.any());
    }

    @Test
    public void updateShouldUpdateProductWhenExistingId() {
        Mockito.when(repository.findById(existingId)).thenReturn(Optional.of(product));

        Mockito.when(repository.save(ArgumentMatchers.any())).thenReturn(product);

        var result = service.update(existingId, productDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(productDto.getName(), result.getName());
        Assertions.assertEquals(productDto.getDescription(), result.getDescription());
        Assertions.assertEquals(productDto.getPrice(), result.getPrice());
        Assertions.assertEquals(productDto.getImgUrl(), result.getImgUrl());
        Assertions.assertEquals(productDto.getCategories().size(), result.getCategories().size());

        Mockito.verify(repository, Mockito.times(1)).findById(existingId);

        Mockito.verify(repository, Mockito.times(1)).save(ArgumentMatchers.any());
    }

    @Test
    public void updateShouldThrowResourceNotFoundExceptionWhenNonExistingId() {
        Mockito.when(repository.findById(nonExistingId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class, () -> service.update(nonExistingId, productDto));

        Mockito.verify(repository, Mockito.times(1)).findById(nonExistingId);
        Mockito.verify(repository, Mockito.never()).save(ArgumentMatchers.any());
    }

    @Test
    public void deleteShouldDoNothingWhenExistingId() {
        Mockito.when(repository.existsById(existingId)).thenReturn(true);
        Mockito.doNothing().when(repository).deleteById(existingId);

        service.delete(existingId);

        Mockito.verify(repository, Mockito.times(1)).deleteById(existingId);
        Mockito.verify(repository, Mockito.times(1)).existsById(existingId);
    }

    @Test
    public void deleteShouldThrowResourceNotFoundExceptionWhenNonExistingId() {
        Mockito.when(repository.existsById(nonExistingId)).thenReturn(false);

        Assertions.assertThrows(ResourceNotFoundException.class, () -> service.delete(nonExistingId));

        Mockito.verify(repository, Mockito.times(1)).existsById(nonExistingId);
        Mockito.verify(repository, Mockito.never()).deleteById(nonExistingId);
    }

    @Test
    public void deleteShouldThrowDataBaseExceptionWhenDependentId() {
        Mockito.when(repository.existsById(dependentId)).thenReturn(true);
        Mockito.doThrow(DataIntegrityViolationException.class).when(repository).deleteById(dependentId);

        Assertions.assertThrows(DataBaseException.class, () -> service.delete(dependentId));

        Mockito.verify(repository, Mockito.times(1)).existsById(dependentId);
        Mockito.verify(repository, Mockito.times(1)).deleteById(dependentId);
    }
}