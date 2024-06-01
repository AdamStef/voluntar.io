package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.OrganizationDTO;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.OrganizationRepository;

import java.time.LocalDateTime;
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
                .user(user)
                .verified(false)
                .creationDate(LocalDateTime.now())
                .verificationDate(null)
                .build();
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

    public String verifyOrganization(Long organizationID) {
        var organization = organizationRepository.findById(organizationID);
        if (!organization.isEmpty()) {
            organization.get().setVerified(true);
            organization.get().setVerificationDate(LocalDateTime.now());
            organizationRepository.save(organization.get());
            return String.format("Organization %d verified successfully", organizationID);
        } else {
            throw new NoSuchElementException(String.format("Organization %d not found.", organizationID));
        }
    }

}
