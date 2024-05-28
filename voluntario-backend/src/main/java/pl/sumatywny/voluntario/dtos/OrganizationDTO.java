package pl.sumatywny.voluntario.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrganizationDTO {
    private Long id;
    private String name;
    private String description;
    private String krs;
    private String address;
    private String website;
}
