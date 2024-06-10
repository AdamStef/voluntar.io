package pl.sumatywny.voluntario.dtos.post;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRequestDTO {
    private StringBuilder content;
}
