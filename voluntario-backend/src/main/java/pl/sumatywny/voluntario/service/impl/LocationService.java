package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.LocationDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.LocationRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class LocationService {
    private final LocationRepository locationRepository;
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public String createLocation(LocationDTO locationDTO, User user) throws Exception {
        if(user.isEmpty()) {
            throw new Exception("User not found");
        }
        UserRole role = user.get().getRole();
        if (role.getRole() == Role.ROLE_VOLUNTEER) {
            throw new Exception("Volunteers cannot create events.");
        }
        Set<Location> locations = new HashSet<>(locationRepository.findAll());
        for (Location l : locations) {
            if (l.getName().equals(locationDTO.getName())
            && l.getCity().equals(locationDTO.getCity())
            && l.getStreet().equals(locationDTO.getStreet())
            && l.getNumber().equals(locationDTO.getNumber())
            && l.getFlatNumber().equals(locationDTO.getFlatNumber())
            && l.getPostalCode().equals(locationDTO.getPostalCode())
            && l.getLatitude().equals(locationDTO.getLatitude())
            && l.getLongitude().equals(locationDTO.getLongitude())
            && l.getAdditionalInformation().equals(locationDTO.getAdditionalInformation())) {
                throw new Exception("Location already exists.");
            }
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
        locationRepository.save(location);
        return "Location created.";
    }

    public Location getLocation(Long locationID) throws Exception {
        Location location = locationRepository.findFirstById(locationID);
        if (location == null) {
            throw new Exception("Location not found.");
        }
        return location;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public String removeLocation(Long locationID, User user) throws Exception {
        if(user.isEmpty()) {
            throw new Exception("User not found");
        }
        UserRole role = user.get().getRole();
        if (role.getRole() == Role.ROLE_VOLUNTEER) {
            throw new Exception("Volunteers cannot remove events.");
        }
        Location location = locationRepository.findFirstById(locationID);
        if (location == null) {
            throw new Exception("Location not found.");
        }
        locationRepository.delete(location);
        return "Location removed.";
    }

    public String editLocation(Long locationID, LocationDTO locationDTO, User user) throws Exception {
        if(user.isEmpty()) {
            throw new Exception("User not found");
        }
        UserRole role = user.get().getRole();
        if (role.getRole() == Role.ROLE_VOLUNTEER) {
            throw new Exception("Volunteers cannot edit events.");
        }
        Location location = locationRepository.findFirstById(locationID);
        if (location == null) {
            throw new Exception("Location not found.");
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
        locationRepository.save(location);
        return "Location edited.";
    }

}
