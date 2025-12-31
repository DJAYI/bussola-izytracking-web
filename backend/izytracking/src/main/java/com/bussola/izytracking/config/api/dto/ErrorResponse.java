package com.bussola.izytracking.config.api.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        String code,
        String message,
        String path,
        List<FieldError> errors,
        LocalDateTime timestamp) {
    public record FieldError(String field, String message) {
    }

    public static ErrorResponse of(String code, String message, String path) {
        return new ErrorResponse(code, message, path, null, LocalDateTime.now());
    }

    public static ErrorResponse of(String code, String message, String path, List<FieldError> errors) {
        return new ErrorResponse(code, message, path, errors, LocalDateTime.now());
    }
}
