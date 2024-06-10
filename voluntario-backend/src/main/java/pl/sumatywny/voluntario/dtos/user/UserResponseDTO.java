package pl.sumatywny.voluntario.dtos.user;

import lombok.*;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.mapper.OrganizationMapper;
import pl.sumatywny.voluntario.model.user.User;

import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserResponseDTO {
    private Long id;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Gender gender;
    private boolean isBanned;
    private OrganizationResponseDTO organization;

    public static UserResponseDTO mapFromUser(User user) {

        var response = UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().getRole().name().split("ROLE_")[1])
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .isBanned(user.getIsBanned())
                .build();

        if (user.getOrganization() != null) {
            response.setOrganization(OrganizationMapper.mapToDTO(user.getOrganization()));
        }

        return response;
    }
}