package pl.sumatywny.voluntario.dtos.pointsShop;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SponsorDTO {
    @NonNull
    @Size(min = 3)
    private String name;

}
