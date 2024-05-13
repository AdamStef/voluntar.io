package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.OrganisationDTO;
import pl.sumatywny.voluntario.model.user.Organisation;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.OrganisationRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrganisationService {

    private final OrganisationRepository organisationRepository;


    public Organisation createOrganisation(OrganisationDTO organisationDTO, User user) {
        Organisation organisation = Organisation.builder()
                .organisationName(organisationDTO.getOrganisationName())
                .organisationDescription(organisationDTO.getOrganisationDescription())
                .organisationPage(organisationDTO.getOrganisationPage())
                .address(organisationDTO.getAddress())
                .krs(organisationDTO.getKrs())
                .user(user).build();
        return organisationRepository.save(organisation);
    }

    public List<Organisation> getAllOrganisations() {
        return organisationRepository.findAll();
    }


    public Organisation getOrganisation(Long organisationID) {
        return organisationRepository.findById(organisationID)
                .orElseThrow(() -> new NoSuchElementException(String.format("Organisation %d not found.", organisationID)));
    }

    public Organisation getUserOrganisation(Long userID) {
        return organisationRepository.findOrganisationByUserId(userID);
    }

}
