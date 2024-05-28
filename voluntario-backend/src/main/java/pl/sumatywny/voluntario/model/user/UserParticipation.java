package pl.sumatywny.voluntario.model.user;

import jakarta.persistence.*;
import lombok.*;
import pl.sumatywny.voluntario.model.AuditingEntity;
import pl.sumatywny.voluntario.model.event.Event;

import static jakarta.persistence.GenerationType.IDENTITY;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserParticipation extends AuditingEntity {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
//    private boolean isOrganizer;
//    private boolean isParticipant;
//    private boolean isVolunteer;
//    private boolean isAccepted;
//    private boolean isRejected;
//    private boolean isCompleted;
//    private boolean isRated;
    private int rating;
    private String comment;
//    private boolean isEvaluated;
//    private boolean isCommented;
//    private boolean isCanceled;
//    private boolean isResigned;
//    private boolean isReported;
//    private boolean isBlocked;
//    private boolean isDeleted;
}
