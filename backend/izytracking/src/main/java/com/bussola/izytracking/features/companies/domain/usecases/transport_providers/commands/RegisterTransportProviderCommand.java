package com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;
import com.bussola.izytracking.features.companies.domain.value_objects.LegalDocumentationDetails;

public record RegisterTransportProviderCommand(
                // User credentials
                String displayName,
                String email,
                String password,
                // Transport provider details
                LegalDocumentationDetails legalDocumentationDetails,
                AddressDetails addressDetails,
                ContactInformation contactInformation) {
}
