package com.bussola.izytracking.features.companies.application.agency.usecases;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.api.dto.PaginatedResponse;
import com.bussola.izytracking.features.companies.application.agency.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.ListAgenciesQuery;

@Service
public class ListAgenciesUsecase {

    private final AgencyRepository agencyRepository;

    public ListAgenciesUsecase(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    public PaginatedResponse<AgencyResponse> execute(ListAgenciesQuery query) {
        Page<Agency> agenciesPage = agencyRepository.findAll(
                query.page(),
                query.size(),
                query.sortBy(),
                query.sortDirection());

        List<AgencyResponse> content = agenciesPage.getContent()
                .stream()
                .map(AgencyResponse::fromDomain)
                .toList();

        return PaginatedResponse.of(
                content,
                agenciesPage.getNumber(),
                agenciesPage.getSize(),
                agenciesPage.getTotalElements());
    }
}
