package pl.sumatywny.voluntario.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationDTO {
    private String name;
    private String city;
    private String postalCode;
    private String street;
    private String number;
    private String flatNumber;
    private double latitude;
    private double longitude;
    private String additionalInformation;
}
