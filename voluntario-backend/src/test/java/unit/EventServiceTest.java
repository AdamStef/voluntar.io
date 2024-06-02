package unit;

import org.junit.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import pl.sumatywny.voluntario.dtos.LocationDTO;
import pl.sumatywny.voluntario.dtos.event.EventRequestDTO;
import pl.sumatywny.voluntario.dtos.event.EventResponseDTO;
import pl.sumatywny.voluntario.dtos.user.ParticipatingUserDTO;
import pl.sumatywny.voluntario.dtos.user.UserEvaluationDTO;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.*;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.LocationRepository;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.impl.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class EventServiceTest {
    private final User user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);
    private final Organization organization = new Organization(1L, user, "Wolontariaty", "pomagamy", "00000000",
            "Lodz, piotrkowska", "help.org.pl", true,
            LocalDateTime.of(2024, 05, 30, 12, 00, 00),
            LocalDateTime.of(2024, 05, 31, 12, 00, 00));
    private final Location location = new Location(1L, "DPS", "Lodz", "93-000", "Kwiatowa",
            "1", "2", 14.01, 12.00, "wejscie od Lisciastej");

    private final Location location2 = new Location(1L, "Schroniskao", "Lodz", "93-000", "Kwiatowa",
            "40", "2", 14.10, 12.00, "wejscie od Lisciastej");
    private final Event event = new Event(1L, "Pomoc starszym", "pomoc w DPSie", organization,
            10, new ArrayList<>(),
            LocalDateTime.now().plusDays(2),
            LocalDateTime.now().plusDays(3),
            new ArrayList<>(), location, EventStatus.NOT_COMPLETED);

    private final Event event2 = new Event(1L, "Pomoc schronisku", "wyprowadzenie zwierząt", organization,
            5, new ArrayList<>(),
            LocalDateTime.now().plusDays(2),
            LocalDateTime.now().plusDays(3),
            new ArrayList<>(), location2, EventStatus.NOT_COMPLETED);
    private final User volunteer = new User(2L, "vol@test.com", "password", new UserRole(Role.ROLE_VOLUNTEER),
            "Marian", "Kowalczyk", "789456123", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);
    @InjectMocks
    private EventService eventService;
    @Mock
    private PostService postService;
    @Mock
    private EmailService emailService;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserParticipationRepository userParticipationRepository;
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private UserRepository userRepository;

    @Mock
    private LeaderboardService leaderboardService;

    @Mock
    private LocationService locationService;

    @Captor
    private ArgumentCaptor<Event> eventCaptor;

    @BeforeAll
    public void setup() {
//        event
//        event.setId(1L);
//        event.setName("Pomoc starszym");
//        event.setDescription("pomoc w DPSie");
//        user
//        organization
//        event.setOrganization(organization);
//        event.setNumberOfVolunteersNeeded(10);
//        event.setParticipations(new ArrayList<>());
//        event.setStartDate(LocalDateTime.of(2024, 06, 01, 12, 00, 00));
//        event.setEndDate(LocalDateTime.of(2024, 06, 01, 18, 00, 00));
//        event.setPosts(new ArrayList<>());
//        location
//        event.setLocation(location);
    }

    @Test
    public void findUserById() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        Event foundEvent = eventService.getEvent(1L);
