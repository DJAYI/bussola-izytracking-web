package com.bussola.izytracking.features.companies.domain.exceptions;

import java.util.UUID;

public class UserAlreadyHasTransportProviderException extends CompanyException {

    public UserAlreadyHasTransportProviderException(UUID userId) {
        super("User already has an associated agency: " + userId);
    }

    @Override
    public String getErrorCode() {
        return "USER_ALREADY_HAS_AGENCY";
    }
}
