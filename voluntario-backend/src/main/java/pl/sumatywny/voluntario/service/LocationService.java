package pl.sumatywny.voluntario.service;

import pl.sumatywny.voluntario.model.event.Location;

public interface LocationService {

    Boolean CreateLocation(Location Location);
    Boolean DeleteLocation(Location Location);
    Boolean changeLocationName(Location Location, String newName);
    Boolean changeLocationAdditionalInfo(Location Location, String newAdditionalInformation);
    Boolean changeLocationCity(Location Location, String newCity);
    Boolean changeLocationPostalCode(Location Location, String newPostalCode);
    Boolean changeLocationStreet(Location Location, String newStreet);
    Boolean changeLocationStreetNumber(Location Location, String newStreetNumber);
    Boolean changeLocationFlatNumber(Location Location, String newFlatNumber);
    Boolean changeLocationLatitude(Location Location, String newLatitude);
    Boolean changeLocationLongitude(Location Location, String newLongitude);

}
