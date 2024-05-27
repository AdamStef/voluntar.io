package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.pointsShop.PromoCodePossession;

import java.util.List;

@Repository
public interface PromoCodePossessionRepository extends JpaRepository<PromoCodePossession, Long> {
    PromoCodePossession findFirstById(Long id);
    List<PromoCodePossession> findAll();

    @Query("SELECT p FROM PromoCodePossession p WHERE p.volunteer.id = ?1")
    List<PromoCodePossession> findAllByVolunteerId(Long volunteerId);
}
