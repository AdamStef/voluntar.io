package pl.sumatywny.voluntario.mapper;

import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.dtos.user.OrganizationOwnerDTO;
import pl.sumatywny.voluntario.model.user.Organization;

public class OrganizationMapper {
    public static OrganizationResponseDTO mapToDTO(Organization organization) {
        return OrganizationResponseDTO.builder()
                .id(organization.getId())
                .name(organization.getName())
                .description(organization.getDescription())
                .address(organization.getAddress())
                .krs(organization.getKrs())
                .website(organization.getWebsite())
                .owner(OrganizationOwnerDTO.mapFromUser(organization.getUser()))
                .build();
    }
}
