package pl.sumatywny.voluntario.model.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Getter
@Setter
public class Organisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private User user;
    private String organisationName;
    private String organisationDescription;
    private String krs;
    private String address;
    private String organisationPage;

}
