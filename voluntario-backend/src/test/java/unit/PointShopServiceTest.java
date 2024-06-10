package unit;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import pl.sumatywny.voluntario.dtos.pointsShop.OfferDTO;
import pl.sumatywny.voluntario.dtos.pointsShop.OfferResponseDTO;
import pl.sumatywny.voluntario.dtos.pointsShop.PromoCodeDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.pointsShop.Offer;
import pl.sumatywny.voluntario.model.pointsShop.PromoCodePossession;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCode;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCodePercentage;
import pl.sumatywny.voluntario.model.pointsShop.promoCodes.PromoCodeValue;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.*;
import pl.sumatywny.voluntario.service.impl.PointsShopService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class PointShopServiceTest {

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private PromoCodeRepository promoCodeRepository;

    @InjectMocks
    private PointsShopService pointsShopService;


    @Mock
    private ScoreRepository scoreRepository;

    @Mock
    private PromoCodePossessionRepository promoCodePossessionRepository;

    private final User user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final User user2 = new User(2L, "test2@test.com", "testpassword", new UserRole(Role.ROLE_VOLUNTEER),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);
    private final Organization organization = new Organization(1L, user, "Wolontariaty", "pomagamy", "00000000",
            "Lodz, piotrkowska", "help.org.pl", true,
            LocalDateTime.of(2024, 5, 30, 12, 0, 0),
            LocalDateTime.of(2024, 5, 31, 12, 0, 0));
    private OfferDTO offerDTO = new OfferDTO("Oferta", "opis", LocalDate.now().plusDays(1), 10);
    private PromoCodeDTO promoCodeDTO = new PromoCodeDTO("percentage", BigDecimal.valueOf(20.0), LocalDate.now().plusDays(5));

    @Test
    public void testCreateOffer_InvalidNumberOfPromoCodes() {
        when(organizationRepository.findOrganizationByUserId(1L)).thenReturn(organization);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            pointsShopService.createOffer(offerDTO, promoCodeDTO, 0, user);
        });

        assertEquals("Number of promo codes must be greater than 0", exception.getMessage());
    }

    @Test
    public void testCreateOffer_EndDateInPast() {
        offerDTO.setEndDate(LocalDate.now().minusDays(2));
        when(organizationRepository.findOrganizationByUserId(1L)).thenReturn(organization);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            pointsShopService.createOffer(offerDTO, promoCodeDTO, 5, user);
        });

        assertEquals("Error while creating offer", exception.getMessage());
        assertEquals("End date must be after start date", exception.getCause().getMessage());
    }

    @Test
    public void testCreateOffer_Success() {
        when(organizationRepository.findOrganizationByUserId(1L)).thenReturn(organization);
        when(offerRepository.save(any(Offer.class))).thenAnswer(i -> i.getArguments()[0]);

        Object[] result = pointsShopService.createOffer(offerDTO, promoCodeDTO, 5, user);

        Offer savedOffer = (Offer) result[0];
        List<PromoCode> promoCodes = (List<PromoCode>) result[1];

        assertEquals(offerDTO.getName(), savedOffer.getName());
        assertEquals(5, promoCodes.size());
        verify(offerRepository, times(1)).save(savedOffer);
        verify(promoCodeRepository, times(5)).save(any(PromoCode.class));
    }

    @Test
    public void testFindOfferById() {
        Offer offer = new Offer();
        offer.setId(1L);
        offer.setName("Special Offer");

        when(offerRepository.findFirstById(1L)).thenReturn(offer);

        Offer foundOffer = pointsShopService.findOfferById(1L);

        assertNotNull(foundOffer);
        assertTrue(1L == foundOffer.getId());
        assertEquals("Special Offer", foundOffer.getName());
        verify(offerRepository, times(1)).findFirstById(1L);
    }

    @Test
    public void testFindOfferById_NotFound() {
        when(offerRepository.findFirstById(1L)).thenReturn(null);

        Offer foundOffer = pointsShopService.findOfferById(1L);

        assertNull(foundOffer);
        verify(offerRepository, times(1)).findFirstById(1L);
    }

    @Test
    public void testFindAllOffers_Success() {
        Offer offer1 = new Offer();
        offer1.setId(1L);
        offer1.setName("Offer 1");

        Offer offer2 = new Offer();
        offer2.setId(2L);
        offer2.setName("Offer 2");

        ArrayList<Offer> offerList = new ArrayList<>();
        offerList.add(offer1);
        offerList.add(offer2);
        when(offerRepository.findAll()).thenReturn(offerList);

        List<OfferResponseDTO> result = pointsShopService.findAllOffers();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Offer 1", result.get(0).getName());
        assertEquals("Offer 2", result.get(1).getName());
        verify(offerRepository, times(1)).findAll();
    }

