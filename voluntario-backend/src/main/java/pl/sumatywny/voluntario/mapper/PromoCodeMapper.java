package pl.sumatywny.voluntario.mapper;


import org.apache.commons.lang3.RandomStringUtils;
import pl.sumatywny.voluntario.dtos.pointsShop.PromoCodeDTO;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCodePercentage;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCodeValue;

public class PromoCodeMapper {
    public static PromoCode toPromoCode(PromoCodeDTO promoCodeDTO) {
        PromoCode promoCode;
        if (promoCodeDTO.getPromoCodeType().equals("percentage")) {
            promoCode = new PromoCodePercentage(promoCodeDTO.getDiscount());
        } else if (promoCodeDTO.getPromoCodeType().equals("value")) {
            promoCode = new PromoCodeValue(promoCodeDTO.getDiscount());
        } else {
            throw new RuntimeException("Invalid promo code type");
        }
        promoCode.setCode(RandomStringUtils.randomAlphabetic(10));
        promoCode.setExpirationDate(promoCodeDTO.getExpirationDate());
//        promoCode.setIsUsed(false);
        return promoCode;
    }
}