//        System.out.println("\n\nfound\n" + foundEvent);
//        System.out.println("\nevent\n" + event);
        assertNotNull(foundEvent);
        assertEquals(event, foundEvent);
    }

    @Test
    public void addParticipantErrors() {
        var error = assertThrows(NoSuchElementException.class, () -> eventService.addParticipant(event, user));
        assertEquals("Only volunteers can participate in events.", error.getMessage());

        when(userParticipationRepository.findAll()).thenReturn(List.of(
                new UserParticipation(1L, volunteer, event, 0, null)));
        eventService.addParticipant(event, volunteer);
        assertEquals(1, userParticipationRepository.findAll().size());

        event.setStatus(EventStatus.COMPLETED);
        var error2 = assertThrows(IllegalStateException.class, () -> eventService.addParticipant(event, volunteer));
        assertEquals("Cannot add participant to completed event.", error2.getMessage());
        event.setStatus(EventStatus.NOT_COMPLETED);

        event.setStartDate(LocalDateTime.now().minusDays(2));
        var error3 = assertThrows(IllegalStateException.class, () -> eventService.addParticipant(event, volunteer));
        assertEquals("Cannot add participant to past event.", error3.getMessage());
        event.setStartDate(LocalDateTime.now().plusDays(2));

        when(userParticipationRepository.findByUserId(volunteer.getId()))
                .thenReturn(List.of(new UserParticipation(1L, volunteer, event, 0, null)));
        var error4 = assertThrows(IllegalStateException.class, () -> eventService.addParticipant(event, volunteer));
        assertEquals("User 2 already in event 1.", error4.getMessage());
    }

    @Test
    public void addParticipantSuccess() {
        eventService.addParticipant(event, volunteer);
        verify(userParticipationRepository, times(1)).save(new UserParticipation(null, volunteer, event, 0, null));
    }

    @Test
    public void removeParticipant() {
        eventService.removeParticipant(event, user);

        verify(userParticipationRepository, times(1)).deleteByEventIdAndUserId(1L, 1L);
    }

    @Test
    public void removeParticipantCompletedEvent() {
        UserParticipation userParticipation = new UserParticipation(1L, user, event, 0, null);
        event.setStatus(EventStatus.COMPLETED);
        assertThrows(IllegalStateException.class, () -> eventService.removeParticipant(event, user));
        verify(userParticipationRepository, never()).findByUserIdAndEventId(1L, 1L);
        verify(userParticipationRepository, never()).delete(userParticipation);
        event.setStatus(EventStatus.NOT_COMPLETED);
    }

    @Test
    public void removeEventSuccess() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        doNothing().when(postService).removeAllPostsByEvent(event);
        eventService.removeEvent(1L);
        verify(postService, times(1)).removeAllPostsByEvent(event);
        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    public void removeNoSuchEvent() {
        when(eventRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            eventService.removeEvent(2L);
        });
        verify(eventRepository, times(1)).findById(2L);
    }

    @Test
    public void usersParticipating() {
        when(userParticipationRepository.findByEventId(1L))
                .thenReturn(List.of(new UserParticipation(1L, volunteer, event, 0, null)));
        var result = eventService.getUsersParticipating(1L);
        verify(userParticipationRepository, times(1)).findByEventId(1L);
        assertEquals(1, result.size());
        ParticipatingUserDTO participatingUserDTO = result.get(0);
        assertEquals(volunteer.getId(), participatingUserDTO.getUserId());
        assertEquals(event.getId(), participatingUserDTO.getEventId());
        assertEquals(volunteer.getEmail(), participatingUserDTO.getEmail());
        assertEquals(volunteer.getFirstName() + " " + volunteer.getLastName(), participatingUserDTO.getName());
        assertEquals(volunteer.getPhoneNumber(), participatingUserDTO.getPhoneNumber());
        assertEquals(volunteer.getGender(), participatingUserDTO.getGender());
    }

    @Test
    public void getAllEvents() {
        when(eventRepository.findAll()).thenReturn(List.of(event));
        var result = eventService.getAllEvents();
        assertEquals(1, result.size());
        assertEquals(event, result.get(0));
    }

    @Test
    public void getAllEventsDTO() {
        when(eventRepository.findAllWithParticipants()).thenReturn(List.of(event, event2));
        List<EventResponseDTO> result = eventService.getAllEventsDTO("", "");
        verify(eventRepository, times(1)).findAllWithParticipants();
        assertEquals(2, result.size());
        assertEquals(event.getName(), result.get(0).getName());
        assertEquals(event.getDescription(), result.get(0).getDescription());
        assertEquals(event.getNumberOfVolunteersNeeded(), result.get(0).getNumberOfVolunteersNeeded());
        assertEquals(event.getStartDate(), result.get(0).getStartDate());
        assertEquals(event.getEndDate(), result.get(0).getEndDate());
        assertEquals(event.getLocation(), result.get(0).getLocation());
        assertEquals(event.getStatus(), result.get(0).getStatus());

        result = eventService.getAllEventsDTO("starszym", "");
        assertEquals(1, result.size());
        assertEquals(event.getName(), result.get(0).getName());
        assertEquals(event.getDescription(), result.get(0).getDescription());
        assertEquals(event.getNumberOfVolunteersNeeded(), result.get(0).getNumberOfVolunteersNeeded());
        assertEquals(event.getStartDate(), result.get(0).getStartDate());
        assertEquals(event.getEndDate(), result.get(0).getEndDate());
        assertEquals(event.getLocation(), result.get(0).getLocation());
        assertEquals(event.getStatus(), result.get(0).getStatus());

        event2.setStatus(EventStatus.COMPLETED);
        result = eventService.getAllEventsDTO("", "Zakończone");
        assertEquals(1, result.size());
        assertEquals(event2.getName(), result.get(0).getName());
        assertEquals(event2.getDescription(), result.get(0).getDescription());
        assertEquals(event2.getNumberOfVolunteersNeeded(), result.get(0).getNumberOfVolunteersNeeded());
        assertEquals(event2.getStartDate(), result.get(0).getStartDate());
        assertEquals(event2.getEndDate(), result.get(0).getEndDate());
        assertEquals(event2.getLocation(), result.get(0).getLocation());
        assertEquals(event2.getStatus(), result.get(0).getStatus());
    }

    @Test
    public void getAllEventsPaageable() {
    }

    @Test
    public void getAllEventsByStatusPageable() {

    }

    @Test
    public void getEvent() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.findById(2L)).thenReturn(Optional.empty());

        assertEquals(event, eventService.getEvent(1L));
        assertThrows(NoSuchElementException.class, () -> {
            eventService.getEvent(2L);
        });
        verify(eventRepository, times(2)).findById(any());
    }

    @Test
    public void getEventDTO() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.findById(2L)).thenReturn(Optional.empty());

        assertEquals(EventResponseDTO.class, eventService.getEventDTO(1L).getClass());
        assertThrows(NoSuchElementException.class, () -> {
            eventService.getEventDTO(2L);
        });
        verify(eventRepository, times(2)).findById(any());
    }

    @Test
    public void assignNewLocationError() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> {
            eventService.assignNewLocation(2L, 1L);
        });
        when(locationRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> {
            eventService.assignNewLocation(1L, 2L);
        });
        verify(eventRepository, times(2)).findById(any());
        verify(locationRepository, times(1)).findById(any());

