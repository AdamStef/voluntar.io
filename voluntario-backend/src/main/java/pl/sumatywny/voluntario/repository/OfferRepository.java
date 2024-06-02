package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.pointsShop.Offer;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    Offer findFirstById(Long id);
    List<Offer> findAll();

    @Query("SELECT o FROM Offer o WHERE o.organization.name = ?1")
    List<Offer> findAllByOrganizationName(String organizationName);
}
