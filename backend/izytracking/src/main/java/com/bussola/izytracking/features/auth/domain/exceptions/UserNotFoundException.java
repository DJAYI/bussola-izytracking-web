package com.bussola.izytracking.features.auth.domain.exceptions;

public class UserNotFoundException extends AuthException {

    public UserNotFoundException(String email) {
        super("User not found with email: " + email);
    }

    @Override
    public String getErrorCode() {
        return "AUTH_USER_NOT_FOUND";
    }
}
