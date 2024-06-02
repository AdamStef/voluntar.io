package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.pointsShop.PromoCodePossession;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromoCodePossessionRepository extends JpaRepository<PromoCodePossession, Long> {
    PromoCodePossession findFirstById(Long id);
    List<PromoCodePossession> findAll();

    @Query("SELECT p FROM PromoCodePossession p WHERE p.volunteer.id = ?1")
    List<PromoCodePossession> findAllByVolunteerId(Long volunteerId);

    @Query("SELECT p FROM PromoCodePossession p WHERE p.promoCode.code = ?1")
    Optional<PromoCodePossession> findByPromoCodeCode(String promoCode);

    @Query("SELECT p FROM PromoCodePossession p WHERE p.promoCode.code = ?1")
    PromoCodePossession findFirstByPromoCodeCode(String promoCode);
}
