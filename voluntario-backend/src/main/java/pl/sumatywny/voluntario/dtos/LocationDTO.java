package pl.sumatywny.voluntario.dtos;

import lombok.Data;

@Data
public class LocationDTO {
    private String name;
    private String city;
    private String postalCode;
    private String street;
    private String number;
    private int flatNumber;
    private double latitude;
    private double longitude;
    private String additionalInformation;
}
