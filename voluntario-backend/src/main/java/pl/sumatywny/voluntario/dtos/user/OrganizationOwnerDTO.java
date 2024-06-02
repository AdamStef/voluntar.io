package pl.sumatywny.voluntario.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.model.user.User;

@Data
@Builder
@AllArgsConstructor
public class OrganizationOwnerDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;


    public static OrganizationOwnerDTO mapFromUser(User user) {

        var response = OrganizationOwnerDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .build();

        return response;
    }
}
