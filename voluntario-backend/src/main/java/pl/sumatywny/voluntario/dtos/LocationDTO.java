package pl.sumatywny.voluntario.dtos;

import lombok.Data;

@Data
public class LocationDTO {
    private String name;
    private String city;
    private String postalCode;
    private String street;
    private String number;
    private String flatNumber;
    private String latitude;
    private String longitude;
    private String additionalInformation;
}
