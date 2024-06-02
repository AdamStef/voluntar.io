package pl.sumatywny.voluntario.model.pointsShop.promoCodes;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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

    @ManyToOne
    @NonNull
    private Offer offer;

    @NonNull
    private LocalDate expirationDate;

    @NonNull
    private Boolean isNotExpired;

    @NonNull
    private Boolean canBeUsed;

    @NonNull
    private Boolean isAssignedToUser;

    @PostLoad
    private void fun() {
        this.isNotExpired = !LocalDate.now().isAfter(this.expirationDate);
    }
}
