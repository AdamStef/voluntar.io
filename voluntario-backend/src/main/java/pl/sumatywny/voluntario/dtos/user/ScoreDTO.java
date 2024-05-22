package pl.sumatywny.voluntario.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreDTO {
    private Long userId;
    private String username;
    private int points;
    private double rating;
    private int numberOfCompletedEvents;
}
