package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
//import pl.sumatywny.voluntario.repository.LocationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
//    private LocationRepository locationRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
//        this.locationRepository = locationRepository;
    }

    public String createEvent(EventDTO eventDTO, Optional<User> user) throws Exception {
        Set<UserRole> roles = user.get().getRoles();
        for (UserRole r : roles) {
            if (r.getRole() == Role.ROLE_VOLUNTEER) {
                throw new Exception("Volunteers cannot create events.");
            }
        }
        Event event = Event.builder()
                .name(eventDTO.getName())
                .description(eventDTO.getDescription())
                .organizer(user.get())
                .numberOfVolunteersNeeded(eventDTO.getNumberOfVolunteersNeeded())
                .participants(new ArrayList<User>())
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .build();
        eventRepository.save(event);
        return "Event created.";
    }

    @Transactional
    public String addParticipant(Long eventID, Optional<User> user) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new Exception("Event not found");
        }
        event.addParticipant(user.get());
        eventRepository.save(event);
        return "The volunteer was added to the participants list";
    }

    @Transactional
    public String removeParticipant(Long eventID, Long userID) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new Exception("Event not found");
        }
        User user = userRepository.findFirstById(userID);
        if (user == null) {
            throw new Exception("Volunteer with this ID does not exist");
        }
        if (event.removeParticipant(user)) {
            eventRepository.save(event);
            return "The volunteer was removed from the participants list";
        } else {
            throw new Exception("The volunteer was not on the participants list");
        }
    }

    public List<User> getAllParticipants(Long eventID) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new Exception("Event not found");
        }
        return event.getParticipants();
    }

    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events;
    }

    public Event getEvent(Long eventID) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new Exception("Event not found");
        }
        return event;
    }

    public String removeEvent(Long eventID) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new Exception("Event not found");
        }
        eventRepository.delete(event);
        return "Event removed";
    }
}

