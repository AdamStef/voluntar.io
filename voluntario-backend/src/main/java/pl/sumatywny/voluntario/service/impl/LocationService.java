package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.LocationDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.PermissionsException;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.LocationRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class LocationService {
    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location createLocation(LocationDTO locationDTO, User user) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot create events.");
        }

        Location location = Location.builder()
                .name(locationDTO.getName())
                .city(locationDTO.getCity())
                .postalCode(locationDTO.getPostalCode())
                .street(locationDTO.getStreet())
                .number(locationDTO.getNumber())
                .flatNumber(locationDTO.getFlatNumber())
                .latitude(locationDTO.getLatitude())
                .longitude(locationDTO.getLongitude())
                .additionalInformation(locationDTO.getAdditionalInformation())
                .build();
        return locationRepository.save(location);
    }

    public Location getLocation(Long locationID) {
        Location location = locationRepository.findFirstById(locationID);
        if (location == null) {
            throw new NoSuchElementException("Location not found.");
        }

        return location;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public void removeLocation(Long locationID, User user) {
        UserRole role = user.getRole();
        if (role.getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot remove events.");
        }

        Location location = locationRepository.findFirstById(locationID);
        if (location == null) {
            throw new NoSuchElementException("Location not found.");
        }

        locationRepository.delete(location);
    }

    public Location editLocation(Long locationID, LocationDTO locationDTO, User user) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot edit events.");
        }

        Location location = locationRepository.findFirstById(locationID);
        if (location == null) {
            throw new NoSuchElementException("Location not found.");
        }

        location.setName(locationDTO.getName());
        location.setCity(locationDTO.getCity());
        location.setPostalCode(locationDTO.getPostalCode());
        location.setStreet(locationDTO.getStreet());
        location.setNumber(locationDTO.getNumber());
        location.setFlatNumber(locationDTO.getFlatNumber());
        location.setLatitude(locationDTO.getLatitude());
        location.setLongitude(locationDTO.getLongitude());
        location.setAdditionalInformation(locationDTO.getAdditionalInformation());
        return locationRepository.save(location);
    }
}
