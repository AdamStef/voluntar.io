package pl.sumatywny.voluntario.model.pointsShop.promoCodes;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.Formula;
import org.springframework.lang.NonNull;
import pl.sumatywny.voluntario.model.pointsShop.Offer;

import java.time.LocalDate;


@Entity
@Table(name = "promocodes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorColumn(name = "promo-code_type",
        discriminatorType = DiscriminatorType.STRING)
public abstract class PromoCode {

    @Id
    @NonNull
    private String code;

    @NonNull
    @Min(1)
    private Integer maxUsages;

    @ManyToOne
    @NonNull
    private Offer offer;

    @NonNull
    private LocalDate expirationDate;

    @NonNull
    @Formula("(CASE WHEN expiration_date >= CURRENT_DATE THEN true ELSE false END)")
    private Boolean canBeUsed;

    @NonNull
    public Boolean isAssignedToUser;

    @PrePersist
    @PreUpdate
    private void updateIsRedeemable() {
        this.canBeUsed = !LocalDate.now().isAfter(this.expirationDate);
    }
}