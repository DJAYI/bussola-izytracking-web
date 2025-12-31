package com.bussola.izytracking.features.auth.domain.exceptions;

public class InvalidCredentialsException extends AuthException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }

    @Override
    public String getErrorCode() {
        return "AUTH_INVALID_CREDENTIALS";
    }
}
