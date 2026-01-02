package com.bussola.izytracking.features.companies.application.agency.usecases;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bussola.izytracking.features.companies.application.agency.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyNotFoundForUserException;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.ModifyMyAgencyInformationCommand;

@Service
public class ModifyMyAgencyInformationUsecase {

    private final AgencyRepository agencyRepository;

    public ModifyMyAgencyInformationUsecase(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    @Transactional
    public AgencyResponse execute(ModifyMyAgencyInformationCommand command) {
        Agency existingAgency = agencyRepository.findByUserId(command.userId())
                .orElseThrow(() -> new AgencyNotFoundForUserException(command.userId()));

        Agency updatedAgency = existingAgency.withUpdatedInformation(
                command.addressDetails(),
                command.contactInformation());

        Agency savedAgency = agencyRepository.update(updatedAgency);

        return AgencyResponse.fromDomain(savedAgency);
    }
}
