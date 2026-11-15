package com.kichbansat.common.exception;

import com.kichbansat.common.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<Void>> handleBaseException(BaseException ex) {
        log.warn("Business exception caught: code={}, message={}", ex.getErrorCode().name(), ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), ex.getErrorCode().name());
        return ResponseEntity.status(ex.getErrorCode().getHttpStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        List<ApiResponse.ValidationErrorDetail> errors = new ArrayList<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.add(new ApiResponse.ValidationErrorDetail(fieldError.getField(), fieldError.getDefaultMessage()));
        }
        ApiResponse<Void> response = ApiResponse.error(
                ErrorCode.VALIDATION_FAILED.getDefaultMessage(),
                ErrorCode.VALIDATION_FAILED.name(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        List<ApiResponse.ValidationErrorDetail> errors = new ArrayList<>();
        ex.getConstraintViolations().forEach(violation ->
                errors.add(new ApiResponse.ValidationErrorDetail(violation.getPropertyPath().toString(), violation.getMessage()))
        );
        ApiResponse<Void> response = ApiResponse.error(
                ErrorCode.VALIDATION_FAILED.getDefaultMessage(),
                ErrorCode.VALIDATION_FAILED.name(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                ErrorCode.FORBIDDEN_ACTION.getDefaultMessage(),
                ErrorCode.FORBIDDEN_ACTION.name()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                ErrorCode.UNAUTHORIZED_ACCESS.getDefaultMessage(),
                ErrorCode.UNAUTHORIZED_ACCESS.name()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(NoResourceFoundException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                ErrorCode.RESOURCE_NOT_FOUND.getDefaultMessage(),
                ErrorCode.RESOURCE_NOT_FOUND.name()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("Unhandled internal server error: ", ex);
        ApiResponse<Void> response = ApiResponse.error(
                ErrorCode.INTERNAL_SERVER_ERROR.getDefaultMessage(),
                ErrorCode.INTERNAL_SERVER_ERROR.name()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
