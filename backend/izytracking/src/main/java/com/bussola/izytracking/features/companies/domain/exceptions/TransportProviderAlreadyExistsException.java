package com.bussola.izytracking.features.companies.domain.exceptions;

public class TransportProviderAlreadyExistsException extends CompanyException {

    public TransportProviderAlreadyExistsException(String documentNumber) {
        super("Agency already exists with document number: " + documentNumber);
    }

    @Override
    public String getErrorCode() {
        return "AGENCY_ALREADY_EXISTS";
    }
}
