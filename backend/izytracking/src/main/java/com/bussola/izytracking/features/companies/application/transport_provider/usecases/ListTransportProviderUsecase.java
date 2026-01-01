package com.bussola.izytracking.features.companies.application.transport_provider.usecases;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.api.dto.PaginatedResponse;
import com.bussola.izytracking.features.companies.application.transport_provider.dto.TransportProviderResponse;
import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries.ListTransportProvidersQuery;

@Service
public class ListTransportProviderUsecase {

    private final TransportProviderRepository transportProviderRepository;

    public ListTransportProviderUsecase(TransportProviderRepository transportProviderRepository) {
        this.transportProviderRepository = transportProviderRepository;
    }

    public PaginatedResponse<TransportProviderResponse> execute(ListTransportProvidersQuery query) {
        Page<TransportProvider> transportProviderPage = transportProviderRepository.findAll(
                query.page(),
                query.size(),
                query.sortBy(),
                query.sortDirection());

        List<TransportProviderResponse> content = transportProviderPage.getContent()
                .stream()
                .map(TransportProviderResponse::fromDomain)
                .toList();

        return PaginatedResponse.of(
                content,
                transportProviderPage.getNumber(),
                transportProviderPage.getSize(),
                transportProviderPage.getTotalElements());
    }
}
