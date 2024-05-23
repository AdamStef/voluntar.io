package pl.sumatywny.voluntario.dtos.event;

import lombok.Getter;
import pl.sumatywny.voluntario.dtos.user.UserEvaluationDTO;

import java.util.List;

@Getter
public class CompleteEventDTO {
    List<UserEvaluationDTO> evaluations;
}
