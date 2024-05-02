package pl.sumatywny.voluntario.dtos.post;


import lombok.Data;

@Data
public class PostRequestDTO {
    private Long eventId;
    private StringBuilder content;
}
