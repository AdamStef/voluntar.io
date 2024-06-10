package unit;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.sumatywny.voluntario.dtos.user.RegisterDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.impl.AuthService;

import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContextHolder securityContextHolder;


    @InjectMocks
    private AuthService userService;


    @BeforeEach
    public void setUp() {
        authentication = new UsernamePasswordAuthenticationToken("user", "password");
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void testRegister_UserAlreadyExists() {
        RegisterDTO registerDTO = new RegisterDTO("test@example.com", "password", "USER", "John", "Doe", "1234567890", Gender.MALE);

        when(userRepository.existsByEmail(registerDTO.email().trim())).thenReturn(true);

        IllegalStateException thrown = assertThrows(IllegalStateException.class, () -> {
            userService.register(registerDTO);
        });

        assertEquals("User with email test@example.com already exists.", thrown.getMessage());
    }

    @Test
    public void testRegister_RoleNotFoundInEnum() {
        RegisterDTO registerDTO = new RegisterDTO("test@example.com", "password", "invalid_role", "John", "Doe", "1234567890", Gender.MALE);

        when(userRepository.existsByEmail(registerDTO.email().trim())).thenReturn(false);

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            userService.register(registerDTO);
        });

        assertEquals("Role not found.", thrown.getMessage());
    }

    @Test
    public void testRegister_RoleNotFoundInRepository() {
        RegisterDTO registerDTO = new RegisterDTO("test@example.com", "password", "USER", "John", "Doe", "1234567890", Gender.MALE);

        when(userRepository.existsByEmail(registerDTO.email().trim())).thenReturn(false);
//        when(roleRepository.findByRole(Role.ROLE_VOLUNTEER)).thenReturn(Optional.empty());

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            userService.register(registerDTO);
        });

        assertEquals("Role not found.", thrown.getMessage());
    }

    @Test
    public void testRegister_SuccessfulRegistration() {
        RegisterDTO registerDTO = new RegisterDTO("test@example.com", "password", "VOLUNTEER", "John", "Doe", "1234567890", Gender.MALE);
        UserRole userRole = new UserRole();
        userRole.setRole(Role.ROLE_VOLUNTEER);

        when(userRepository.existsByEmail(registerDTO.email().trim())).thenReturn(false);
        when(roleRepository.findByRole(Role.ROLE_VOLUNTEER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(registerDTO.password())).thenReturn("encoded_password");

        User user = User.builder()
                .email(registerDTO.email().trim())
                .password("encoded_password")
                .role(userRole)
                .firstName(registerDTO.firstName())
                .lastName(registerDTO.lastName())
                .phoneNumber(registerDTO.phoneNumber())
                .gender(registerDTO.gender())
                .isDeleted(false)
                .isBanned(false)
                .isVerified(false)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(user);

        User registeredUser = userService.register(registerDTO);

        assertNotNull(registeredUser);
        assertEquals(registerDTO.email().trim(), registeredUser.getEmail());
        assertEquals("encoded_password", registeredUser.getPassword());
        assertEquals(userRole, registeredUser.getRole());
        assertEquals(registerDTO.firstName(), registeredUser.getFirstName());
        assertEquals(registerDTO.lastName(), registeredUser.getLastName());
        assertEquals(registerDTO.phoneNumber(), registeredUser.getPhoneNumber());
        assertEquals(registerDTO.gender(), registeredUser.getGender());
        assertFalse(registeredUser.getIsDeleted());
        assertFalse(registeredUser.getIsBanned());
        assertFalse(registeredUser.getIsVerified());
    }

    @Test
    public void testGetUserFromSession_UserNotAuthenticated() {
//        when(SecurityContextHolder.getContext().getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(SecurityContextHolder.getContext());

        IllegalStateException thrown = assertThrows(IllegalStateException.class, () -> {
            userService.getUserFromSession();
        });

        assertEquals("User not authenticated.", thrown.getMessage());
    }

    @Test
    public void testGetUserFromSession_SuccessfulRetrieval() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("testpassword");
        // Mock the behavior of SecurityContext and Authentication
//        authentication.setAuthenticated(true);
//        Authentication authentication = new UsernamePasswordAuthenticationToken("user", "password");

//        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);

//        securityContext.setAuthentication(authentication);

        when(SecurityContextHolder.getContext().getAuthentication()).thenReturn(authentication);
//        when(authentication.getName()).thenReturn("test@example.com");
        // Create a dummy user to be returned by the repository


        // Mock the behavior of the userRepository
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));


        // Call the method under test
        User retrievedUser = userService.getUserFromSession();

        // Verify the result
        assertNotNull(retrievedUser);
        assertEquals("test@example.com", retrievedUser.getEmail());
    }



}
