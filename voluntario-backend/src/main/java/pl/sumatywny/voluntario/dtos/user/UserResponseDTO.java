package pl.sumatywny.voluntario.dtos.user;

import lombok.*;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserResponseDTO {
    private Long id;
    private String email;
    private String role;

    public static UserResponseDTO mapFromUser(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().getRole().name().split("ROLE_")[1])
                .build();
    }
}