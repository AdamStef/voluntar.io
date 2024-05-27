package pl.sumatywny.voluntario.model.pointsShop;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;

@Entity
@Table(name = "offers")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Offer {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @NotBlank(message = "Name is mandatory")
    private String name;

    @NonNull
    private String description;

    @NonNull
    @ManyToOne
    private Sponsor sponsor;

    @NonNull
    private LocalDate endDate;

    @NonNull
    @Formula("(CASE WHEN end_date >= CURRENT_DATE THEN true ELSE false END)")
    private Boolean isActive;

    @PrePersist
    @PreUpdate
    private void updateIsRedeemable() {
        this.isActive = !LocalDate.now().isAfter(this.endDate);
    }
}