//    @Test
//    public void testFindAllOffers_Exception() {
//        when(offerRepository.findAll()).thenThrow(new RuntimeException("Database error"));
//
//        Exception exception = assertThrows(RuntimeException.class, () -> {
//            pointsShopService.findAllOffers();
//        });
//
//        assertEquals("Error while finding all offers", exception.getMessage());
//        verify(offerRepository, times(1)).findAll();
//    }

    @Test
    public void testFindAllActiveOffers_Success() {
        var promoCodes = new ArrayList<PromoCode>();
        PromoCodeValue promoCodeValue = new PromoCodeValue();
        promoCodeValue.setIsAssignedToUser(false);
        promoCodes.add(promoCodeValue);
        Offer offer1 = new Offer();
        offer1.setId(1L);
        offer1.setName("Offer 1");
        offer1.setIsActive(true);
        offer1.setPromoCodes(promoCodes);


        Offer offer2 = new Offer();
        offer2.setId(2L);
        offer2.setName("Offer 2");
        offer2.setIsActive(false);
        offer2.setPromoCodes(promoCodes);

        Offer offer3 = new Offer();
        offer3.setId(3L);
        offer3.setName("Offer 3");
        offer3.setIsActive(true);
        offer3.setPromoCodes(promoCodes);

        ArrayList<Offer> offerList = new ArrayList<>();
        offerList.add(offer1);
        offerList.add(offer2);
        offerList.add(offer3);

        when(offerRepository.findAll()).thenReturn(offerList);
        when(promoCodeRepository.findAllByOfferId(any())).thenReturn(promoCodes);

        List<OfferResponseDTO> result = pointsShopService.findAllActiveOffers();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(offerRepository, times(1)).findAll();
    }

