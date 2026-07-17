package com.jeffsilva.jkcards.controllers.handlers;

import com.jeffsilva.jkcards.dtos.CustomError;
import com.jeffsilva.jkcards.dtos.ValidationError;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.services.exceptions.FileUploadException;
import com.jeffsilva.jkcards.services.exceptions.ForbiddenException;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CustomError> customError(ResourceNotFoundException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(DataBaseException.class)
    public ResponseEntity<CustomError> customError(DataBaseException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CustomError> methodArgumentNotValid(MethodArgumentNotValidException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        ValidationError error = new ValidationError(Instant.now(), status.value(), "Validation exception", request.getRequestURI());
        for (FieldError f : e.getBindingResult().getFieldErrors()) {
            error.addError(f.getField(), f.getDefaultMessage());
        }
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<CustomError> Forbidden(ForbiddenException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.FORBIDDEN;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<CustomError> fileUpload(FileUploadException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        CustomError error = new CustomError(Instant.now(), status.value(), "File upload error: " + e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }
}
