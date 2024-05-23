package pl.sumatywny.voluntario.dtos.user;

import lombok.Getter;

@Getter
public class UserEvaluationDTO {
    private Long userId;
    private int rating;
    private String comment;
}
