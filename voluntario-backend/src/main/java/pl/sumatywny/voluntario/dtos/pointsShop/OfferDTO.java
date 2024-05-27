package pl.sumatywny.voluntario.dtos.pointsShop;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class OfferDTO {
    @NonNull
    @NotBlank
    private String name;

    @NonNull
    private String description;

    @NonNull
    private Long sponsorID;

    @NonNull
    private LocalDate endDate;
}
