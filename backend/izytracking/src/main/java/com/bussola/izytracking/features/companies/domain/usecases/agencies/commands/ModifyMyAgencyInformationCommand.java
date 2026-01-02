package com.bussola.izytracking.features.companies.domain.usecases.agencies.commands;

import java.util.UUID;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;

public record ModifyMyAgencyInformationCommand(
        UUID userId,
        AddressDetails addressDetails,
        ContactInformation contactInformation) {
}
