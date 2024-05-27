package pl.sumatywny.voluntario.service.impl;

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
import pl.sumatywny.voluntario.repository.OfferRepository;
import pl.sumatywny.voluntario.repository.PromoCodePossessionRepository;
import pl.sumatywny.voluntario.repository.PromoCodeRepository;
import pl.sumatywny.voluntario.repository.SponsorRepository;

import java.time.LocalDate;
import java.util.List;

import static pl.sumatywny.voluntario.enums.Role.ROLE_VOLUNTEER;

public class PointsShopService {
    private final PromoCodeRepository promoCodeRepository;
    private final OfferRepository offerRepository;
    private final SponsorRepository sponsorRepository;
    private final PromoCodePossessionRepository promoCodePossessionRepository;

    public PointsShopService(PromoCodeRepository promoCodeRepository, OfferRepository offerRepository, SponsorRepository sponsorRepository, PromoCodePossessionRepository promoCodePossessionRepository) {
        this.promoCodeRepository = promoCodeRepository;
        this.offerRepository = offerRepository;
        this.sponsorRepository = sponsorRepository;
        this.promoCodePossessionRepository = promoCodePossessionRepository;
    }

    /*Sponsors*/

    public Sponsor createSponsor(SponsorDTO sponsorDTO) {
        Sponsor sponsor = new Sponsor();
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

    public Offer createOffer(OfferDTO offerDTO){
        Offer offer = new Offer();
        try {
            if(offerDTO.getEndDate().isAfter(LocalDate.now())){
                throw new RuntimeException("End date must be after start date");
            }
            offer.setName(offerDTO.getName());
            offer.setDescription(offerDTO.getDescription());
            offer.setEndDate(offerDTO.getEndDate());
            offer.setSponsor(sponsorRepository.findFirstById(offerDTO.getSponsorID()));
        } catch (Exception e) {
            throw new RuntimeException("Error while creating offer", e);
        }
        try {
            return offerRepository.save(offer);
        } catch (Exception e) {
            throw new RuntimeException("Error while saving offer", e);
        }
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

    public PromoCode createPromoCode(PromoCodeDTO promoCodeDTO) {
        PromoCode promoCode = PromoCodeMapper.toPromoCode(promoCodeDTO);
        if(promoCodeDTO.getExpirationDate().isAfter(LocalDate.now())){
            throw new RuntimeException("Expiration date must be after current date");
        }
        try {
            promoCode.setOffer(offerRepository.findFirstById(promoCodeDTO.getOfferID()));
        } catch (Exception e) {
            throw new RuntimeException("Error while creating promo code", e);
        }
        try {
            return promoCodeRepository.save(promoCode);
        } catch (Exception e) {
            throw new RuntimeException("Error while saving promo code", e);
        }
    }

    public PromoCode findPromoCodeByCode(String id) {
        return promoCodeRepository.findFirstByCode(id);
    }

    public List<PromoCode> findAllPromoCodes() {
        return promoCodeRepository.findAll();
    }

    public List<PromoCode> findAllPromoCodesByOfferId(Long offerId) {
        return promoCodeRepository.findAllByOfferId(offerId);
    }

    /*PromoCodePossession*/

    public PromoCodePossession assignCodeToUser(PromoCode promoCode, User user) {
        if(!(user.getRole().getRole() == Role.ROLE_VOLUNTEER)){
            throw new RuntimeException("Only volunteers can have promo codes");
        }
        PromoCodePossession promoCodePossession = new PromoCodePossession();
        promoCodePossession.setPromoCode(promoCode);
        promoCodePossession.setVolunteer(user);
        try {
            return promoCodePossessionRepository.save(promoCodePossession);
        } catch (Exception e) {
            throw new RuntimeException("Error while saving promo code possession", e);
        }
    }

    public PromoCodePossession findPromoCodePossessionById(Long id) {
        return promoCodePossessionRepository.findFirstById(id);
    }

    public List<PromoCodePossession> findAllPromoCodePossessions() {
        return promoCodePossessionRepository.findAll();
    }

    public List<PromoCodePossession> findAllUsersPromoCodes(Long volunteerId) {
        return promoCodePossessionRepository.findAllByVolunteerId(volunteerId);
    }

}
