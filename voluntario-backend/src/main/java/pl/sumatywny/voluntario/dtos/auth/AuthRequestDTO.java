package pl.sumatywny.voluntario.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDTO {
    @Email(message = "Invalid email format.")
    @NotBlank(message = "Email is required.")
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    @NotBlank(message = "Password is required.")
    private String password;
}
