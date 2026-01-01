package com.bussola.izytracking.features.companies.domain.exceptions;

import java.util.UUID;

public class AgencyNotFoundException extends CompanyException {

    public AgencyNotFoundException(UUID agencyId) {
        super("Agency not found with ID: " + agencyId);
    }

    @Override
    public String getErrorCode() {
        return "AGENCY_NOT_FOUND";
    }
}
