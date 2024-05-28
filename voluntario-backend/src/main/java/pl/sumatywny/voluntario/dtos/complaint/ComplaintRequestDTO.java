package pl.sumatywny.voluntario.dtos.complaint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ComplaintRequestDTO {
    private Long reportedID;
    private String text;
}
