package com.bussola.izytracking.features.companies.domain.value_objects;

import com.bussola.izytracking.features.companies.domain.enums.DocumentType;
import com.bussola.izytracking.features.companies.domain.enums.PersonType;

public class LegalDocumentationDetails {

    private final String documentNumber;
    private final DocumentType documentType;
    private final PersonType personType;

    public LegalDocumentationDetails(
            String documentNumber,
            DocumentType documentType,
            PersonType personType) {
        this.personType = requireNonNull(personType, "Person type is required");
        this.documentType = requireNonNull(documentType, "Document type is required");
        this.documentNumber = validateDocumentNumber(documentNumber);
        validateCompatibility(this.personType, this.documentType);
    }

    private String validateDocumentNumber(String documentNumber) {
        requireNotBlank(documentNumber, "Document number is required");

        String normalized = documentNumber.replaceAll("[^0-9]", "");

        if (normalized.length() < 5 || normalized.length() > 15) {
            throw new IllegalArgumentException("Document number must have between 5 and 15 digits");
        }

        return normalized;
    }

    private void validateCompatibility(PersonType personType, DocumentType documentType) {

        switch (personType) {
            case NATURAL -> {
                if (documentType == DocumentType.NIT) {
                    throw new IllegalArgumentException(
                            "NATURAL person cannot have NIT document type");
                }
            }
            case JURIDICAL -> {
                if (documentType == DocumentType.CC || documentType == DocumentType.CE) {
                    throw new IllegalArgumentException(
                            "JURIDICAL person cannot have CC or CE document type");
                }
            }
        }
    }

    private static void requireNotBlank(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

    private static <T> T requireNonNull(T value, String message) {
        if (value == null) {
            throw new IllegalArgumentException(message);
        }
        return value;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public PersonType getPersonType() {
        return personType;
    }
}
