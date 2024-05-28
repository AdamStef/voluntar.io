package pl.sumatywny.voluntario.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import static jakarta.persistence.GenerationType.IDENTITY;

@Data
@Entity(name = "scores")
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


}
