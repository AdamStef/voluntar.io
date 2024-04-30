package pl.sumatywny.voluntario.dtos;


import lombok.Data;
import pl.sumatywny.voluntario.model.event.Event;

import java.time.LocalDateTime;

@Data
public class PostDTO {
//    private LocalDateTime creationDate;
    private StringBuilder content;
}
