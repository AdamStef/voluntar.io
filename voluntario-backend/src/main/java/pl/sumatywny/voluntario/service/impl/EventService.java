package pl.sumatywny.voluntario.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.CouldNotSaveException;
import pl.sumatywny.voluntario.exception.NotFoundException;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.LocationRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final LocationRepository locationRepository;

    @Transactional
    public Event createEvent(EventDTO eventDTO, User user) {
        Location location = locationRepository.findById(eventDTO.getLocationId())
                .orElseThrow(() -> new NotFoundException(String.format("Location %d not found.", eventDTO.getLocationId())));

        Event event = Event.builder()
                .name(eventDTO.getName())
                .description(eventDTO.getDescription())
                .organizer(user)
                .organizer(user)
                .numberOfVolunteersNeeded(eventDTO.getNumberOfVolunteersNeeded())
                .participants(new ArrayList<>())
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .location(location)
                .build();

        return eventRepository.save(event);
    }

    @Transactional
    public Event addParticipant(Long eventId, Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(String.format("User %d not found.", userId)));

        if (!isUserVolunteer(user)) {
            throw new NotFoundException("Only volunteers can participate in events.");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));

        event.getParticipants().add(user);
        return eventRepository.save(event);
    }

    @Transactional
    public Event addParticipant(Long eventId) {
        var user = authService.getUserFromSession();

        if (!isUserVolunteer(user)) {
            throw new NotFoundException("Only volunteers can participate in events.");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));

        event.getParticipants().add(user);
        return eventRepository.save(event);
    }

    @Transactional
    public Event removeParticipant(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(String.format("User %d not found.", userId)));

        if (event.getParticipants().remove(user)) {
            return eventRepository.save(event);
        } else {
            throw new NotFoundException(String.format("User %d not found in event %d.", userId, eventId));
        }
    }

    public List<User> getAllParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));

        return event.getParticipants();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));
    }


    public void removeEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));

        eventRepository.delete(event);
    }

    private boolean isUserVolunteer(User user) {
        return user.getRole().getRole() == Role.ROLE_VOLUNTEER;
    }

    public Location assignNewLocation(Long eventId, Long locationId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new NotFoundException(String.format("Location %d not found.", locationId)));
        try{
            event.setLocation(location);
            eventRepository.save(event);
        } catch (Exception e) {
            throw new CouldNotSaveException(String.format("Location %d not found.", locationId));
        }
        return location;
    }

    private Location getEventLocation(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException(String.format("Event %d not found.", eventId)));
        return event.getLocation();
    }
}

