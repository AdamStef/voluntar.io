package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.pointsShop.OfferDTO;
import pl.sumatywny.voluntario.dtos.pointsShop.PromoCodeDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.mapper.PromoCodeMapper;
import pl.sumatywny.voluntario.model.pointsShop.Offer;
import pl.sumatywny.voluntario.model.pointsShop.PromoCodePossession;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class PointsShopService {
    private final PromoCodeRepository promoCodeRepository;
    private final OfferRepository offerRepository;
    private final PromoCodePossessionRepository promoCodePossessionRepository;
    private final ScoreRepository scoreRepository;
    private final OrganizationRepository organizationRepository;

    public PointsShopService(PromoCodeRepository promoCodeRepository, OfferRepository offerRepository, PromoCodePossessionRepository promoCodePossessionRepository, ScoreRepository scoreRepository, OrganizationRepository organizationRepository) {
        this.promoCodeRepository = promoCodeRepository;
        this.offerRepository = offerRepository;
        this.promoCodePossessionRepository = promoCodePossessionRepository;
        this.scoreRepository = scoreRepository;
        this.organizationRepository = organizationRepository;
    }

    /*Offers*/

    public Object[] createOffer(OfferDTO offerDTO, PromoCodeDTO promoCodeDTO, int numberOfPromoCodes, User user) {
        Offer offer = new Offer();
        var organization = organizationRepository.findOrganizationByUserId(user.getId());
        if (organization == null) {
            throw new RuntimeException("User is not assigned to organization");
        }
        if (numberOfPromoCodes < 1) {
            throw new RuntimeException("Number of promo codes must be greater than 0");
        }
        try {
            if (offerDTO.getEndDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("End date must be after start date");
            }
            offer.setName(offerDTO.getName());
            offer.setDescription(offerDTO.getDescription());
            offer.setEndDate(offerDTO.getEndDate());
            offer.setPointsCost(offerDTO.getPointsCost());
            offer.setOrganization(organization);
        } catch (Exception e) {
            throw new RuntimeException("Error while creating offer", e);
        }
        try {
            offerRepository.save(offer);
        } catch (Exception e) {
            throw new RuntimeException("Error while saving offer", e);
        }
        List<PromoCode> promoCodes = new ArrayList<>();
        for (int i = 0; i < numberOfPromoCodes; i++) {
            promoCodes.add(PromoCodeMapper.toPromoCode(promoCodeDTO));
        }
        for (PromoCode promoCode : promoCodes) {
            promoCode.setOffer(offer);
            promoCode.setIsAssignedToUser(false);
            promoCode.setIsNotExpired(true);
            promoCode.setCanBeUsed(true);
            promoCodeRepository.save(promoCode);
        }
        return new Object[]{offer, promoCodes};
    }

    public Offer findOfferById(Long id) {
        return offerRepository.findFirstById(id);
    }

    public List<Offer> findAllOffers() {
        try {
            var offer_list = offerRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error while finding all offers", e);
        }
        return offerRepository.findAll();
    }

    public List<Offer> findAllActiveOffers() {
        try {
            var offer_list = offerRepository.findAll();
            offer_list.removeIf(offer -> !offer.getIsActive());
        } catch (Exception e) {
            throw new RuntimeException("Error while finding all offers", e);
        }
        return offerRepository.findAll();
    }

    public List<Offer> findAllOffersByOrganization(String organizationName) {
        return offerRepository.findAllByOrganizationName(organizationName);
    }

    /*PromoCodes*/

    /*PromoCodePossession*/

    public PromoCode assignCodeToUser(Long offerID, User user) {
        if (!(user.getRole().getRole() == Role.ROLE_VOLUNTEER)) {
            throw new RuntimeException("Only volunteers can have promo codes");
        }
        PromoCodePossession promoCodePossession = new PromoCodePossession();
        try {
            var promoCodes = promoCodeRepository.findFirstAssignablePromoCodeByOfferId(offerID);
            if (promoCodes.isEmpty()) {
                throw new RuntimeException("No promo codes available for this offer");
            }

            var promoCode = promoCodes.getFirst();

            var score = scoreRepository.findAll().stream()
                    .filter(score1 -> score1.getUser().getId().equals(user.getId())).
                    findFirst()
                    .orElseThrow(() -> new RuntimeException("User does not have a score"));

            if (score.getPurchasePoints() < promoCode.getOffer().getPointsCost()) {
                throw new RuntimeException("User does not have enough points to get this promo code");
            }
            score.setPurchasePoints(score.getPurchasePoints() - promoCode.getOffer().getPointsCost());
            promoCodePossession.setPromoCode(promoCode);
            promoCodePossession.setVolunteer(user);
            promoCode.setIsAssignedToUser(true);
            promoCode.setCanBeUsed(true);
            try {
                promoCodeRepository.save(promoCodePossession.getPromoCode());
                scoreRepository.save(score);
                return promoCodePossessionRepository.save(promoCodePossession).getPromoCode();
            } catch (Exception e) {
                throw new RuntimeException("Error while saving promo code possession", e);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error while assigning promo code to user", e);
        }
    }

    public PromoCodePossession findPromoCodePossessionById(Long id) {
        var promoPossession = promoCodePossessionRepository.findFirstById(id);
        if (promoPossession == null) {
            throw new RuntimeException("Promo code possession not found");
        }
        return promoPossession;
    }

    public List<PromoCode> findAllUsersPromoCodes(Long volunteerId, boolean canBeUsed) {
        List<PromoCode> promoCodeList = new ArrayList<>();
        var promoCodePossessionList = promoCodePossessionRepository.findAllByVolunteerId(volunteerId);
        if (canBeUsed) {
            promoCodePossessionList.removeIf(promoCodePossession -> !promoCodePossession.getPromoCode().getIsNotExpired());
        }
        for (PromoCodePossession promoCodePossession : promoCodePossessionList) {
            promoCodeList.add(promoCodePossession.getPromoCode());
        }
        return promoCodeList;
    }

    public PromoCode findPromoCodeByCode(Long userID, String code) {
        var promoCodePossession = promoCodePossessionRepository.findFirstByPromoCodeCode(code);
        if (promoCodePossession == null) {
            throw new RuntimeException("Promo code possession not found");
        }
        if (!Objects.equals(promoCodePossession.getVolunteer().getId(), userID)) {
            throw new RuntimeException("Promo code possession not found");
        }
        return promoCodePossession.getPromoCode();
    }

    public int getPointsForUser(Long userId) {
        return scoreRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User does not have a score"))
                .getPurchasePoints();
    }

    public PromoCodePossession checkPromoCode(String promoCode, User user) {
        var organization = organizationRepository.findOrganizationByUserId(user.getId());
        if (organization == null) {
            throw new RuntimeException("User is not assigned to organization");
        }
        var promoCodePossession = promoCodePossessionRepository.findFirstByPromoCodeCode(promoCode);
        if (promoCodePossession == null) {
            throw new RuntimeException("Promo code possession not found");
        }
        else if (!Objects.equals(promoCodePossession.getPromoCode().getOffer().getOrganization().getId(), organization.getId())) {
            throw new RuntimeException("Promo code possession not found");
        }
        if(!promoCodePossession.getPromoCode().getIsAssignedToUser()) {
            throw new RuntimeException("Promo code possession not found");
        }
        if(!promoCodePossession.getPromoCode().getIsNotExpired() || !promoCodePossession.getPromoCode().getCanBeUsed()){
            throw new RuntimeException("Promo code can't be used");
        }
        return promoCodePossession;
    }

    public PromoCodePossession redeemPromoCode(String promoCode, User user) {
        var promoCodePossession = checkPromoCode(promoCode, user);
        var promoCodeObject = promoCodePossession.getPromoCode();
        promoCodeObject.setCanBeUsed(false);
        promoCodeRepository.save(promoCodeObject);
        return promoCodePossessionRepository.save(promoCodePossession);
    }
}
