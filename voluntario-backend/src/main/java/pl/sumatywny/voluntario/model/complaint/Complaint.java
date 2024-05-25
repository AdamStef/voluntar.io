package pl.sumatywny.voluntario.model.complaint;

import jakarta.persistence.*;
import lombok.*;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;

@Entity
@Table (name = "complaints")
@Data
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User reporter;
    String textComplaint;
    @ManyToOne
    private User reported;
    private LocalDateTime reportDate;
    private LocalDateTime claimDate;
    private LocalDateTime resolveDate;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String response;
    private Long adminID;
    @Version
    private int version;

    public void changeStatusUnderReview() {
        this.setStatus(Status.UNDER_REVIEW);
    }

    public void changeStatusResolved(Long adminID) throws IllegalAccessException {
        if(!this.adminID.equals(adminID)){
            throw new IllegalAccessException(String.format("Admin with %d was not assigned to this complaint", adminID));
        }
        this.setStatus(Status.RESOLVED);
    }

}
