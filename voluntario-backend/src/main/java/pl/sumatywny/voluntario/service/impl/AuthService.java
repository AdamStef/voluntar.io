package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.RegisterDTO;
import pl.sumatywny.voluntario.dtos.auth.AuthRequestDTO;
import pl.sumatywny.voluntario.dtos.auth.JwtResponseDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.Token;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.TokenRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.security.JwtService;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

    public User register(RegisterDTO registerDTO) {
        String email = registerDTO.email().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException(String.format("User with email %s already exists.", email));
        }

        Role roleEnum;

        try {
            roleEnum = Role.valueOf("ROLE_" + registerDTO.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role not found.");
        }

        UserRole role = roleRepository.findByRole(roleEnum)
                .orElseThrow(() -> new IllegalArgumentException("Role not found."));

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(registerDTO.password()))
                .role(role)
                .firstName(registerDTO.firstName())
                .lastName(registerDTO.lastName())
                .phoneNumber(registerDTO.phoneNumber())
                .isDeleted(false)
                .isBanned(false)
                .isVerified(false)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public JwtResponseDTO login(AuthRequestDTO authRequestDTO) {
        Authentication authentication = authManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        authRequestDTO.getEmail(),
                        authRequestDTO.getPassword())
        );

        var claims = new HashMap<String, Object>();
        var userDetails = ((UserDetails) authentication.getPrincipal());
        var jwtToken = jwtService.generateToken(claims, userDetails);
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        revokeAllUserTokens(user);
        saveUserToken(jwtToken, userDetails, user);
        return JwtResponseDTO.builder().accessToken(jwtToken).build();
    }

    private void saveUserToken(String jwtToken, UserDetails userDetails, User user) {
        var token = Token.builder()
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .user(user)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        List<Token> validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }
        validUserTokens.forEach(token -> {
            token.setRevoked(true);
            token.setExpired(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
}
