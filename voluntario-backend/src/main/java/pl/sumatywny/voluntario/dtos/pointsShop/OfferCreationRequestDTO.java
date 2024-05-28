package pl.sumatywny.voluntario.dtos.pointsShop;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OfferCreationRequestDTO {
    private OfferDTO offerDTO;
    private PromoCodeDTO promoCodeDTO;
    private int numberOfPromoCodes;
}
