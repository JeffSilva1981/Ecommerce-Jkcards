package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Dtos.CategoryDto;
import com.jeffsilva.jkcards.Dtos.ProductDto;
import com.jeffsilva.jkcards.Dtos.ProductMinDto;
import com.jeffsilva.jkcards.Repositories.CategoryRepository;
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

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    @Transactional(readOnly = true)
    public List<CategoryDto> findAll() {
        List<Category> result = repository.findAll();
        return result.stream().map(CategoryDto::new).toList();
    }

    @Transactional(readOnly = true)
    public CategoryDto findById(Long id) {
        Category entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category Not Found"));
        return new CategoryDto(entity);
    }

    @Transactional
    public CategoryDto created(CategoryDto dto) {
        Category entity = new Category();
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new CategoryDto(entity);
    }

    @Transactional
    public CategoryDto update(CategoryDto dto, Long id) {
        Category entity = repository.getReferenceById(id);
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new CategoryDto(entity);
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public void delete(Long id) {

        if (!repository.existsById(id)){
            throw new ResourceNotFoundException("Category not found");
        }
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e){
            throw new DataBaseException("Integrity violation - category is related to other entities");
        }
    }

    private void copyDtoToEntity(CategoryDto dto, Category entity) {
        entity.setName(dto.getName());
    }
}
