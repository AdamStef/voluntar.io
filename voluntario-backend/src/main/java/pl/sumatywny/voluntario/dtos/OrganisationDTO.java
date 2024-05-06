package pl.sumatywny.voluntario.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrganisationDTO {
    private String organisationName;
    private String organisationDescription;
    private String krs;
    private String address;
    private String organisationPage;
}