//        CouldNotSaveException exception = assertThrows(CouldNotSaveException.class, () ->
//                eventService.assignNewLocation(event.getId(), location.getId()));
//        assertEquals("Location 1 not found.", exception.getMessage());
    }

    @Test
    public void assignNewLocationSuccess() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        event.setLocation(null);
        var loc = eventService.assignNewLocation(1L, 1L);
        assertEquals(event.getLocation(), location);
        assertEquals(Location.class, loc.getClass());
    }

    @Test
    public void completeEvent() {
        event.setStatus(EventStatus.COMPLETED);
        assertThrows(IllegalStateException.class, () -> {
            eventService.completeEvent(event, new ArrayList<>());
        });
        event.setStatus(EventStatus.NOT_COMPLETED);
        eventService.completeEvent(event, new ArrayList<>());
        assertEquals(EventStatus.COMPLETED, event.getStatus());
    }

    @Test
    public void evaluateUserError() {
        UserEvaluationDTO userEvaluationDTO = new UserEvaluationDTO(1L, 0, "super");
        IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class, ()->{
            eventService.evaluateUser(1L, userEvaluationDTO);
        });

        assertEquals("Rating must be between 1 and 5.",illegalArgumentException.getMessage());
        userEvaluationDTO.setRating(6);
        IllegalArgumentException illegalArgumentException2 = assertThrows(IllegalArgumentException.class, ()->{
            eventService.evaluateUser(1L, userEvaluationDTO);
        });
        assertEquals("Rating must be between 1 and 5.",illegalArgumentException2.getMessage());

        userEvaluationDTO.setRating(5);
        NoSuchElementException noSuchElementException = assertThrows(NoSuchElementException.class, ()->{
            eventService.evaluateUser(1L, userEvaluationDTO);
        });
        assertEquals("Event 1 not found.",noSuchElementException.getMessage());

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        IllegalStateException illegalStateException = assertThrows(IllegalStateException.class, ()->{
            eventService.evaluateUser(1L, userEvaluationDTO);
        });
        assertEquals("Cannot evaluate user in not completed event.", illegalStateException.getMessage());

        event.setStatus(EventStatus.COMPLETED);
        NoSuchElementException noSuchElementException2 = assertThrows(NoSuchElementException.class, () -> {
            eventService.evaluateUser(1L, userEvaluationDTO);
        });
        assertEquals("User not found in event.",noSuchElementException2.getMessage());


        when(userParticipationRepository.findByUserIdAndEventId(1L,1L))
                .thenReturn(Optional.of(new UserParticipation(1L, volunteer, event, 5, "super")));
        IllegalStateException illegalStateException2 = assertThrows(IllegalStateException.class, ()->{
            eventService.evaluateUser(1L, userEvaluationDTO);
        });
        assertEquals("User already evaluated.", illegalStateException2.getMessage());

    }

    @Test
    public void evaluateUserSuccess() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
