package com.bussola.izytracking.features.companies.domain.exceptions;

import java.util.UUID;

public class TransportProviderNotFoundException extends CompanyException {

    public TransportProviderNotFoundException(UUID transportProviderId) {
        super("Transport provider not found with ID: " + transportProviderId);
    }

    @Override
    public String getErrorCode() {
        return "TRANSPORT_PROVIDER_NOT_FOUND";
    }
}
