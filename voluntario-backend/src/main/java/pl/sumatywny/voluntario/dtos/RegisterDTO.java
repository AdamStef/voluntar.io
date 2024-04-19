package pl.sumatywny.voluntario.dtos;

import lombok.Data;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private String role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
