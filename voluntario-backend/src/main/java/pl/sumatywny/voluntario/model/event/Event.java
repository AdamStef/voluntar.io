package pl.sumatywny.voluntario.model.event;

import jakarta.persistence.*;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "events")
@Data
@ToString
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    private User organizer;
    private int numberOfVolunteersNeeded;
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "events_participants",
            joinColumns = @JoinColumn(name = "events_id"),
            inverseJoinColumns = @JoinColumn(name = "users_id")
    )
    private List<User> participants;
    private LocalDateTime startDate;
    private LocalDateTime endDate;


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