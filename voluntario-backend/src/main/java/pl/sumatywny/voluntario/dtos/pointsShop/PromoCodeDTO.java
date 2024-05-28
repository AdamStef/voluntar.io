package pl.sumatywny.voluntario.dtos.pointsShop;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@AllArgsConstructor
@Data
@NoArgsConstructor
public class PromoCodeDTO {
    @NonNull
    private Long offerID;
    @NonNull
    @Pattern(regexp = "percentage|value")
    private String promoCodeType;

    @NonNull
    @Positive
    private BigDecimal discount;

    @NonNull
    @Min(1)
    private Integer maxUsages;

    @NonNull
    private LocalDate expirationDate;
}

