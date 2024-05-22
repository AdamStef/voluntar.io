package pl.sumatywny.voluntario.model.event;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.AuditingEntity;
import pl.sumatywny.voluntario.model.user.UserParticipation;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "events")
@Data
@ToString
@EntityListeners(AuditingEntityListener.class)
public class Event extends AuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    private Organization organization;
    private int numberOfVolunteersNeeded;
//    @ManyToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.EAGER)
//    @JoinTable(
//            name = "events_participants",
//            joinColumns = @JoinColumn(name = "events_id"),
//            inverseJoinColumns = @JoinColumn(name = "users_id")
//    )
//    private List<User> participants;

    @OneToMany(mappedBy = "event", cascade = CascadeType.PERSIST)
    private List<UserParticipation> participations;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Post> posts;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Location location;
}