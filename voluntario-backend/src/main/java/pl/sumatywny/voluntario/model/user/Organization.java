package pl.sumatywny.voluntario.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Getter
@Setter
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private User user;
    private String name;
    private String description;
    private String krs;
    private String address;
    private String website;
    private boolean verified;
    private LocalDateTime verificationDate;
    private LocalDateTime creationDate;

}
