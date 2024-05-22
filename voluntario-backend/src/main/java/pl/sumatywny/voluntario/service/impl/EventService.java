package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.CouldNotSaveException;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserParticipation;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.LocationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final LocationRepository locationRepository;
    private final LocationService locationService;
    private final PostService postService;

    @Transactional
    public Event createEvent(EventDTO eventDTO, Organization user) {
        Location location = locationService.createLocation(eventDTO.getLocation());

        Event event = Event.builder()
                .name(eventDTO.getName())
                .description(eventDTO.getDescription())
                .organization(user)
//                .location(eventDTO.getLocation())
                .numberOfVolunteersNeeded(eventDTO.getNumberOfVolunteersNeeded())
                .participations(new ArrayList<>())
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .location(location)
                .build();

        return eventRepository.save(event);
    }

    @Transactional
    public Event addParticipant(Event event, User user) {
        if (!isUserVolunteer(user)) {
            throw new NoSuchElementException("Only volunteers can participate in events.");
        }

        var participatingUsers = event.getParticipations().stream().map(UserParticipation::getUser).toList();
        if (participatingUsers.contains(user)) {
            throw new IllegalStateException(String.format("User %d already in event %d.", user.getId(), event.getId()));
        }

        if (event.getParticipations().size() >= event.getNumberOfVolunteersNeeded()) {
            throw new IllegalStateException(String.format("Event %d is full.", event.getId()));
        }

        UserParticipation userParticipation = UserParticipation.builder()
                .user(user)
                .event(event)
                .build();

        event.getParticipations().add(userParticipation);
        return eventRepository.save(event);
    }

    @Transactional
    public Event removeParticipant(Event event, User user) {
        var participatingUser = event.getParticipations().stream()
                .filter(participation -> participation.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() ->
                        new NoSuchElementException(
                                String.format("User %d not found in event %d.", user.getId(), event.getId())
                        )
                );

        if (event.getParticipations().remove(participatingUser)) {
            return eventRepository.save(event);
        } else {
            throw new NoSuchElementException(String.format("User %d not found in event %d.", user.getId(), event.getId()));
        }
    }

    public List<User> getUsersParticipating(Event event) {
        return event.getParticipations().stream().map(UserParticipation::getUser).toList();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getOrganizationEvents(Organization organization) {
        return eventRepository.findAllByOrganization_Id(organization.getId());
    }

    public Page<Event> getAllEvents(String search, Pageable pageable) {
        if (!search.isEmpty()) {
            return eventRepository.findAllByNameContainingIgnoreCase(search, pageable);
        }
        return eventRepository.findAll(pageable);
    }

    public Event getEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
    }

    @Transactional
    public void removeEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));

        postService.removeAllPostsByEvent(event);
        eventRepository.delete(event);
    }

    private boolean isUserVolunteer(User user) {
        return user.getRole().getRole() == Role.ROLE_VOLUNTEER;
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

    private Location getEventLocation(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException(String.format("Event %d not found.", eventId)));
        return event.getLocation();
    }
}

