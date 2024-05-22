package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.OrganizationDTO;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.OrganizationRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;


    public Organization createOrganization(OrganizationDTO organizationDTO, User user) {
        Organization organization = Organization.builder()
                .name(organizationDTO.getName())
                .description(organizationDTO.getDescription())
                .website(organizationDTO.getWebsite())
                .address(organizationDTO.getAddress())
                .krs(organizationDTO.getKrs())
                .user(user).build();
        return organizationRepository.save(organization);
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }


    public Organization getOrganization(Long organizationID) {
        return organizationRepository.findById(organizationID)
                .orElseThrow(() -> new NoSuchElementException(String.format("Organization %d not found.", organizationID)));
    }

    public Organization getUserOrganization(Long userID) {
        return organizationRepository.findOrganizationByUserId(userID);
    }

}
