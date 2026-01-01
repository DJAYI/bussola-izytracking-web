package com.bussola.izytracking.features.companies.application.agency.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.companies.application.agency.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyNotFoundForUserException;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.GetMyAgencyProfileQuery;

@Service
public class GetMyAgencyProfileUsecase {

    private final AgencyRepository agencyRepository;

    public GetMyAgencyProfileUsecase(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    public AgencyResponse execute(GetMyAgencyProfileQuery query) {
        Agency agency = agencyRepository.findByUserId(query.userId())
                .orElseThrow(() -> new AgencyNotFoundForUserException(query.userId()));

        return AgencyResponse.fromDomain(agency);
    }
}
