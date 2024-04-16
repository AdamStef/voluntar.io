package pl.sumatywny.voluntario.model.event;

import jakarta.persistence.*;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Data
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "organizer_id", referencedColumnName = "id")
    private User organizer;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "event_participants",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> participants;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id", referencedColumnName = "id")
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