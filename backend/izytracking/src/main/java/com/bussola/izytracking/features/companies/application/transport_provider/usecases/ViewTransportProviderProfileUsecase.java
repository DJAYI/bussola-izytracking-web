package com.bussola.izytracking.features.companies.application.transport_provider.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.companies.application.transport_provider.dto.TransportProviderResponse;
import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderNotFoundException;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries.ViewTransportProviderProfileQuery;

@Service
public class ViewTransportProviderProfileUsecase {

    private final TransportProviderRepository transportProviderRepository;

    public ViewTransportProviderProfileUsecase(TransportProviderRepository transportProviderRepository) {
        this.transportProviderRepository = transportProviderRepository;
    }

    public TransportProviderResponse execute(ViewTransportProviderProfileQuery query) {
        TransportProvider transportProvider = transportProviderRepository.findById(query.transportProviderId())
                .orElseThrow(() -> new TransportProviderNotFoundException(query.transportProviderId()));

        return TransportProviderResponse.fromDomain(transportProvider);
    }
}
