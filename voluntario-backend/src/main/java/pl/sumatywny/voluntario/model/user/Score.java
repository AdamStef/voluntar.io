package pl.sumatywny.voluntario.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.lang.Nullable;

import static jakarta.persistence.GenerationType.IDENTITY;

@Data
@Entity
@Table(name = "scores")
public class Score {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Min(value = 0, message = "Points must be greater than 0")
    private int totalPoints;

    @Min(value = 0, message = "Rating must be between 0 and 5")
    @Max(value = 5, message = "Rating must be between 0 and 5")
    private double overallRating;

    @OneToOne(fetch = FetchType.EAGER)
    private User user;


    @Min(value=0)
    private int purchasePoints;

    @Transient
    private int previousTotalPoints;

    @PrePersist
    public void prePersist() {
        this.previousTotalPoints = this.totalPoints;
    }

    @PreUpdate
    public void preUpdate() {
        if (this.totalPoints != this.previousTotalPoints) {
            int difference = this.totalPoints - this.previousTotalPoints;
            this.purchasePoints += difference;
            this.previousTotalPoints = this.totalPoints;
        }
    }





}
