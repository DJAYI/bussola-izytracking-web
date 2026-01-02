package com.bussola.izytracking.features.companies.application.agency.dto;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;

public record UpdateMyAgencyRequest(
        AddressDetails addressDetails,
        ContactInformation contactInformation) {
}
