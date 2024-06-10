package unit;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserParticipation;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.UserServiceImpl;

import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private UserParticipationRepository userParticipationRepository;

    @InjectMocks
    private UserServiceImpl userService;

//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.initMocks(this);
//    }

    @Test
    public void testIsUserBanned_UserExistsAndIsNotBanned() {
        // Arrange
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        user.setIsBanned(false);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        boolean isBanned = userService.isUserBanned(email);

        // Assert
        assertFalse(isBanned);
    }

    @Test
    public void testIsUserBanned_UserExistsAndIsBanned() {
        // Arrange
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        user.setIsBanned(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        boolean isBanned = userService.isUserBanned(email);

        // Assert
        assertTrue(isBanned);
    }

    @Test
    public void testIsUserBanned_UserNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> userService.isUserBanned(email));
    }

    @Test
    public void testBanUser_UserExists() {
        // Arrange
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        String result = userService.banUser(userId);

        // Assert
        assertTrue(user.getIsBanned());
        assertEquals("Successfully baned user with id 1", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testBanUser_UserNotFound() {
        // Arrange
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userService.banUser(userId));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testSetBanned_UserNotFound() {
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> userService.setBanned(userId, true));

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
        verifyNoInteractions(userParticipationRepository);
    }

    @Test
    public void testSetBanned_UserFound() {
        Long userId = 1L;
        User user = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        String result = userService.setBanned(userId, true);

        assertEquals("user banned", result);
        assertTrue(user.getIsBanned());
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(user);
        verifyNoMoreInteractions(userRepository);
        verifyNoInteractions(userParticipationRepository);
    }

    @Test
    public void changeData() {
        User user = new User();
        String firstName = "Jan";
        String lastName = "Kowalski";
        String email = "test@test.com.pl";
        String phoneNumber = "1234567890";

        userService.changeData(user, firstName, lastName, email, phoneNumber);

        assertEquals(firstName, user.getFirstName());
        assertEquals(lastName, user.getLastName());
        assertEquals(email, user.getEmail());
        assertEquals(phoneNumber, user.getPhoneNumber());
        verify(userRepository, times(1)).save(user);
        verifyNoMoreInteractions(userRepository);
        verifyNoInteractions(userParticipationRepository);
    }

    @Test
    public void getUserComments() {
        Long userId = 1L;
        UserParticipation participation1 = new UserParticipation();
        participation1.setComment("Comment 1");
        UserParticipation participation2 = new UserParticipation();
        participation2.setComment(null);
        List<UserParticipation> participations = List.of(participation1, participation2);
        when(userParticipationRepository.findByUserId(userId)).thenReturn(participations);

        List<String> comments = userService.getUserComments(userId);

        assertEquals(Collections.singletonList("Comment 1"), comments);
        verify(userParticipationRepository, times(1)).findByUserId(userId);
        verifyNoMoreInteractions(userParticipationRepository);
        verifyNoInteractions(userRepository);
    }

    @Test
    public void getUserByEmail_ExistingEmail() {
        String email = "test@test.com.pl";
        User user = new User();
        user.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(user));

        User result = userService.getUserByEmail(email);

        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }

    @Test
    public void getUserByEmail_NonExistingEmail() {
        String email = "test@test.com.pl";
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.getUserByEmail(email);
        });
    }

    @Test
    public void getUserById_ExistingId() {
        Long id = 1L;
        User user = new User();
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(java.util.Optional.of(user));

        User result = userService.getUserById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    public void getUserById_NonExistingId() {
        Long id = 100L;
        when(userRepository.findById(id)).thenReturn(java.util.Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.getUserById(id);
        });
    }

    @Test
    public void getAllUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User());
        users.add(new User());
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(users.size(), result.size());
    }
}
