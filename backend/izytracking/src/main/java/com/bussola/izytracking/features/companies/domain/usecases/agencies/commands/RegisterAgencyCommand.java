package com.bussola.izytracking.features.companies.domain.usecases.agencies.commands;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;
import com.bussola.izytracking.features.companies.domain.value_objects.LegalDocumentationDetails;

public record RegisterAgencyCommand(
        // User credentials
        String displayName,
        String email,
        String password,
        // Agency details
        LegalDocumentationDetails legalDocumentationDetails,
        AddressDetails addressDetails,
        ContactInformation contactInformation) {
}
