package pl.sumatywny.voluntario.model.event;


import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "locations")
@Embeddable
@Data
@ToString
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String city;
    private String postalCode;
    private String street;
    private String number;
    //Może być nullem
    private String flatNumber;

    //Może się przyda do jakiejś integracji z mapą
    private double latitude;
    private double longitude;

    //Dodatkowe info, typu wejście od ulicy X
    private String additionalInformation;
}
