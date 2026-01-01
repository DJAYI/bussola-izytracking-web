package com.bussola.izytracking.config.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.bussola.izytracking.config.api.dto.ErrorResponse;
import com.bussola.izytracking.features.auth.domain.exceptions.AuthException;
import com.bussola.izytracking.features.auth.domain.exceptions.InvalidCredentialsException;
import com.bussola.izytracking.features.auth.domain.exceptions.UserNotFoundException;
import com.bussola.izytracking.features.auth.domain.exceptions.UserNotActiveException;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyAlreadyExistsException;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyNotFoundException;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyNotFoundForUserException;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderAlreadyExistsException;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderNotFoundException;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderNotFoundForUserException;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<ErrorResponse> handleInvalidCredentials(
                        InvalidCredentialsException ex, WebRequest request) {
                logger.warn("Invalid credentials attempt: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponse.of(
                                                ex.getErrorCode(),
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleUserNotFound(
                        UserNotFoundException ex, WebRequest request) {
                logger.warn("User not found: {}", ex.getMessage());
                // Return generic message to avoid user enumeration
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponse.of(
                                                "AUTH_INVALID_CREDENTIALS",
                                                "Invalid email or password",
                                                getPath(request)));
        }

        @ExceptionHandler(UserNotActiveException.class)
        public ResponseEntity<ErrorResponse> handleUserNotActive(
                        UserNotActiveException ex, WebRequest request) {
                logger.warn("Inactive user login attempt: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(ErrorResponse.of(
                                                ex.getErrorCode(),
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ErrorResponse> handleBadCredentials(
                        BadCredentialsException ex, WebRequest request) {
                logger.warn("Bad credentials: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponse.of(
                                                "AUTH_INVALID_CREDENTIALS",
                                                "Invalid email or password",
                                                getPath(request)));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationErrors(
                        MethodArgumentNotValidException ex, WebRequest request) {
                List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> new ErrorResponse.FieldError(
                                                error.getField(),
                                                error.getDefaultMessage()))
                                .toList();

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ErrorResponse.of(
                                                "VALIDATION_ERROR",
                                                "Validation failed",
                                                getPath(request),
                                                fieldErrors));
        }

        @ExceptionHandler(AuthException.class)
        public ResponseEntity<ErrorResponse> handleAuthException(
                        AuthException ex, WebRequest request) {
                logger.error("Auth error: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponse.of(
                                                ex.getErrorCode(),
                                                ex.getMessage(),
                                                getPath(request)));
        }

        // Agency Exceptions
        @ExceptionHandler(AgencyNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleAgencyNotFound(
                        AgencyNotFoundException ex, WebRequest request) {
                logger.warn("Agency not found: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.of(
                                                "AGENCY_NOT_FOUND",
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(AgencyAlreadyExistsException.class)
        public ResponseEntity<ErrorResponse> handleAgencyAlreadyExists(
                        AgencyAlreadyExistsException ex, WebRequest request) {
                logger.warn("Agency already exists: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ErrorResponse.of(
                                                "AGENCY_ALREADY_EXISTS",
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(AgencyNotFoundForUserException.class)
        public ResponseEntity<ErrorResponse> handleAgencyNotFoundForUser(
                        AgencyNotFoundForUserException ex, WebRequest request) {
                logger.warn("Agency not found for user: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.of(
                                                "AGENCY_NOT_FOUND_FOR_USER",
                                                ex.getMessage(),
                                                getPath(request)));
        }

        // Transport Provider Exceptions
        @ExceptionHandler(TransportProviderNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleTransportProviderNotFound(
                        TransportProviderNotFoundException ex, WebRequest request) {
                logger.warn("Transport provider not found: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.of(
                                                "TRANSPORT_PROVIDER_NOT_FOUND",
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(TransportProviderAlreadyExistsException.class)
        public ResponseEntity<ErrorResponse> handleTransportProviderAlreadyExists(
                        TransportProviderAlreadyExistsException ex, WebRequest request) {
                logger.warn("Transport provider already exists: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ErrorResponse.of(
                                                "TRANSPORT_PROVIDER_ALREADY_EXISTS",
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(TransportProviderNotFoundForUserException.class)
        public ResponseEntity<ErrorResponse> handleTransportProviderNotFoundForUser(
                        TransportProviderNotFoundForUserException ex, WebRequest request) {
                logger.warn("Transport provider not found for user: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.of(
                                                "TRANSPORT_PROVIDER_NOT_FOUND_FOR_USER",
                                                ex.getMessage(),
                                                getPath(request)));
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGenericException(
                        Exception ex, WebRequest request) {
                logger.error("Unexpected error", ex);
                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(ErrorResponse.of(
                                                "INTERNAL_ERROR",
                                                "An unexpected error occurred",
                                                getPath(request)));
        }

        private String getPath(WebRequest request) {
                return request.getDescription(false).replace("uri=", "");
        }
}
