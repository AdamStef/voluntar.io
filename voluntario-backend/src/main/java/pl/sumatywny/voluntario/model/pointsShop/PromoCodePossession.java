package pl.sumatywny.voluntario.model.pointsShop;

import jakarta.persistence.*;
import lombok.*;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;
import pl.sumatywny.voluntario.model.user.User;

@Entity
@Table(name = "promo_code_possessions")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PromoCodePossession {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @ManyToOne
    private PromoCode promoCode;

    @NonNull
    @ManyToOne
    private User volunteer;


}
