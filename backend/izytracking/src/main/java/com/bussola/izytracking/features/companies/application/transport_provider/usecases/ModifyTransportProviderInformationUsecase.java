package com.bussola.izytracking.features.companies.application.transport_provider.usecases;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bussola.izytracking.features.companies.application.transport_provider.dto.TransportProviderResponse;
import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderNotFoundException;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands.ModifyTransportProviderInformationCommand;

@Service
public class ModifyTransportProviderInformationUsecase {

    private final TransportProviderRepository transportProviderRepository;

    public ModifyTransportProviderInformationUsecase(TransportProviderRepository transportProviderRepository) {
        this.transportProviderRepository = transportProviderRepository;
    }

    @Transactional
    public TransportProviderResponse execute(ModifyTransportProviderInformationCommand command) {
        TransportProvider existingTransportProvider = transportProviderRepository
                .findById(command.transportProviderId())
                .orElseThrow(() -> new TransportProviderNotFoundException(command.transportProviderId()));

        // Create updated agency with new information but keeping immutable fields
        TransportProvider updatedTransportProvider = existingTransportProvider.withUpdatedInformation(
                command.addressDetails(),
                command.contactInformation());

        TransportProvider savedTransportProvider = transportProviderRepository.update(updatedTransportProvider);
        return TransportProviderResponse.fromDomain(savedTransportProvider);
    }
}
