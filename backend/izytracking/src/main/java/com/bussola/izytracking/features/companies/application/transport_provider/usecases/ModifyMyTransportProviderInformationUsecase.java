package com.bussola.izytracking.features.companies.application.transport_provider.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.companies.application.transport_provider.dto.TransportProviderResponse;
import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderNotFoundForUserException;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands.ModifyMyTransportProviderInformationCommand;

@Service
public class ModifyMyTransportProviderInformationUsecase {

    private final TransportProviderRepository transportProviderRepository;

    public ModifyMyTransportProviderInformationUsecase(TransportProviderRepository transportProviderRepository) {
        this.transportProviderRepository = transportProviderRepository;
    }

    public TransportProviderResponse execute(ModifyMyTransportProviderInformationCommand command) {
        TransportProvider transportProvider = transportProviderRepository.findByUserId(command.userId())
                .orElseThrow(() -> new TransportProviderNotFoundForUserException(command.userId()));

        TransportProvider updatedTransportProvider = transportProvider.withUpdatedInformation(
                command.addressDetails(),
                command.contactInformation());

        TransportProvider saved = transportProviderRepository.update(updatedTransportProvider);
        return TransportProviderResponse.fromDomain(saved);
    }
}
