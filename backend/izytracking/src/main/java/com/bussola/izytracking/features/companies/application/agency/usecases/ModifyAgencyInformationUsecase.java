package com.bussola.izytracking.features.companies.application.agency.usecases;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bussola.izytracking.features.companies.application.agency.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyNotFoundException;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.ModifyAgencyInformationCommand;

@Service
public class ModifyAgencyInformationUsecase {

    private final AgencyRepository agencyRepository;

    public ModifyAgencyInformationUsecase(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    @Transactional
    public AgencyResponse execute(ModifyAgencyInformationCommand command) {
        Agency existingAgency = agencyRepository.findById(command.agencyId())
                .orElseThrow(() -> new AgencyNotFoundException(command.agencyId()));

        // Create updated agency with new information but keeping immutable fields
        Agency updatedAgency = existingAgency.withUpdatedInformation(
                command.addressDetails(),
                command.contactInformation());

        Agency savedAgency = agencyRepository.update(updatedAgency);

        return AgencyResponse.fromDomain(savedAgency);
    }
}
