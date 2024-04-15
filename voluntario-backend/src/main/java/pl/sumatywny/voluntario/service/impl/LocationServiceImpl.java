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
    public Boolean CreateLocation(Location Location) {
        if(!locationRepository.findById(Location.getId()).isPresent()) {
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean DeleteLocation(Location Location) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            locationRepository.delete(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationName(Location Location, String newName) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setName(newName);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationAdditionalInfo(Location Location, String newAdditionalInformation) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setAdditionalInformation(newAdditionalInformation);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationCity(Location Location, String newCity) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setCity(newCity);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationPostalCode(Location Location, String newPostalCode) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setPostalCode(newPostalCode);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationStreet(Location Location, String newStreet) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setStreet(newStreet);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationStreetNumber(Location Location, String newStreetNumber) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setNumber(newStreetNumber);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationFlatNumber(Location Location, String newFlatNumber) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setFlatNumber(newFlatNumber);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationLatitude(Location Location, String newLatitude) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setLatitude(newLatitude);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }

    @Override
    public Boolean changeLocationLongitude(Location Location, String newLongitude) {
        if(locationRepository.findById(Location.getId()).isPresent()) {
            Location.setLongitude(newLongitude);
            locationRepository.save(Location);
            return true;
        }
        return false;
    }



}
