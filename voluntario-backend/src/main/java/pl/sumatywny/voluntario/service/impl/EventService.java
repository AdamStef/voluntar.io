package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.event.EventRequestDTO;
import pl.sumatywny.voluntario.dtos.event.EventResponseDTO;
import pl.sumatywny.voluntario.dtos.user.ParticipatingUserDTO;
import pl.sumatywny.voluntario.dtos.user.UserEvaluationDTO;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.CouldNotSaveException;
import pl.sumatywny.voluntario.mapper.OrganizationMapper;
import pl.sumatywny.voluntario.mapper.UserParticipationMapper;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserParticipation;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.LocationRepository;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final LocationRepository locationRepository;
    private final UserParticipationRepository userParticipationRepository;

    private final LocationService locationService;
    private final PostService postService;
    private final LeaderboardService leaderboardService;
    private final UserRepository userRepository;

    @Transactional
    public void createEvent(EventRequestDTO eventRequestDTO, Organization organization) {
        Location location = locationService.createLocation(eventRequestDTO.getLocation());

        Event event = Event.builder()
                .name(eventRequestDTO.getName())
                .description(eventRequestDTO.getDescription())
                .organization(organization)
                .numberOfVolunteersNeeded(eventRequestDTO.getNumberOfVolunteersNeeded())
                .startDate(eventRequestDTO.getStartDate())
                .endDate(eventRequestDTO.getEndDate())
                .location(location)
//                .participations(List.of(userParticipation))
                .status(EventStatus.NOT_COMPLETED)
                .build();

        eventRepository.save(event);
    }

    @Transactional
    public void addParticipant(Event event, User user) {
        if (!isUserVolunteer(user)) {
            throw new NoSuchElementException("Only volunteers can participate in events.");
        }

        if (event.getStartDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot add participant to past event.");
        }

        if (!event.getStatus().equals(EventStatus.NOT_COMPLETED)) {
            throw new IllegalStateException("Cannot remove participant from completed event.");
        }

        var participations = userParticipationRepository.findByUserId(user.getId());
        if (participations.stream().anyMatch(p -> p.getEvent().getId().equals(event.getId()))) {
            throw new IllegalStateException(String.format("User %d already in event %d.", user.getId(), event.getId()));
        }

        if (participations.stream()
                .filter(p -> !p.getEvent().getStatus().isFinished())
                .anyMatch(p -> doEventDatesOverlap(p.getEvent(), event))
        ) {
            throw new IllegalStateException(String.format("User %d already in another event at the same time.", user.getId()));
        }

        if (event.getParticipations().size() >= event.getNumberOfVolunteersNeeded()) {
            throw new IllegalStateException("Event is full.");
        }

        UserParticipation userParticipation = UserParticipation.builder()
                .user(user)
                .event(event)
                .build();
        userParticipationRepository.save(userParticipation);
    }

    @Transactional
    public void removeParticipant(Event event, User user) {
        if (!event.getStatus().equals(EventStatus.NOT_COMPLETED)) {
            throw new IllegalStateException("Cannot remove participant from completed event.");
        }

        userParticipationRepository.deleteByEventIdAndUserId(event.getId(), user.getId());
    }

    @Transactional
    public void removeEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));

        postService.removeAllPostsByEvent(event);
        eventRepository.delete(event);
    }

    public List<ParticipatingUserDTO> getUsersParticipating(Long eventId) {
        var participations = userParticipationRepository.findByEventId(eventId);
        return participations.stream().map(UserParticipation::getUser).map(user -> ParticipatingUserDTO.builder()
                .userId(user.getId())
                .eventId(eventId)
                .email(user.getEmail())
                .name(user.getFirstName() + " " + user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .build()).toList();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Transactional
    public List<EventResponseDTO> getAllEventsDTO(String search, String status) {
        return eventRepository
                .findAllWithParticipants()
                .stream()
                .filter(event -> search.isBlank() || event.getName().contains(search))
                .filter(event -> status.isBlank() || event.getStatus().equals(EventStatus.fromString(status)))
                .map(this::getEventResponse)
                .toList();
    }

    public List<EventResponseDTO> getUserEvents(User user) {
        return userParticipationRepository.findByUserId(user.getId())
                .stream()
                .map(UserParticipation::getEvent)
                .map(this::getEventResponse)
                .toList();
    }

    @Transactional
    public List<EventResponseDTO> getOrganizationEvents(Organization organization) {
        return eventRepository
                .findAllByOrganizationId(organization.getId())
                .stream()
                .map(this::getEventResponse)
                .toList();
    }

    public Page<EventResponseDTO> getAllEventsPageable(String search, Pageable pageable) {
        var events = eventRepository.findAllByNameWithParticipantsPageable(search, pageable);
        return events.map(this::getEventResponse);
    }

    public Page<EventResponseDTO> getAllEventsByStatusPageable(String search, String status, Pageable pageable) {
        var events = eventRepository.findAllByNameAndStatusWithParticipantsPageable(search, EventStatus.fromString(status), pageable);
        return events.map(this::getEventResponse);
    }

    public Event getEvent(Long eventId) {
        var event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
        Hibernate.initialize(event.getOrganization());
        return event;
    }

    public EventResponseDTO getEventDTO(Long eventId) {
        var event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
//        Hibernate.initialize(event.getOrganization());
        return getEventResponse(event);
    }

    public Location assignNewLocation(Long eventId, Long locationId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Location %d not found.", locationId)));
        try {
            event.setLocation(location);
            eventRepository.save(event);
        } catch (Exception e) {
            throw new CouldNotSaveException(String.format("Location %d not found.", locationId));
        }
        return location;
    }

    @Transactional
    public void completeEvent(Event event, List<UserEvaluationDTO> completeEventDTO) {
        if (!event.getStatus().equals(EventStatus.NOT_COMPLETED)) {
            throw new IllegalStateException("Cannot complete already completed event.");
        }

        event.setStatus(EventStatus.COMPLETED);
        eventRepository.save(event);

//        var participations = userParticipationRepository.findByEventId(event.getId());
//        participations.forEach(userParticipation -> {
//            var evaluation = completeEventDTO.stream()
//                    .filter(e -> e.getUserId().equals(userParticipation.getUser().getId()))
//                    .findFirst()
//                    .orElseThrow(() -> new NoSuchElementException("User not found"));
//
//            userParticipation.setRating(evaluation.getRating());
//            userParticipation.setComment(evaluation.getComment());
//            leaderboardService.addScore(userParticipation.getUser(), evaluation);
//        });
    }

    @Transactional
    public void evaluateUser(Long eventId, UserEvaluationDTO evaluation) {
        if (evaluation.getRating() < 1 || evaluation.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
        if (!event.getStatus().equals(EventStatus.COMPLETED)) {
            throw new IllegalStateException("Cannot evaluate user in not completed event.");
        }

        var participation = userParticipationRepository.findByUserIdAndEventId(evaluation.getUserId(), eventId)
                .orElseThrow(() -> new NoSuchElementException("User not found in event."));

        if (participation.getRating() > 0) {
            throw new IllegalStateException("User already evaluated.");
        }

        participation.setRating(evaluation.getRating());
        participation.setComment(evaluation.getComment());
        userParticipationRepository.save(participation);

        if (event.getParticipations().stream().noneMatch(p -> p.getRating() == 0)) {
            event.setStatus(EventStatus.EVALUATED);
            eventRepository.save(event);
        }

        leaderboardService.addScore(evaluation);
    }

    private boolean isUserVolunteer(User user) {
        return user.getRole().getRole() == Role.ROLE_VOLUNTEER;
    }

    private Location getEventLocation(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
        return event.getLocation();
    }

    private EventResponseDTO getEventResponse(Event event) {
        var participants = userParticipationRepository.findByEventId(event.getId());
        return EventResponseDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .organization(OrganizationMapper.mapToDTO(event.getOrganization()))
                .participants(
                        participants != null ?
                                participants.stream().map(UserParticipationMapper::mapToDTO).toList()
                                :
                                new ArrayList<>()
                )
                .numberOfVolunteersNeeded(event.getNumberOfVolunteersNeeded())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .location(event.getLocation())
                .status(event.getStatus())
                .build();
    }

    private boolean doEventDatesOverlap(Event event1, Event event2) {
        return event1.getStartDate().isBefore(event2.getEndDate()) && event1.getEndDate().isAfter(event2.getStartDate());
    }
}

