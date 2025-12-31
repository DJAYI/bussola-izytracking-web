package com.bussola.izytracking.features.auth.domain.exceptions;

public class UserNotActiveException extends AuthException {

    public UserNotActiveException(String email) {
        super("User account is not active: " + email);
    }

    @Override
    public String getErrorCode() {
        return "AUTH_USER_NOT_ACTIVE";
    }
}