//        when(userRepository.findById(1L)).thenReturn(Optional.of(volunteer));
        when(userParticipationRepository.findByUserIdAndEventId(1L,1L))
                .thenReturn(Optional.of(new UserParticipation(1L, volunteer, event, 0, null)));
        event.setStatus(EventStatus.COMPLETED);
        UserEvaluationDTO userEvaluationDTO = new UserEvaluationDTO(1L, 5, "super");
        eventService.evaluateUser(1L,userEvaluationDTO);
        assertTrue(true);
    }

    @Test
    public void getEventLocation() {
        NoSuchElementException noSuchElementException = assertThrows(NoSuchElementException.class, ()->{
           eventService.getEventLocation(1L);
        });
        assertEquals("Event 1 not found.", noSuchElementException.getMessage());
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        assertEquals(event.getLocation(), eventService.getEventLocation(1L));
    }

    @Test
    public void getEventResponse() {
        event.setParticipations(null);
        EventResponseDTO eventResponseDTO = eventService.getEventResponse(event);
        assertEquals(event.getId(), eventResponseDTO.getId());
        assertEquals(event.getName(), eventResponseDTO.getName());
        assertEquals(event.getDescription(), eventResponseDTO.getDescription());
        assertEquals(new ArrayList<>(), eventResponseDTO.getParticipants());
        assertEquals(0, eventResponseDTO.getParticipants().size());
//        assertEquals(event.getOrganization(), eventResponseDTO.getOrganization());
        assertEquals(event.getNumberOfVolunteersNeeded(), eventResponseDTO.getNumberOfVolunteersNeeded());
        assertEquals(event.getStartDate(), eventResponseDTO.getStartDate());
        assertEquals(event.getEndDate(), eventResponseDTO.getEndDate());
        assertEquals(event.getLocation(), eventResponseDTO.getLocation());
        assertEquals(event.getStatus(), eventResponseDTO.getStatus());
    }

    @Test
    public void getOrganizationEvents() {
        when(eventRepository.findAllByOrganizationId(1L)).thenReturn(List.of(event, event2));
        var result = eventService.getOrganizationEvents(organization);
        assertEquals(2, result.size());
    }

    @Test
    public void getUserEvents() {
        when(userParticipationRepository.findByUserId(2L)).thenReturn(List.of(
                new UserParticipation(1L, volunteer, event, 0, null),
                new UserParticipation(1L, volunteer, event2, 0, null)));
        var result = eventService.getUserEvents(volunteer);
        assertEquals(2, result.size());
    }

    @Test
    public void createEvent() {
        LocationDTO locationDTO = new LocationDTO("DPS", "Lodz", "Kwiatowa", "Kwiatowa", "2", "1", 14.01,12.57,"brak");
        EventRequestDTO eventRequestDTO = new EventRequestDTO(1L, "Test", "test", 5, LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(2), locationDTO);
        when(locationService.createLocation(eventRequestDTO.getLocation())).thenReturn(location);

        eventService.createEvent(eventRequestDTO, organization);

        verify(locationService, times(1)).createLocation(eventRequestDTO.getLocation());
        verify(eventRepository, times(1)).save(eventCaptor.capture());

        Event savedEvent = eventCaptor.getValue();
        assertEquals(eventRequestDTO.getName(), savedEvent.getName());
        assertEquals(eventRequestDTO.getDescription(), savedEvent.getDescription());
        assertEquals(organization, savedEvent.getOrganization());
        assertEquals(eventRequestDTO.getNumberOfVolunteersNeeded(), savedEvent.getNumberOfVolunteersNeeded());
        assertEquals(eventRequestDTO.getStartDate(), savedEvent.getStartDate());
        assertEquals(eventRequestDTO.getEndDate(), savedEvent.getEndDate());
        assertEquals(location, savedEvent.getLocation());
        assertEquals(EventStatus.NOT_COMPLETED, savedEvent.getStatus());
    }

    @Test
    public void getSoonEvents() {
        event.setStartDate(LocalDateTime.now().plusDays(1));
        when(eventRepository.findAllByStartDateLessThanEqualAndStartDateGreaterThanEqual(
                any(LocalDateTime.class), any(LocalDateTime.class)
        )).thenReturn(Arrays.asList(event));

        List<EventResponseDTO> result = eventService.getSoonEvents();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(event.getId(), result.get(0).getId());
        assertEquals(event.getName(), result.get(0).getName());
        assertEquals(event.getDescription(), result.get(0).getDescription());
        assertEquals(event.getStartDate(), result.get(0).getStartDate());
        assertEquals(event.getStatus(), result.get(0).getStatus());

        verify(eventRepository, times(1)).findAllByStartDateLessThanEqualAndStartDateGreaterThanEqual(
                any(LocalDateTime.class), any(LocalDateTime.class)
        );
    }

    @Test
    public void doEventDatesOverlap() {
        event.setStartDate(LocalDateTime.now().plusDays(1));
        event.setEndDate(LocalDateTime.now().plusDays(2));
        event2.setStartDate(LocalDateTime.now().plusDays(3));
        event2.setEndDate(LocalDateTime.now().plusDays(4));
        assertFalse(eventService.doEventDatesOverlap(event2, event));
        event2.setStartDate(LocalDateTime.now().plusDays(1));
        assertTrue(eventService.doEventDatesOverlap(event, event2));
    }


}
