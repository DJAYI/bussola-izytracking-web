package com.bussola.izytracking.features.companies.domain.exceptions;

public abstract class CompanyException extends RuntimeException {

    protected CompanyException(String message) {
        super(message);
    }

    protected CompanyException(String message, Throwable cause) {
        super(message, cause);
    }

    public abstract String getErrorCode();
}
