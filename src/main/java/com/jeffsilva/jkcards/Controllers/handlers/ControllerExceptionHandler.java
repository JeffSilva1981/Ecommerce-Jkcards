package com.jeffsilva.jkcards.Controllers.handlers;

import com.jeffsilva.jkcards.Dtos.CustomError;
import com.jeffsilva.jkcards.Dtos.ValidationError;
import com.jeffsilva.jkcards.Services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.Services.exceptions.ResourceNotFoundException;
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
    public ResponseEntity<CustomError> customError(ResourceNotFoundException e, HttpServletRequest request){

        HttpStatus status = HttpStatus.NOT_FOUND;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(DataBaseException.class)
    public ResponseEntity<CustomError> customError(DataBaseException e, HttpServletRequest request){

        HttpStatus status = HttpStatus.CONFLICT;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CustomError> methodArgumentNotValid(MethodArgumentNotValidException e, HttpServletRequest request){

        HttpStatus status = HttpStatus.BAD_REQUEST;
        ValidationError error = new ValidationError(Instant.now(), status.value(), "Validation exception", request.getRequestURI());
        for (FieldError f : e.getBindingResult().getFieldErrors()){
            error.addError(f.getField(), f.getDefaultMessage());
        }
        return ResponseEntity.status(status).body(error);
    }
}
