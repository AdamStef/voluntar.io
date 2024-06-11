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
import pl.sumatywny.voluntario.dtos.event.EventResponseDTO;
import pl.sumatywny.voluntario.dtos.user.UserParticipationDTO;
import pl.sumatywny.voluntario.dtos.user.UserResponseDTO;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.*;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.EmailService;
import pl.sumatywny.voluntario.service.impl.EventService;
import pl.sumatywny.voluntario.service.impl.NotificationService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private EmailService emailService;

    @Mock
    private EventService eventService;

    @Mock
    private UserService userService;

    @Mock
    private UserParticipationRepository userParticipationRepository;


    @InjectMocks
    private NotificationService notificationService;

    private final User user = new User(1L, "test@testoowaDomena.com", "testpassword", new UserRole(Role.ROLE_VOLUNTEER),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final Organization organization = new Organization(1L, user, "Wolontariaty", "pomagamy", "00000000",
            "Lodz, piotrkowska", "help.org.pl", true,
            LocalDateTime.of(2024, 5, 30, 12, 0, 0),
            LocalDateTime.of(2024, 5, 31, 12, 0, 0));
    private final Location location = new Location(1L, "DPS", "Lodz", "93-000", "Kwiatowa",
            "1", "2", 14.01, 12.00, "wejscie od Lisciastej");

    private final Event event = new Event(1L, "Pomoc starszym", "pomoc w DPSie", organization,
            10, new ArrayList<>(),
            LocalDateTime.now().plusDays(2),
            LocalDateTime.now().plusDays(3),
            new ArrayList<>(), location, EventStatus.NOT_COMPLETED);

    private final EventResponseDTO eventResponseDTO = new EventResponseDTO(event);


    @Test
    public void testSendEventReminders() {
        when(eventService.getSoonEvents()).thenReturn(Collections.singletonList(eventResponseDTO));
        when(userService.getUserById(1L)).thenReturn(user);
        eventResponseDTO.setParticipants(List.of(new UserParticipationDTO(new UserParticipation(1L, user, event, 0, null))));

        notificationService.sendEventReminders();

        verify(emailService, times(1)).sendEmail(eq(user.getEmail()), anyString(), anyString());
    }
}
