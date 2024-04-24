package pl.sumatywny.voluntario.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.NotFoundException;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
//    private LocationRepository locationRepository;

    public Event createEvent(EventDTO eventDTO, User user) {
        Event event = Event.builder()
                .name(eventDTO.getName())
                .description(eventDTO.getDescription())
                .organizer(user)
                .organizer(user)
                .numberOfVolunteersNeeded(eventDTO.getNumberOfVolunteersNeeded())
                .participants(new ArrayList<>())
                .participants(new ArrayList<>())
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .build();

        return eventRepository.save(event);
    }

    @Transactional
    public Event addParticipant(Long eventID, User user) {
        if (user.getRole().getRole() != Role.ROLE_VOLUNTEER) {
            throw new NotFoundException("Only volunteers can participate in events.");
        }

        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new NotFoundException(String.format("Event %d not found.", eventID));
        }

        event.addParticipant(user);
        return eventRepository.save(event);
    }

    @Transactional
    public Event removeParticipant(Long eventID, Long userID) {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new NotFoundException(String.format("Event %d not found.", eventID));
        }


        User user = userRepository.findFirstById(userID);
        if (user == null) {
            throw new NotFoundException(String.format("User %d not found.", userID));
        }

        if (event.getParticipants().remove(user)) {
            return eventRepository.save(event);
        } else {
            throw new NotFoundException(String.format("User %d not found in event %d.", userID, eventID));
        }

//        event.getParticipants().remove(user);
//        return eventRepository.save(event);

//        if (event.removeParticipant(user)) {
//            eventRepository.save(event);
//            return "The volunteer was removed from the participants list";
//        } else {
//            throw new Exception("The volunteer was not on the participants list");
//        }
    }

    public List<User> getAllParticipants(Long eventID) {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new NotFoundException(String.format("Event %d not found.", eventID));
        }
        return event.getParticipants();
    }

    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }

    public Event getEvent(Long eventID) {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new NotFoundException(String.format("Event %d not found.", eventID));
        }
        return event;
    }


    public void removeEvent(Long eventID) {
        Event event = eventRepository.findFirstById(eventID);
        if (event == null) {
            throw new NotFoundException(String.format("Event %d not found.", eventID));
        }
        eventRepository.delete(event);
    }
}

