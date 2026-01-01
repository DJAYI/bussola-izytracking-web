package com.bussola.izytracking.features.companies.application.transport_provider.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.companies.application.transport_provider.dto.TransportProviderResponse;
import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderNotFoundForUserException;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries.GetMyTransportProviderProfileQuery;

@Service
public class GetMyTransportProviderProfileUsecase {

    private final TransportProviderRepository transportProviderRepository;

    public GetMyTransportProviderProfileUsecase(TransportProviderRepository transportProviderRepository) {
        this.transportProviderRepository = transportProviderRepository;
    }

    public TransportProviderResponse execute(GetMyTransportProviderProfileQuery query) {
        TransportProvider transportProvider = transportProviderRepository.findByUserId(query.userId())
                .orElseThrow(() -> new TransportProviderNotFoundForUserException(query.userId()));

        return TransportProviderResponse.fromDomain(transportProvider);
    }
}
