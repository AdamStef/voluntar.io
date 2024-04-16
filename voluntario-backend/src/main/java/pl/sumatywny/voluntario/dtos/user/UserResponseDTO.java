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
    private Set<String> roles;

    public static UserResponseDTO mapFromUser(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .roles(user.getRoles().stream()
                        .map(UserRole::getRole)
                        .map(role -> role.name().split("ROLE_")[1])
                        .collect(Collectors.toSet()))
                .build();
    }
}