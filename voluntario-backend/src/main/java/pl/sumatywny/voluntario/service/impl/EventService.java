package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.user.Role;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
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
        System.out.println(user.get());
        System.out.println("\n\n" + user.get().getRoles() + "\n\n");
//        System.out.println(user.get().getRole().contains(Role.ROLE_VOLUNTEER));
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
    public String addVolunteer(Long eventID, Optional<User> user) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new Exception("Event not found");
        }
        event.addParticipant(user.get());
        eventRepository.save(event);
//        System.out.println("Zapisani czonkowie" + event.getParticipants());
        return "The volunteer was added to the participants list";
    }

    @Transactional
    public String removeVolunteer(Long eventID, Long userID) throws Exception {
        Event event = eventRepository.findFirstById(eventID);
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

//    @Transactional
    public List<User> getAllParticipants(Long eventID) {
        Event event = eventRepository.findFirstById(eventID);
        return event.getParticipants();
    }

//    @Transactional
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events;
    }

//    @Transactional
    public Event getEvent(Long eventID) {
        Event event = eventRepository.findFirstById(eventID);
//        System.out.println("test" + event);
        return event;
    }
}

