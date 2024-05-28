package pl.sumatywny.voluntario.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.config.roleAnnotations.IsAdmin;
import pl.sumatywny.voluntario.dtos.pointsShop.OfferCreationRequestDTO;
import pl.sumatywny.voluntario.dtos.pointsShop.SponsorDTO;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.PointsShopService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/points-shop")
public class PointsShopController {
    private final PointsShopService pointsShopService;
    private final UserService userService;
    private final AuthService authService;

    /*Sponsors*/

    @PostMapping("/sponsors")
    @IsAdmin
    public ResponseEntity<?> createSponsor(@RequestBody SponsorDTO sponsorDTO) {
        return ResponseEntity.ok(pointsShopService.createSponsor(sponsorDTO));
    }

    @GetMapping("/sponsors")
    public ResponseEntity<?> getAllSponsors() {
        return ResponseEntity.ok(pointsShopService.findAllSponsors());
    }

    @GetMapping("/sponsors/{sponsorId}")
    public ResponseEntity<?> getSponsor(@PathVariable("sponsorId") Long sponsorId) {
        return ResponseEntity.ok(pointsShopService.findSponsorById(sponsorId));
    }

    /*Offers*/
    @PostMapping("/offers")
    @IsAdmin
    public ResponseEntity<?> createOffer(@RequestBody OfferCreationRequestDTO offerCreationRequestDTO) {
        var offerDTO = offerCreationRequestDTO.getOfferDTO();
        var promoCodeDTO = offerCreationRequestDTO.getPromoCodeDTO();
        var numberOfPromoCodes = offerCreationRequestDTO.getNumberOfPromoCodes();
        return ResponseEntity.ok(pointsShopService.createOffer(offerDTO, promoCodeDTO, numberOfPromoCodes));
    }

    @GetMapping("/offers")
    public ResponseEntity<?> getAllOffers() {
        return ResponseEntity.ok(pointsShopService.findAllOffers());
    }

    @GetMapping("/offers/sponsor/{sponsorID}")
    public ResponseEntity<?> getOffersBySponsor(@PathVariable("sponsorID") Long sponsorId) {
        return ResponseEntity.ok(pointsShopService.findAllOffersBySponsorId(sponsorId));
    }

    @GetMapping("/offers/active")
    public ResponseEntity<?> getActiveOffers() {
        return ResponseEntity.ok(pointsShopService.findAllActiveOffers());
    }

    @GetMapping("/offers/{offerID}")
    public ResponseEntity<?> getOffer(@PathVariable("offerID") Long offerId) {
        return ResponseEntity.ok(pointsShopService.findOfferById(offerId));
    }


    @PostMapping("/offers/{offerID}/assign")
    public ResponseEntity<?> assignPromoCode(@PathVariable("offerID") Long offerID) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.assignCodeToUser(offerID, user));
    }

    @GetMapping("/my-promo-codes")
    public ResponseEntity<?> getMyPromoCodes(@RequestParam(value = "active", required=false) Boolean active) {
        var user = authService.getUserFromSession();
        if(active) {
            return ResponseEntity.ok(pointsShopService.findAllUsersPromoCodes(user.getId(), active));
        }
        return ResponseEntity.ok(pointsShopService.findAllUsersPromoCodes(user.getId(), false));
    }

    @GetMapping("/my-promo-codes/{promoCode}")
    public ResponseEntity<?> getMyPromoCode(@PathVariable("promoCode") String promoCode) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.findPromoCodeByCode(user.getId(), promoCode));
    }


}
