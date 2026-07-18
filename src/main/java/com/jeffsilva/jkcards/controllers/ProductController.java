package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.dtos.ProductDto;
import com.jeffsilva.jkcards.dtos.ProductMinDto;
import com.jeffsilva.jkcards.services.CloudinaryService;
import com.jeffsilva.jkcards.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;
    private final CloudinaryService cloudinaryService;

    public ProductController(
            ProductService service,
            CloudinaryService cloudinaryService
    ) {
        this.service = service;
        this.cloudinaryService =
                cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductMinDto>>
    findAll(
            @RequestParam(
                    name = "name",
                    defaultValue = ""
            )
            String name,

            @RequestParam(
                    name = "categoryId",
                    required = false
            )
            Long categoryId,

            @RequestParam(
                    name = "excludeCategoryId",
                    required = false
            )
            Long excludeCategoryId,

            @RequestParam(
                    name = "inStock",
                    defaultValue = "false"
            )
            boolean inStock,

            Pageable pageable
    ) {
        Page<ProductMinDto> result =
                service.findAll(
                        name,
                        categoryId,
                        excludeCategoryId,
                        inStock,
                        pageable
                );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> findById(
            @PathVariable Long id
    ) {
        ProductDto result =
                service.findById(id);

        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDto> created(
            @Valid @RequestBody ProductDto dto
    ) {
        ProductDto result =
                service.insert(dto);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(result.getId())
                .toUri();

        return ResponseEntity
                .created(uri)
                .body(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(
            @Valid @RequestBody ProductDto dto,
            @PathVariable Long id
    ) {
        ProductDto result =
                service.update(id, dto);

        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file")
            MultipartFile file
    ) {
        String imageUrl =
                cloudinaryService.uploadImage(file);

        return ResponseEntity.ok(imageUrl);
    }
}