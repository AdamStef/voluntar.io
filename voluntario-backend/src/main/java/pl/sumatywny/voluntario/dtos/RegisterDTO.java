package pl.sumatywny.voluntario.dtos;

import lombok.Data;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private String role;
}