//    @Test
//    public void testFindAllActiveOffers_Exception() {
//        when(offerRepository.findAll()).thenThrow(new RuntimeException("Database error"));
//
//        Exception exception = assertThrows(RuntimeException.class, () -> {
//            pointsShopService.findAllActiveOffers();
//        });
//
//        assertEquals("Error while finding all offers", exception.getMessage());
//        verify(offerRepository, times(1)).findAll();
//    }

    @Test
    public void testFindAllOffersByOrganization_Success() {
        Offer offer1 = new Offer();
        offer1.setId(1L);
        offer1.setName("Offer 1");
        offer1.setOrganization(organization);

        Offer offer2 = new Offer();
        offer2.setId(2L);
        offer2.setName("Offer 2");
        offer2.setOrganization(organization);

        List<Offer> offerList = Arrays.asList(offer1, offer2);
        when(offerRepository.findAllByOrganizationName("Organization A")).thenReturn(offerList);

        List<Offer> result = pointsShopService.findAllOffersByOrganization("Organization A");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(offer1));
        assertTrue(result.contains(offer2));
        verify(offerRepository, times(1)).findAllByOrganizationName("Organization A");
    }

    @Test
    public void testFindAllOffersByOrganization_NoOffers() {
        when(offerRepository.findAllByOrganizationName("Organization B")).thenReturn(Arrays.asList());

        List<Offer> result = pointsShopService.findAllOffersByOrganization("Organization B");

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(offerRepository, times(1)).findAllByOrganizationName("Organization B");
    }


    @Test
    public void testAssignCodeToUser_Success() {
        Long offerID = 123L;
        user.setRole(new UserRole(Role.ROLE_VOLUNTEER));

        PromoCodePercentage promoCode = new PromoCodePercentage(); // Concrete class that extends PromoCode
        promoCode.setOffer(new Offer());
        promoCode.getOffer().setPointsCost(100);

        Score score = new Score();
        score.setId(1L);
        score.setUser(user);
        score.setPurchasePoints(150);

        PromoCodePossession promoCodePossession = new PromoCodePossession();
        promoCodePossession.setPromoCode(promoCode);
        promoCodePossession.setVolunteer(user);

        // Mock behavior
        when(promoCodeRepository.findFirstAssignablePromoCodeByOfferId(offerID)).thenReturn(List.of(promoCode));
        when(scoreRepository.findAll()).thenReturn(List.of(score));
        when(promoCodePossessionRepository.save(any())).thenReturn(promoCodePossession);

        // Test
        PromoCode assignedPromoCode = pointsShopService.assignCodeToUser(offerID, user);

        // Verify behavior
        assertNotNull(assignedPromoCode);
        assertTrue(assignedPromoCode.getIsAssignedToUser());
        assertEquals(50, score.getPurchasePoints()); // Points deducted
    }

    @Test
    public void testAssignCodeToUser_NotEnoughPoints() {
        Long offerID = 123L;
        user.setRole(new UserRole(Role.ROLE_VOLUNTEER));

        PromoCodePercentage promoCode = new PromoCodePercentage();
        promoCode.setOffer(new Offer());
        promoCode.getOffer().setPointsCost(200);

        Score score = new Score();
        score.setId(1L);
        score.setUser(user);
        score.setPurchasePoints(100);

        when(promoCodeRepository.findFirstAssignablePromoCodeByOfferId(offerID)).thenReturn(List.of(promoCode));
        when(scoreRepository.findAll()).thenReturn(List.of(score));

        assertThrows(RuntimeException.class, () -> pointsShopService.assignCodeToUser(offerID, user));
        verify(promoCodePossessionRepository, never()).save(any());
    }

    @Test
    public void testFindAllUsersPromoCodes() {
        Long volunteerId = 1L;

        PromoCode promoCode1 = new PromoCodeValue(BigDecimal.valueOf(100));
        PromoCode promoCode2 = new PromoCodeValue(BigDecimal.valueOf(20));
        PromoCode promoCode3 = new PromoCodeValue(BigDecimal.valueOf(30));
        promoCode1.setExpirationDate(LocalDate.now().plusDays(2));
        promoCode2.setExpirationDate(LocalDate.now().plusDays(2));
        promoCode3.setExpirationDate(LocalDate.now().plusDays(2));
        promoCode1.setIsNotExpired(true);
        promoCode2.setIsNotExpired(true);
        promoCode3.setIsNotExpired(true);
        List<PromoCodePossession> promoCodePossessionList = new ArrayList<>();
        promoCodePossessionList.add(new PromoCodePossession(1L, promoCode1, user));
        promoCodePossessionList.add(new PromoCodePossession(2L, promoCode2, user));
        promoCodePossessionList.add(new PromoCodePossession(3L, promoCode3, user));

        when(promoCodePossessionRepository.findAllByVolunteerId(volunteerId)).thenReturn(promoCodePossessionList);

        List<PromoCode> result = pointsShopService.findAllUsersPromoCodes(volunteerId, true);
        assertEquals(3, result.size());
        assertTrue(result.contains(promoCode1));
        assertTrue(result.contains(promoCode3));

        result = pointsShopService.findAllUsersPromoCodes(volunteerId, false);
        assertEquals(3, result.size());
        assertTrue(result.contains(promoCode1));
        assertTrue(result.contains(promoCode2));
        assertTrue(result.contains(promoCode3));

        verify(promoCodePossessionRepository, times(2)).findAllByVolunteerId(volunteerId);
    }

    @Test
    public void testFindPromoCodeByCode_ValidCodeAndUserID_ReturnsPromoCode() {
        String code = "ABC123";
        PromoCode promoCode = new PromoCodeValue(BigDecimal.valueOf(10));
        promoCode.setCode(code);
        PromoCodePossession promoCodePossession = new PromoCodePossession(1L, promoCode, user);
        promoCodePossession.setVolunteer(user);
        promoCodePossession.setPromoCode(promoCode);

        when(promoCodePossessionRepository.findByPromoCodeCode(code)).thenReturn(Optional.of(promoCodePossession));

        PromoCode result = pointsShopService.findPromoCodeByCode(user.getId(), code);

        assertNotNull(result);
        assertEquals(code, result.getCode());
    }

    @Test
    public void testFindPromoCodeByCode_InvalidCode_ThrowsException() {
        Long userID = 123L;
        String code = "InvalidCode";

//        when(promoCodePossessionRepository.findFirstByPromoCodeCode(code)).thenReturn(null);

        assertThrows(RuntimeException.class, () -> pointsShopService.findPromoCodeByCode(userID, code));
    }

    @Test
    public void testFindPromoCodeByCode_MismatchedUserID_ThrowsException() {
        // Mock data
        Long userID = 123L;
        String code = "ABC123";
        PromoCodePossession promoCodePossession = new PromoCodePossession();
        promoCodePossession.setVolunteer(user); // Different user ID

//        when(promoCodePossessionRepository.findFirstByPromoCodeCode(code)).thenReturn(promoCodePossession);

        assertThrows(RuntimeException.class, () -> pointsShopService.findPromoCodeByCode(userID, code));
    }

    @Test
    public void testCheckPromoCode_Success() {
        // Mock data
        User user = new User();
        user.setId(1L);
        Organization organization = new Organization();
        organization.setId(1L);
        PromoCode promoCode = new PromoCodeValue(BigDecimal.valueOf(10));
        promoCode.setOffer(new Offer());
        promoCode.getOffer().setOrganization(organization);
        promoCode.setIsAssignedToUser(true);
        promoCode.setIsNotExpired(true);
        promoCode.setCanBeUsed(true);
        PromoCodePossession promoCodePossession = new PromoCodePossession();
        promoCodePossession.setPromoCode(promoCode);

        // Mock repository methods
        when(organizationRepository.findOrganizationByUserId(1L)).thenReturn(organization);
        when(promoCodePossessionRepository.findFirstByPromoCodeCode(anyString())).thenReturn(promoCodePossession);

        // Test
        PromoCodePossession result = pointsShopService.checkPromoCode("promo", user);

        // Verify
        assertNotNull(result);
        assertEquals(promoCodePossession, result);
    }

    @Test
    public void testRedeemPromoCode_Success() {
        PromoCode promoCode = new PromoCodeValue(BigDecimal.valueOf(10));
        promoCode.setOffer(new Offer(1L, "Oferta", "opis", organization, LocalDate.now().plusDays(1),10, new ArrayList<>(), true));
        promoCode.getOffer().setOrganization(organization);
        promoCode.setIsAssignedToUser(true);
        promoCode.setIsNotExpired(true);
        promoCode.setCanBeUsed(true);
        promoCode.setCode("123ABC");
        PromoCodePossession promoCodePossession = new PromoCodePossession();
        promoCodePossession.setPromoCode(promoCode);
        promoCodePossession.setId(1L);
        promoCodePossession.setVolunteer(user);

        when(promoCodePossessionRepository.findFirstByPromoCodeCode(anyString())).thenReturn(promoCodePossession);
        when(promoCodeRepository.save(any())).thenReturn(promoCode);
        when(organizationRepository.findOrganizationByUserId(1L)).thenReturn(organization);

        PromoCodePossession result = pointsShopService.redeemPromoCode("123ABC", user);

        verify(promoCodeRepository, times(1)).save(promoCode); // Verify that save method was called once
        verify(promoCodePossessionRepository, times(1)).save(promoCodePossession); // Verify that save method was called once
    }

    @Test
    public void deleteOffer_UserNotAssignedToOrganization() {
        when(organizationRepository.findOrganizationByUserId(user.getId())).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pointsShopService.deleteOffer(1L, user);
        });

        assertEquals("User is not assigned to organization", exception.getMessage());
    }

    @Test
    public void testDeleteOffer_OfferNotFound() {
        when(organizationRepository.findOrganizationByUserId(user.getId())).thenReturn(organization);
        when(offerRepository.findFirstById(1L)).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pointsShopService.deleteOffer(1L, user);
        });

        assertEquals("Offer not found", exception.getMessage());
    }

    @Test
    public void testDeleteOffer_OfferNotBelongToOrganization() {
        Organization anotherOrganization = new Organization();
        anotherOrganization.setId(2L);

        Offer anotherOffer = new Offer();
        anotherOffer.setId(2L);
        anotherOffer.setOrganization(anotherOrganization);

        when(organizationRepository.findOrganizationByUserId(user.getId())).thenReturn(organization);
        when(offerRepository.findFirstById(2L)).thenReturn(anotherOffer);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pointsShopService.deleteOffer(2L, user);
        });

        assertEquals("Offer not found", exception.getMessage());
    }

    @Test
    public void testDeleteOffer_Success() {
        var offer = new Offer(1L, "Nazwa", "opis", organization, LocalDate.now().plusDays(1), 10, new ArrayList<>(), true);
        when(organizationRepository.findOrganizationByUserId(user.getId())).thenReturn(organization);
        when(offerRepository.findFirstById(1L)).thenReturn(offer);

        assertDoesNotThrow(() -> {
            pointsShopService.deleteOffer(1L, user);
        });

        verify(offerRepository, times(1)).delete(offer);
    }

}
