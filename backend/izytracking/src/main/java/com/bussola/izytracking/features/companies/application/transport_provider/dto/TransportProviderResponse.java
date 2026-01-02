package com.bussola.izytracking.features.companies.application.transport_provider.dto;

import java.util.UUID;

import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;

public record TransportProviderResponse(
                UUID id,
                UUID userId,
                String displayName,
                LegalDocumentationResponse legalDocumentation,
                AddressResponse address,
                ContactResponse contact) {

        public static TransportProviderResponse fromDomain(TransportProvider agency) {
                return new TransportProviderResponse(
                                agency.getId(),
                                agency.getUserId(),
                                agency.getDisplayName(),
                                new LegalDocumentationResponse(
                                                agency.getLegalDocumentationDetails().getDocumentNumber(),
                                                agency.getLegalDocumentationDetails().getDocumentType().name(),
                                                agency.getLegalDocumentationDetails().getPersonType().name()),
                                new AddressResponse(
                                                agency.getAddressDetails().getStreet(),
                                                agency.getAddressDetails().getCity(),
                                                agency.getAddressDetails().getState(),
                                                agency.getAddressDetails().getPostalCode(),
                                                agency.getAddressDetails().getCountry()),
                                new ContactResponse(
                                                agency.getContactInformation().getEmail(),
                                                agency.getContactInformation().getPhoneNumber(),
                                                agency.getContactInformation().getMobileNumber()));
        }

        public record LegalDocumentationResponse(
                        String documentNumber,
                        String documentType,
                        String personType) {
        }

        public record AddressResponse(
                        String street,
                        String city,
                        String state,
                        String postalCode,
                        String country) {
        }

        public record ContactResponse(
                        String email,
                        String phoneNumber,
                        String mobileNumber) {
        }
}
