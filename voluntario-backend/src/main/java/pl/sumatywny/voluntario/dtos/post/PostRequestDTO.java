package pl.sumatywny.voluntario.dtos.post;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostRequestDTO {
    private StringBuilder content;
}
