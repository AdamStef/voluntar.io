package pl.sumatywny.voluntario.model.pointsShop.promoCodes;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.NumberFormat;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@DiscriminatorValue("value")
public class PromoCodeValue extends PromoCode {

    @NonNull
    @NumberFormat(style = NumberFormat.Style.CURRENCY)
    @Positive
    private BigDecimal discountValue;
}
