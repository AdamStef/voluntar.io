package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintResponseDTO;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationRequestDTO;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.OrganizationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;


    public Organization createOrganization(OrganizationRequestDTO organizationRequestDTO, User user) {
        Organization organization = Organization.builder()
                .name(organizationRequestDTO.getName())
                .description(organizationRequestDTO.getDescription())
                .website(organizationRequestDTO.getWebsite())
                .address(organizationRequestDTO.getAddress())
                .krs(organizationRequestDTO.getKrs())
                .user(user)
                .verified(false)
                .creationDate(LocalDateTime.now())
                .verificationDate(null)
                .build();
        return organizationRepository.save(organization);
    }

    public List<OrganizationResponseDTO> getAllOrganizations() {
        return organizationRepository.findAll().stream().map(OrganizationResponseDTO::new).collect(Collectors.toList());
    }


    public OrganizationResponseDTO getOrganization(Long organizationID) {
        return new OrganizationResponseDTO(organizationRepository.findById(organizationID)
                .orElseThrow(() -> new NoSuchElementException(String.format("Organization %d not found.", organizationID))));
    }

    public Organization getUserOrganization(Long userID) {
        return organizationRepository.findOrganizationByUserId(userID);
    }

    public List<OrganizationResponseDTO> getUnverifiedOrganizations() {
        return organizationRepository.findByVerifiedFalse().stream().map(OrganizationResponseDTO::new).collect(Collectors.toList());
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

//    public String verifyOrganization(Long userID) {
//        Organization organization = organizationRepository.findOrganizationByUserId(userID);
//        if (organization != null) {
//            organization.getUser().setIsVerified(true);
//            organizationRepository.save(organization);
//            return "Organization verified";
//        } else {
//            throw new RuntimeException("Organization not found for user id: " + userID);
//        }
//    }

}
