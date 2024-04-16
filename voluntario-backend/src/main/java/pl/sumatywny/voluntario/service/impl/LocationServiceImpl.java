package pl.sumatywny.voluntario.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.repository.LocationRepository;
import pl.sumatywny.voluntario.service.LocationService;

@Service
public class LocationServiceImpl implements LocationService {
    @Autowired
    private LocationRepository locationRepository;

    @Override
    public Boolean CreateLocation(Location location) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean DeleteLocation(Location location) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            locationRepository.delete(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationName(Location location, String newName) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setName(newName);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationAdditionalInfo(Location location, String newAdditionalInformation) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setAdditionalInformation(newAdditionalInformation);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationCity(Location location, String newCity) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setCity(newCity);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationPostalCode(Location location, String newPostalCode) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setPostalCode(newPostalCode);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationStreet(Location location, String newStreet) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setStreet(newStreet);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationStreetNumber(Location location, String newStreetNumber) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setNumber(newStreetNumber);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationFlatNumber(Location location, String newFlatNumber) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setFlatNumber(newFlatNumber);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationLatitude(Location location, String newLatitude) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setLatitude(newLatitude);
            locationRepository.save(location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationLongitude(Location location, String newLongitude) {
        if(locationRepository.findFirstById(location.getId()) != null) {
            location.setLongitude(newLongitude);
            locationRepository.save(location);
            return true;
        }
        return false;
    }



}
