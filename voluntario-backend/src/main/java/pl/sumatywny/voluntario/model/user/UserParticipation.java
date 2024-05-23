package pl.sumatywny.voluntario.model.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
    private User user;
    @ManyToOne
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
//    private boolean isCommented;
//    private boolean isCanceled;
//    private boolean isResigned;
//    private boolean isReported;
//    private boolean isBlocked;
//    private boolean isDeleted;
}
