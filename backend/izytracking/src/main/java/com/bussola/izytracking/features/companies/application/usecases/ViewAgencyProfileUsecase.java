package com.bussola.izytracking.features.companies.application.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.companies.application.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyNotFoundException;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.ViewAgencyProfileQuery;

@Service
public class ViewAgencyProfileUsecase {

    private final AgencyRepository agencyRepository;

    public ViewAgencyProfileUsecase(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    public AgencyResponse execute(ViewAgencyProfileQuery query) {
        Agency agency = agencyRepository.findById(query.agencyId())
                .orElseThrow(() -> new AgencyNotFoundException(query.agencyId()));

        return AgencyResponse.fromDomain(agency);
    }
}
