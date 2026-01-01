package com.bussola.izytracking.features.companies.domain.entities.agencies;

import java.util.UUID;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;
import com.bussola.izytracking.features.companies.domain.value_objects.LegalDocumentationDetails;

public class Agency {
    private final UUID id;
    private final LegalDocumentationDetails legalDocumentationDetails;
    private final AddressDetails addressDetails;
    private final ContactInformation contactInformation;
    private final UUID userId;

    public Agency(
            LegalDocumentationDetails legalDocumentationDetails,
            AddressDetails addressDetails,
            ContactInformation contactInformation,
            UUID userId) {

        this.id = UUID.randomUUID();
        this.legalDocumentationDetails = legalDocumentationDetails;
        this.addressDetails = addressDetails;
        this.contactInformation = contactInformation;
        this.userId = userId;

        validate();
    }

    /**
     * Validaciones de dominio
     */
    public void validate() {

        if (legalDocumentationDetails == null) {
            throw new IllegalArgumentException(
                    "Legal documentation details must not be null");
        }

        if (addressDetails == null) {
            throw new IllegalArgumentException(
                    "Address details must not be null");
        }

        if (contactInformation == null) {
            throw new IllegalArgumentException(
                    "Contact information must not be null");
        }

        if (userId == null) {
            throw new IllegalArgumentException(
                    "User ID must not be null");
        }
    }

    // Getters

    public UUID getId() {
        return id;
    }

    public LegalDocumentationDetails getLegalDocumentationDetails() {
        return legalDocumentationDetails;
    }

    public AddressDetails getAddressDetails() {
        return addressDetails;
    }

    public ContactInformation getContactInformation() {
        return contactInformation;
    }

    public UUID getUserId() {
        return userId;
    }
}
