package com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands;

import java.util.UUID;

import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;

public record ModifyTransportProviderInformationCommand(
                UUID transportProviderId,
                AddressDetails addressDetails,
                ContactInformation contactInformation) {

}
