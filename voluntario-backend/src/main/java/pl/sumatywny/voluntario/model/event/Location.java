package pl.sumatywny.voluntario.model.event;


import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String postalCode;
    @Column(nullable = false)
    private String street;
    @Column(nullable = false)
    private String number;
    @Column(nullable = true)
    //Może być nullem
    private String flatNumber;

    //Może się przyda do jakiejś integracji z mapą
    @Column(nullable = false)
    private String latitude;
    @Column(nullable = false)
    private String longitude;

    //Dodatkowe info, typu wejście od ulicy X
    @Column(nullable = true)
    private String additionalInformation;

}
