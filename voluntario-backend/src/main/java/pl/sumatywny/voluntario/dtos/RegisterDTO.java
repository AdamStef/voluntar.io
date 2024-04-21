package pl.sumatywny.voluntario.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterDTO(
        @NotBlank(message = "Email cannot be empty")
        @Email(message = "Wrong email format")
        String email,

        @NotBlank(message = "Password cannot be empty")
        @Size(min = 8, message = "Password has to be at least 8 characters long")
        String password,

        @NotBlank(message = "Role cannot be empty")
        String role,

        @NotBlank(message = "First name cannot be empty")
        String firstName,

        @NotBlank(message = "Last name cannot be empty")
        String lastName,

        @NotBlank(message = "Phone number cannot be empty")
        String phoneNumber
) {}
