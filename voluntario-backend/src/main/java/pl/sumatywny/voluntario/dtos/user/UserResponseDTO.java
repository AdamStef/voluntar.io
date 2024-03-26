package pl.sumatywny.voluntario.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.sumatywny.voluntario.model.user.UserRole;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private Set<UserRole> roles;
}