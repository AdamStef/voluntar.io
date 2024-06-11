package unit;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintRequestDTO;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintResponseDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.complaint.Complaint;
import pl.sumatywny.voluntario.model.complaint.Status;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.ComplaintRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.impl.ComplaintService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class ComplaintServiceTest {


    @Mock
    private UserRepository userRepository;

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private ComplaintService complaintService;

    @Captor
    private ArgumentCaptor<Complaint> complaintCaptor;

    private ComplaintRequestDTO complaintRequestDTO;
    private final User reporter = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);
    private final User reported = new User(2L, "vol@test.com", "password", new UserRole(Role.ROLE_VOLUNTEER),
            "Marian", "Kowalczyk", "789456123", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final Complaint complaint = new Complaint(1L, reporter, "skarga", reported, LocalDateTime.now().minusDays(2), null, null, Status.TO_REVIEW, null, null, 1);
    private final Complaint complaint2 = new Complaint(2L, reporter, "skarga2", reported, LocalDateTime.now(), null, null, Status.TO_REVIEW, null, null, 1);


    @Test
    public void createComplaint() {
        ComplaintRequestDTO complaintRequestDTO = new ComplaintRequestDTO(2L,"skarga");
        when(userRepository.findById(complaintRequestDTO.getReportedID())).thenReturn(Optional.of(reported));

        ComplaintResponseDTO result = complaintService.createComplaint(complaintRequestDTO, reporter);

        verify(userRepository, times(1)).findById(complaintRequestDTO.getReportedID());
        verify(complaintRepository, times(1)).save(complaintCaptor.capture());

        Complaint savedComplaint = complaintCaptor.getValue();
        assertEquals(reporter, savedComplaint.getReporter());
        assertEquals(reported, savedComplaint.getReported());
        assertEquals(complaintRequestDTO.getText(), savedComplaint.getTextComplaint());
        assertEquals(Status.TO_REVIEW, savedComplaint.getStatus());
        assertEquals(result.getId(), savedComplaint.getId());
        assertEquals(result.getTextComplaint(), savedComplaint.getTextComplaint());
        assertEquals(result.getReportDate(), savedComplaint.getReportDate());
        assertEquals(result.getClaimDate(), savedComplaint.getClaimDate());
        assertEquals(result.getResolveDate(), savedComplaint.getResolveDate());
        assertEquals(result.getStatus(), savedComplaint.getStatus());
        assertEquals(result.getResponse(), savedComplaint.getResponse());
        assertEquals(LocalDateTime.now().getYear(), savedComplaint.getReportDate().getYear());
        assertEquals(LocalDateTime.now().getMonth(), savedComplaint.getReportDate().getMonth());
        assertEquals(LocalDateTime.now().getDayOfMonth(), savedComplaint.getReportDate().getDayOfMonth());
    }

    @Test
    public void claimComplaint() {
        when(complaintRepository.findById(complaint.getId())).thenReturn(Optional.of(complaint));

        String result = complaintService.claimComplaint(complaint.getId(), 1L);

        verify(complaintRepository, times(1)).findById(complaint.getId());
        verify(complaintRepository, times(1)).save(complaintCaptor.capture());

        Complaint savedComplaint = complaintCaptor.getValue();
        assertEquals(Status.UNDER_REVIEW, savedComplaint.getStatus());
        assertTrue(savedComplaint.getAdminID()==1);
        assertEquals(LocalDateTime.now().getYear(), savedComplaint.getClaimDate().getYear());
        assertEquals(LocalDateTime.now().getMonth(), savedComplaint.getClaimDate().getMonth());
        assertEquals(LocalDateTime.now().getDayOfMonth(), savedComplaint.getClaimDate().getDayOfMonth());
        assertEquals("Complaint claimed", result);
    }

    @Test
    public void testClaimComplaintNotFound() {
        when(complaintRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> complaintService.claimComplaint(2L, 1L));

        verify(complaintRepository, times(1)).findById(2L);
        verify(complaintRepository, times(0)).save(any(Complaint.class));
    }

    @Test
    public void testResolveComplaint() throws IllegalAccessException {
        when(complaintRepository.findById(complaint.getId())).thenReturn(Optional.of(complaint));

        ComplaintResponseDTO complaintResponseDTO = new ComplaintResponseDTO(complaint);
        complaint.setAdminID(1L);
        complaint.setStatus(Status.UNDER_REVIEW);
        String result = complaintService.resolveComplaint(complaint.getId(), complaintResponseDTO, reporter);

        verify(complaintRepository, times(1)).findById(complaint.getId());
        verify(complaintRepository, times(1)).save(complaintCaptor.capture());

        Complaint savedComplaint = complaintCaptor.getValue();
        assertEquals(Status.RESOLVED, savedComplaint.getStatus());
        assertEquals(reporter.getId(), savedComplaint.getAdminID());
        assertEquals(complaintResponseDTO.getResponse(), savedComplaint.getResponse());
        assertEquals(LocalDateTime.now().getYear(), savedComplaint.getResolveDate().getYear());
        assertEquals(LocalDateTime.now().getMonth(), savedComplaint.getResolveDate().getMonth());
        assertEquals(LocalDateTime.now().getDayOfMonth(), savedComplaint.getResolveDate().getDayOfMonth());
        assertEquals("Complaint resolved", result);
    }

    @Test
    public void testResolveComplaint_ComplaintNotFound() {
        when(complaintRepository.findById(complaint.getId())).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> complaintService.resolveComplaint(complaint.getId(), new ComplaintResponseDTO(complaint), reporter));

        verify(complaintRepository, times(1)).findById(complaint.getId());
        verify(complaintRepository, times(0)).save(any(Complaint.class));
    }

    @Test
    public void getAllComplaints() {
        when(complaintRepository.findAll()).thenReturn(List.of(complaint, complaint2));
        var result = complaintService.getAllComplaints();
        assertEquals(2, result.size());
        assertEquals(result.get(0).getId(), complaint.getId());
        assertEquals(result.get(0).getTextComplaint(), complaint.getTextComplaint());
        assertEquals(result.get(0).getReportDate(), complaint.getReportDate());
        assertEquals(result.get(0).getClaimDate(), complaint.getClaimDate());
        assertEquals(result.get(0).getResolveDate(), complaint.getResolveDate());
        assertEquals(result.get(0).getStatus(), complaint.getStatus());
        assertEquals(result.get(0).getResponse(), complaint.getResponse());
        verify(complaintRepository, times(1)).findAll();
    }

    @Test
    public void getComplaint() {
        when(complaintRepository.findById(1L)).thenReturn(Optional.of(complaint));
        when(complaintRepository.findById(3L)).thenReturn(Optional.empty());
        var noSuchElementException = assertThrows(NoSuchElementException.class, ()-> complaintService.getComplaint(3L));
        assertEquals("Complaint not found",noSuchElementException.getMessage());
        var result = complaintService.getComplaint(1L);
        assertEquals(result.getId(), complaint.getId());
        assertEquals(result.getTextComplaint(), complaint.getTextComplaint());
        assertEquals(result.getReportDate(), complaint.getReportDate());
        assertEquals(result.getClaimDate(), complaint.getClaimDate());
        assertEquals(result.getResolveDate(), complaint.getResolveDate());
        assertEquals(result.getStatus(), complaint.getStatus());
        assertEquals(result.getResponse(), complaint.getResponse());
        verify(complaintRepository, times(2)).findById(any());
    }

    @Test
    public void getComplaintsByStatus() {
        complaint.setStatus(Status.TO_REVIEW);
        complaint2.setStatus(Status.TO_REVIEW);
        when(complaintRepository.getComplaintByStatus(Status.TO_REVIEW)).thenReturn(List.of(complaint, complaint2));
        var result = complaintService.getComplaintsByStatus(Status.TO_REVIEW);
        assertEquals(2, result.size());
        complaint.setStatus(Status.UNDER_REVIEW);
        when(complaintRepository.getComplaintByStatus(Status.UNDER_REVIEW)).thenReturn(List.of(complaint));
        result = complaintService.getComplaintsByStatus(Status.UNDER_REVIEW);
        assertEquals(1, result.size());
        assertEquals(result.get(0).getId(), complaint.getId());
        assertEquals(result.get(0).getTextComplaint(), complaint.getTextComplaint());
        assertEquals(result.get(0).getReportDate(), complaint.getReportDate());
        assertEquals(result.get(0).getClaimDate(), complaint.getClaimDate());
        assertEquals(result.get(0).getResolveDate(), complaint.getResolveDate());
        assertEquals(result.get(0).getStatus(), complaint.getStatus());
        assertEquals(result.get(0).getResponse(), complaint.getResponse());

        complaint2.setStatus(Status.RESOLVED);
        when(complaintRepository.getComplaintByStatus(Status.RESOLVED)).thenReturn(List.of(complaint2));
        result = complaintService.getComplaintsByStatus(Status.RESOLVED);
        assertEquals(1, result.size());
        assertEquals(result.get(0).getId(), complaint2.getId());
        assertEquals(result.get(0).getTextComplaint(), complaint2.getTextComplaint());
        assertEquals(result.get(0).getReportDate(), complaint2.getReportDate());
        assertEquals(result.get(0).getClaimDate(), complaint2.getClaimDate());
        assertEquals(result.get(0).getResolveDate(), complaint2.getResolveDate());
        assertEquals(result.get(0).getStatus(), complaint2.getStatus());
        assertEquals(result.get(0).getResponse(), complaint2.getResponse());
    }

    @Test
    public void allReporterComplaints() {
        when(complaintRepository.getComplaintByReporter(reporter)).thenReturn(List.of(complaint, complaint2));
        when(complaintRepository.getComplaintByReported(reported)).thenReturn(List.of(complaint, complaint2));
        var result = complaintService.allComplaintsByUser(reporter);
        assertEquals(2, result.size());
        result = complaintService.allComplaintsOnUser(reported);
        assertEquals(2, result.size());

    }



}
