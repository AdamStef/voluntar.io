package pl.sumatywny.voluntario.model.event;

import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Event {
    private Long id;
    private String name;
    private String description;
    private User organizer;
    private List<User> participants;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Location location;


    public Boolean addParticipant(User user) {
        if(participants.contains(user)) {
            return false;
        }
        else {
            return participants.add(user);
        }
    }

    public Boolean removeParticipant(User user) {
        if(participants.contains(user)) {
            return participants.remove(user);
        }
        else {
            return false;
        }
    }
}