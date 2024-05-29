package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.pointsShop.OfferDTO;
import pl.sumatywny.voluntario.dtos.pointsShop.PromoCodeDTO;
import pl.sumatywny.voluntario.dtos.pointsShop.SponsorDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.mapper.PromoCodeMapper;
import pl.sumatywny.voluntario.model.pointsShop.Offer;
import pl.sumatywny.voluntario.model.pointsShop.PromoCodePossession;
import pl.sumatywny.voluntario.model.pointsShop.Sponsor;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static pl.sumatywny.voluntario.enums.Role.ROLE_VOLUNTEER;

@Service
public class PointsShopService {
    private final PromoCodeRepository promoCodeRepository;
    private final OfferRepository offerRepository;
    private final SponsorRepository sponsorRepository;
    private final PromoCodePossessionRepository promoCodePossessionRepository;
    private final ScoreRepository scoreRepository;

    public PointsShopService(PromoCodeRepository promoCodeRepository, OfferRepository offerRepository, SponsorRepository sponsorRepository, PromoCodePossessionRepository promoCodePossessionRepository, ScoreRepository scoreRepository) {
        this.promoCodeRepository = promoCodeRepository;
        this.offerRepository = offerRepository;
        this.sponsorRepository = sponsorRepository;
        this.promoCodePossessionRepository = promoCodePossessionRepository;
        this.scoreRepository = scoreRepository;
    }

    /*Sponsors*/

    public Sponsor createSponsor(SponsorDTO sponsorDTO) {
        Sponsor sponsor = new Sponsor();
        System.out.println(sponsorDTO.getName());
        try {
            sponsor.setName(sponsorDTO.getName());
        } catch (Exception e) {
            throw new RuntimeException("Error while creating sponsor", e);
        }
        try {
            return sponsorRepository.save(sponsor);
        } catch (Exception e) {
            throw new RuntimeException("Error while saving sponsor", e);
        }
    }

    public Sponsor findSponsorById(Long id) {
        return sponsorRepository.findFirstById(id);
    }

    public List<Sponsor> findAllSponsors() {
        return sponsorRepository.findAll();
    }

    /*Offers*/

    public Object[] createOffer(OfferDTO offerDTO, PromoCodeDTO promoCodeDTO, int numberOfPromoCodes) {
        Offer offer = new Offer();
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
            offer.setSponsor(sponsorRepository.findFirstById(offerDTO.getSponsorID()));
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

    public List<Offer> findAllOffersBySponsorId(Long sponsorId) {
        return offerRepository.findAllBySponsorId(sponsorId);
    }

    /*PromoCodes*/

//    public PromoCode createPromoCode(PromoCodeDTO promoCodeDTO) {
//        PromoCode promoCode = PromoCodeMapper.toPromoCode(promoCodeDTO);
//        if(promoCodeDTO.getExpirationDate().isAfter(LocalDate.now())){
//            throw new RuntimeException("Expiration date must be after current date");
//        }
//        try {
//            promoCode.setOffer(offerRepository.findFirstById(promoCodeDTO.getOfferID()));
//        } catch (Exception e) {
//            throw new RuntimeException("Error while creating promo code", e);
//        }
//        try {
//            return promoCodeRepository.save(promoCode);
//        } catch (Exception e) {
//            throw new RuntimeException("Error while saving promo code", e);
//        }
//    }
//
//    public PromoCode findPromoCodeByCode(String id) {
//        return promoCodeRepository.findFirstByCode(id);
//    }
//
//    public List<PromoCode> findAllPromoCodes() {
//        return promoCodeRepository.findAll();
//    }
//
//    public List<PromoCode> findAllPromoCodesByOfferId(Long offerId) {
//        return promoCodeRepository.findAllByOfferId(offerId);
//    }

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
            promoCodePossessionList.removeIf(promoCodePossession -> !promoCodePossession.getPromoCode().getCanBeUsed());
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
        if (promoCodePossession.getVolunteer().getId() != userID) {
            throw new RuntimeException("Promo code possession not found");
        }
        return promoCodePossession.getPromoCode();
    }

    public int getPointsForUser(Long userId) {
        return scoreRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User does not have a score"))
                .getPurchasePoints();
    }
}
