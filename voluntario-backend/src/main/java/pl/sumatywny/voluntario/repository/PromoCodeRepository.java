package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;

import java.util.List;

@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, String> {
    PromoCode findFirstByCode(String code);

    @Query("SELECT p FROM PromoCode p WHERE p.offer.id = ?1")
    List<PromoCode> findAllByOfferId(Long offerId);

    @Query("SELECT p FROM PromoCode p WHERE p.offer.id = ?1 and p.isNotExpired = true and p.isAssignedToUser = false")
    List<PromoCode> findFirstAssignablePromoCodeByOfferId(Long offerId);

}
