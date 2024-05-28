package pl.sumatywny.voluntario.mapper;

import pl.sumatywny.voluntario.dtos.OrganizationDTO;
import pl.sumatywny.voluntario.model.user.Organization;

public class OrganizationMapper {
    public static OrganizationDTO mapToDTO(Organization organization) {
        return OrganizationDTO.builder()
                .id(organization.getId())
                .name(organization.getName())
                .description(organization.getDescription())
                .address(organization.getAddress())
                .krs(organization.getKrs())
                .website(organization.getWebsite())
                .build();
    }
}
