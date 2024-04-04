package pl.sumatywny.voluntario.dtos.user;

import lombok.*;
import pl.sumatywny.voluntario.model.user.UserRole;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserResponseDTO {
    private Long id;
    private String email;
    private Set<UserRole> roles;
}