package com.bussola.izytracking.features.companies.domain.entities.transport_providers;

import java.util.UUID;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;
import com.bussola.izytracking.features.companies.domain.value_objects.LegalDocumentationDetails;

public class TransportProvider {
    private final UUID id;
    private final String displayName;
    private final LegalDocumentationDetails legalDocumentationDetails;
    private final AddressDetails addressDetails;
    private final ContactInformation contactInformation;
    private final UUID userId;

    public TransportProvider(
            String displayName,
            LegalDocumentationDetails legalDocumentationDetails,
            AddressDetails addressDetails,
            ContactInformation contactInformation,
            UUID userId) {

        this.id = UUID.randomUUID();
        this.displayName = displayName;
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

    public String getDisplayName() {
        return displayName;
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

    /**
     * Private constructor for reconstitution from persistence
     */
    private TransportProvider(
            UUID id,
            String displayName,
            LegalDocumentationDetails legalDocumentationDetails,
            AddressDetails addressDetails,
            ContactInformation contactInformation,
            UUID userId) {
        this.id = id;
        this.displayName = displayName;
        this.legalDocumentationDetails = legalDocumentationDetails;
        this.addressDetails = addressDetails;
        this.contactInformation = contactInformation;
        this.userId = userId;
        validate();
    }

    /**
     * Factory method for reconstituting from persistence
     */
    public static TransportProvider reconstitute(
            UUID id,
            String displayName,
            LegalDocumentationDetails legalDocumentationDetails,
            AddressDetails addressDetails,
            ContactInformation contactInformation,
            UUID userId) {
        return new TransportProvider(id, displayName, legalDocumentationDetails, addressDetails, contactInformation,
                userId);
    }

    /**
     * Creates a new TransportProvider instance with updated address and contact
     * information.
     * Legal documentation, displayName and user association remain immutable.
     */
    public TransportProvider withUpdatedInformation(
            AddressDetails newAddressDetails,
            ContactInformation newContactInformation) {
        return new TransportProvider(
                this.id,
                this.displayName,
                this.legalDocumentationDetails,
                newAddressDetails != null ? newAddressDetails : this.addressDetails,
                newContactInformation != null ? newContactInformation : this.contactInformation,
                this.userId);
    }
}
