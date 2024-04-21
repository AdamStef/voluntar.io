package pl.sumatywny.voluntario.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.RegisterDTO;
import pl.sumatywny.voluntario.dtos.auth.AuthRequestDTO;
import pl.sumatywny.voluntario.dtos.user.UserResponseDTO;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.userdetails.CustomUserDetails;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;


    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO registerDTO) {
        User user = authService.register(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponseDTO.mapFromUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequestDTO authDTO) {
//        return ResponseEntity.ok()
//                .header(
//                        HttpHeaders.AUTHORIZATION,
//                        authService.login(authDTO).getAccessToken()
//                ).build();
        return ResponseEntity.ok().body(authService.login(authDTO));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> status(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var principal = (CustomUserDetails) authentication.getPrincipal();
        var user = userService.getUserByEmail(principal.getUsername());

        return ResponseEntity.ok().body(UserResponseDTO.mapFromUser(user));
    }
}
