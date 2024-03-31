package pl.sumatywny.voluntario.dtos;

import lombok.Data;

import java.util.Set;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private Set<String> roles;
}
