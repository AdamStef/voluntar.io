package pl.sumatywny.voluntario.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.config.roleAnnotations.IsAdmin;
import pl.sumatywny.voluntario.config.roleAnnotations.IsOrganization;
import pl.sumatywny.voluntario.config.roleAnnotations.IsVolunteer;
import pl.sumatywny.voluntario.dtos.pointsShop.OfferCreationRequestDTO;
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


    /*Offers*/
    @PostMapping("/offers")
    @IsOrganization
    public ResponseEntity<?> createOffer(@RequestBody OfferCreationRequestDTO offerCreationRequestDTO) {
        var offerDTO = offerCreationRequestDTO.getOffer();
        var promoCodeDTO = offerCreationRequestDTO.getPromoCode();
        var numberOfPromoCodes = offerCreationRequestDTO.getNumberOfPromoCodes();
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.createOffer(offerDTO, promoCodeDTO, numberOfPromoCodes, user));
    }


    @GetMapping("/offers")
    public ResponseEntity<?> getAllOffers() {
        return ResponseEntity.ok(pointsShopService.findAllOffers());
    }

    @GetMapping("/offers/organizations/{organizationName}")
    public ResponseEntity<?> getOffersByOrganization(@PathVariable("organizationName") String organizationName) {
        return ResponseEntity.ok(pointsShopService.findAllOffersByOrganization(organizationName));
    }

    @GetMapping("/offers/active")
    public ResponseEntity<?> getActiveOffers() {
        return ResponseEntity.ok(pointsShopService.findAllActiveOffers());
    }

    @GetMapping("/offers/{offerID}")
    public ResponseEntity<?> getOffer(@PathVariable("offerID") Long offerId) {
        return ResponseEntity.ok(pointsShopService.findOfferById(offerId));
    }

    @DeleteMapping("/offers/{offerID}")
    @IsOrganization
    public ResponseEntity<?> deleteOffer(@PathVariable("offerID") Long offerId) {
        var user = authService.getUserFromSession();
        pointsShopService.deleteOffer(offerId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/offers/{offerID}/assign")
    @IsVolunteer
    public ResponseEntity<?> assignPromoCode(@PathVariable("offerID") Long offerID) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.assignCodeToUser(offerID, user));
    }


    @GetMapping("/my-promo-codes")
    public ResponseEntity<?> getMyPromoCodes(@RequestParam(value = "active", required = false, defaultValue = "false") Boolean active) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.findAllUsersPromoCodes(user.getId(), active));
//        if (active == null || !active) {
//            System.out.println("test");
//            return ResponseEntity.ok(pointsShopService.findAllUsersPromoCodes(user.getId(), false));
//        } else {
//
//        }
    }

    @GetMapping("/my-promo-codes/{promoCode}")
    public ResponseEntity<?> getMyPromoCode(@PathVariable("promoCode") String promoCode) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.findPromoCodeByCode(user.getId(), promoCode));
    }

    @GetMapping("/promo-codes/{promoCode}")
    public ResponseEntity<?> getPromoCode(@PathVariable("promoCode") String promoCode) {
        return ResponseEntity.ok(pointsShopService.findPromoCodeByCode(promoCode));
    }

    @GetMapping("/current-points")
    public ResponseEntity<?> getCurrentPoints() {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.getPointsForUser(user.getId()));
    }

    @IsOrganization
    @GetMapping("/promo-codes/{promoCode}/check")
    public ResponseEntity<?> checkPromoCode(@PathVariable("promoCode") String promoCode) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.checkPromoCode(promoCode, user));
    }

    @IsOrganization
    @PostMapping("/promo-codes/{promoCode}/redeem")
    public ResponseEntity<?> redeemPromoCode(@PathVariable("promoCode") String promoCode) {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok(pointsShopService.redeemPromoCode(promoCode, user));
    }


//    @PostMapping("/promo-codes/{promoCode}/use")
//    public ResponseEntity<?> usePromoCode(@PathVariable("promoCode") String promoCode) {
////        pointsShopService.usePromoCode(promoCode);
//        return ResponseEntity.ok().build();
//    }
}
