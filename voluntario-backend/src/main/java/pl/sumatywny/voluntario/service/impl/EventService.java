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

    @Transactional
    public void createEvent(EventRequestDTO eventRequestDTO, Organization organization) {
        Location location = locationService.createLocation(eventRequestDTO.getLocation());
//        UserParticipation userParticipation = new UserParticipation();

        Event event = Event.builder()
                .name(eventRequestDTO.getName())
                .description(eventRequestDTO.getDescription())
                .organization(organization)
                .numberOfVolunteersNeeded(eventRequestDTO.getNumberOfVolunteersNeeded())
                .startDate(eventRequestDTO.getStartDate())
                .endDate(eventRequestDTO.getEndDate())
                .location(location)
//                .participations(List.of(userParticipation))
                .isCompleted(false)
                .build();

        eventRepository.save(event);

//        var savedEvent = eventRepository.save(event);
//        return EventResponseDTO.builder()
//                .id(savedEvent.getId())
//                .name(savedEvent.getName())
//                .description(savedEvent.getDescription())
////                .organization(savedEvent.getOrganization())
//                .numberOfVolunteersNeeded(savedEvent.getNumberOfVolunteersNeeded())
//                .startDate(savedEvent.getStartDate())
//                .endDate(savedEvent.getEndDate())
////                .location(savedEvent.getLocation())
//                .isCompleted(savedEvent.getIsCompleted())
//                .build();
    }

    @Transactional
    public void addParticipant(Event event, User user) {
        if (!isUserVolunteer(user)) {
            throw new NoSuchElementException("Only volunteers can participate in events.");
        }

        if (event.getStartDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot add participant to past event.");
        }

        if (event.getIsCompleted()) {
            throw new IllegalStateException("Cannot remove participant from completed event.");
        }

        var participation = userParticipationRepository.findByUserIdAndEventId(user.getId(), event.getId());
        if (participation.isPresent()) {
            throw new IllegalStateException(String.format("User %d already in event %d.", user.getId(), event.getId()));
        }

        UserParticipation userParticipation = UserParticipation.builder()
                .user(user)
                .event(event)
                .build();
        userParticipationRepository.save(userParticipation);
    }

    @Transactional
    public void removeParticipant(Event event, User user) {
        if (event.getIsCompleted()) {
            throw new IllegalStateException("Cannot remove participant from completed event.");
        }

        var participation = userParticipationRepository.findByUserIdAndEventId(user.getId(), event.getId())
                .orElseThrow(() ->
                        new NoSuchElementException(
                                String.format("User %d not found in event %d.", user.getId(), event.getId())
                        )
                );

        userParticipationRepository.delete(participation);
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
    public List<EventResponseDTO> getAllEventsDTO() {
        return eventRepository
                .findAllWithParticipants()
                .stream()
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

    public Page<Event> getAllEventsPageable(String search, Pageable pageable) {
        return eventRepository.findAllByNameWithParticipantsPageable(search, pageable);
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
        if (event.getIsCompleted()) {
            throw new IllegalStateException("Cannot complete already completed event.");
        }

        event.setIsCompleted(true);
        eventRepository.save(event);

        var participations = userParticipationRepository.findByEventId(event.getId());
        participations.forEach(userParticipation -> {
            var evaluation = completeEventDTO.stream()
                    .filter(e -> e.getUserId().equals(userParticipation.getUser().getId()))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            userParticipation.setRating(evaluation.getRating());
            userParticipation.setComment(evaluation.getComment());
            leaderboardService.addScore(userParticipation.getUser(), evaluation);
        });
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
                .isCompleted(event.getIsCompleted())
                .build();
    }

    public List<EventResponseDTO> getUserEvents(User user) {
        return userParticipationRepository.findByUserId(user.getId())
                .stream()
                .map(UserParticipation::getEvent)
                .map(this::getEventResponse)
                .toList();
    }
}

