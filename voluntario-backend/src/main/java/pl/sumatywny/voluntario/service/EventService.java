package pl.sumatywny.voluntario.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.EventRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.time.LocalDateTime;


public interface EventService {
    Boolean CreateEvent(Event Event);
    Boolean DeleteEvent(Event Event);
    Boolean assignUserToEvent(Event Event, User User);
    Boolean removeUserFromEvent(Event Event, User User);
    Boolean changeEventName(Event Event, String newName);
    Boolean changeEventDescription(Event Event, String newDescription);
    Boolean changeEventStartDate(Event Event, LocalDateTime newStartDate);
    Boolean changeEventEndDate(Event Event, LocalDateTime newEndDate);
    Boolean changeEventLocation(Event Event, Location newLocation);

}
