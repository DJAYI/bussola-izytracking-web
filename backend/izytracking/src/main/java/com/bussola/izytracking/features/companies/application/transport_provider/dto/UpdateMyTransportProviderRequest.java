package com.bussola.izytracking.features.companies.application.transport_provider.dto;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;

public record UpdateMyTransportProviderRequest(
        AddressDetails addressDetails,
        ContactInformation contactInformation) {
}
