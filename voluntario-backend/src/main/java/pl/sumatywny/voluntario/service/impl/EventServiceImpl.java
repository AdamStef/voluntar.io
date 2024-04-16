package pl.sumatywny.voluntario.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.EventService;

import java.time.LocalDateTime;

@Service
public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Boolean CreateEvent(Event event) {
        if(event.getOrganizer() != null && userRepository.findById(event.getOrganizer().getId()).isPresent()) {
            eventRepository.save(event);
            return true;
        }
        return false;
    }
    @Override
    public Boolean DeleteEvent(Event event) {
        if (eventRepository.findFirstById(event.getId()) != null) {
            eventRepository.delete(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean assignUserToEvent(Event event, User user) {
        if (eventRepository.findFirstById(event.getId()) != null && userRepository.findFirstById(user.getId()) != null) {
            event.addParticipant(user);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean removeUserFromEvent(Event event, User user) {
        if (eventRepository.findFirstById(event.getId()) != null && userRepository.findFirstById(user.getId()) != null) {
            event.removeParticipant(user);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventName(Event event, String newName) {
        if (eventRepository.findFirstById(event.getId()) != null) {
            event.setName(newName);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventDescription(Event event, String newDescription) {
        if (eventRepository.findFirstById(event.getId()) != null) {
            event.setDescription(newDescription);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventStartDate(Event event, LocalDateTime newStartDate) {
        if (eventRepository.findFirstById(event.getId()) != null) {
            event.setStartDate(newStartDate);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventEndDate(Event event, LocalDateTime newEndDate) {
        if (eventRepository.findFirstById(event.getId()) != null) {
            event.setEndDate(newEndDate);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventLocation(Event event, Location newLocation) {
        if (eventRepository.findFirstById(event.getId()) != null) {
            event.setLocation(newLocation);
            eventRepository.save(event);
            return true;
        }
        return false;
    }
}
