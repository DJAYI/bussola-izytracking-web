package com.bussola.izytracking.features.auth.domain.exceptions;

public class InvalidTokenException extends AuthException {

    public InvalidTokenException() {
        super("Invalid or expired token");
    }

    public InvalidTokenException(String message) {
        super(message);
    }

    @Override
    public String getErrorCode() {
        return "AUTH_INVALID_TOKEN";
    }
}
