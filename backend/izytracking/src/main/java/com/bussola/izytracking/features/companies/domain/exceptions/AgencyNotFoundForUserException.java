package com.bussola.izytracking.features.companies.domain.exceptions;

import java.util.UUID;

public class AgencyNotFoundForUserException extends CompanyException {

    public AgencyNotFoundForUserException(UUID userId) {
        super("No agency found for user: " + userId);
    }

    @Override
    public String getErrorCode() {
        return "AGENCY_NOT_FOUND_FOR_USER";
    }
}
