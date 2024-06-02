package pl.sumatywny.voluntario.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserEvaluationDTO {
    private Long userId;
    private int rating;
    private String comment;
}
