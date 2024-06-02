package pl.sumatywny.voluntario.dtos.pointsShop;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PromoCodeResponseDTO {
    private String code;
    private LocalDate expirationDate;
    private Boolean isNotExpired;
    private Boolean canBeUsed;
    private Boolean isAssignedToUser;
}
