package pl.sumatywny.voluntario.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.auth.AuthRequestDTO;
import pl.sumatywny.voluntario.dtos.auth.JwtResponseDTO;
import pl.sumatywny.voluntario.dtos.user.UserRequestDTO;
import pl.sumatywny.voluntario.service.JwtService;
import pl.sumatywny.voluntario.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public JwtResponseDTO authenticate(@RequestBody AuthRequestDTO authRequest, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(),authRequest.getPassword()));

        if (authentication.isAuthenticated()) {
            return JwtResponseDTO.builder()
                    .accessToken(jwtService.generateToken(authRequest.getUsername()))
                    .build();
        } else {
            throw new UsernameNotFoundException("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody UserRequestDTO userRequest) {
        try {
            userService.register(userRequest);
            return "User registered successfully!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @GetMapping("/test")
    public String test() {
        return "Hello, World!";
    }

//    @GetMapping("/logout")
//    public String logout(HttpServletRequest request) {
//        request.getSession().invalidate();
//        return "Logged out successfully!";
//    }
}
