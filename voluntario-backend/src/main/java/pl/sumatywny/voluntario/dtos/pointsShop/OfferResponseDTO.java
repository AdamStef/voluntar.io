package pl.sumatywny.voluntario.dtos.pointsShop;

import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;
import pl.sumatywny.voluntario.model.user.Organization;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class OfferResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Organization organization;
    private LocalDate endDate;
    private Integer pointsCost;
    private List<PromoCode> promoCodes;
//    private List<PromoCodeResponseDTO> promoCodes;
    private Boolean isActive;
    private int availablePromoCodes;
}
