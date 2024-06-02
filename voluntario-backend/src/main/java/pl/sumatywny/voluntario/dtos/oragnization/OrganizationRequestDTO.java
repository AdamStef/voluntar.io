package pl.sumatywny.voluntario.dtos.oragnization;

import lombok.*;
import pl.sumatywny.voluntario.model.user.Organization;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrganizationRequestDTO {
    private Long id;
    private String name;
    private String description;
    private String krs;
    private String address;
    private String website;

    public OrganizationRequestDTO(Organization organization) {
        this.id = organization.getId();
        this.name = organization.getName();
        this.description = organization.getDescription();
        this.krs = organization.getKrs();
        this.address = organization.getAddress();
        this.website = organization.getWebsite();
    }
}
