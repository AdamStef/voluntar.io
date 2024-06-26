package pl.sumatywny.voluntario.model.pointsShop;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @OneToOne
    private PromoCode promoCode;

    @JsonIgnore
    @NonNull
    @ManyToOne
    private User volunteer;


}
