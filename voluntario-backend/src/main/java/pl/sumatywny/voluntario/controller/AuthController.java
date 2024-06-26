package pl.sumatywny.voluntario.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.user.RegisterDTO;
import pl.sumatywny.voluntario.dtos.auth.AuthRequestDTO;
import pl.sumatywny.voluntario.dtos.user.UserResponseDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.userdetails.CustomUserDetails;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final OrganizationService organizationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO registerDTO) {
        User user = authService.register(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponseDTO.mapFromUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody @Valid AuthRequestDTO authDTO,
            HttpServletRequest request,
            HttpServletResponse response) {
        var userOrg = userService.getUserByEmail(authDTO.getEmail());
        if (userService.isUserBanned(authDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This account has been banned");
        }

        if (userOrg.getRole().getRole()== Role.ROLE_ORGANIZATION) {
            if (!organizationService.getUserOrganization(userOrg.getId()).isVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The organization has not yet been verified by an administrator");
            }
        }
        var authentication = authService.login(authDTO, request, response);
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var principal = (CustomUserDetails) authentication.getPrincipal();
        var user = userService.getUserByEmail(principal.getUsername());

        return ResponseEntity.ok().body(UserResponseDTO.mapFromUser(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> status(Authentication authentication) {
//        if (authentication == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }

        var principal = (CustomUserDetails) authentication.getPrincipal();
        var user = userService.getUserByEmail(principal.getUsername());

        //TODO: If not authenticated remove JSESSIONID cookie

        return ResponseEntity.ok().body(UserResponseDTO.mapFromUser(user));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");

        User user = authService.getUserFromSession();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Użytkownik niezalogowany.");
        }

        userService.changePassword(user, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-data")
    public ResponseEntity<?> changeData(@RequestBody Map<String, String> request) {
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String email = request.get("email");
        String phoneNumber = request.get("phoneNumber");

        User user = authService.getUserFromSession();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Użytkownik niezalogowany");
        }

        userService.changeData(user, firstName, lastName, email, phoneNumber);
        return ResponseEntity.ok().build();
    }

}
