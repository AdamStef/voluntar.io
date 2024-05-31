package pl.sumatywny.voluntario.model.event;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.AuditingEntity;
import pl.sumatywny.voluntario.model.user.UserParticipation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
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
    @ManyToOne(fetch = FetchType.EAGER)
    private Organization organization;
    private int numberOfVolunteersNeeded;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<UserParticipation> participations = new ArrayList<>();

//    @DateTimeFormat
    private LocalDateTime startDate;
//    @DateTimeFormat
    private LocalDateTime endDate;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Post> posts;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    private Location location;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.NOT_COMPLETED;
}