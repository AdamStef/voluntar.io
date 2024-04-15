package pl.sumatywny.voluntario.service.impl;

import lombok.Setter;
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
    public Boolean CreateEvent(Event Event) {
        if(Event.getOrganizer() != null && userRepository.findById(Event.getOrganizer().getId()).isPresent()) {
            eventRepository.save(Event);
            return true;
        }
        return false;
    }
    @Override
    public Boolean DeleteEvent(Event Event) {
        if(eventRepository.findById(Event.getId()).isPresent()) {
            eventRepository.delete(Event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean assignUserToEvent(Event Event, User User) {
        if(eventRepository.findById(Event.getId()).isPresent() && userRepository.findById(User.getId()).isPresent()) {
            return Event.addParticipant(User);
        }
        return false;
    }

    @Override
    public Boolean removeUserFromEvent(Event Event, User User) {
        if(eventRepository.findById(Event.getId()).isPresent() && userRepository.findById(User.getId()).isPresent()) {
            return Event.removeParticipant(User);
        }
        return false;
    }

    @Override
    public Boolean changeEventName(Event Event, String newName) {
        if(eventRepository.findById(Event.getId()).isPresent()) {
            Event.setName(newName);
            eventRepository.save(Event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventDescription(Event Event, String newDescription) {
        if(eventRepository.findById(Event.getId()).isPresent()) {
            Event.setDescription(newDescription);
            eventRepository.save(Event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventStartDate(Event Event, LocalDateTime newStartDate) {
        if(eventRepository.findById(Event.getId()).isPresent()) {
            Event.setStartDate(newStartDate);
            eventRepository.save(Event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventEndDate(Event Event, LocalDateTime newEndDate) {
        if(eventRepository.findById(Event.getId()).isPresent()) {
            Event.setEndDate(newEndDate);
            eventRepository.save(Event);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeEventLocation(Event Event, Location newLocation) {
        if(eventRepository.findById(Event.getId()).isPresent()) {
            Event.setLocation(newLocation);
            eventRepository.save(Event);
            return true;
        }
        return false;
    }
}
