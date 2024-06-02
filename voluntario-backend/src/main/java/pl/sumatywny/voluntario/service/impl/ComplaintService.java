package pl.sumatywny.voluntario.service.impl;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintRequestDTO;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintResponseDTO;
import pl.sumatywny.voluntario.model.complaint.Complaint;
import pl.sumatywny.voluntario.model.complaint.Status;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.ComplaintRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO complaintRequestDTO, User reporter) {
        User reported = userRepository.findById(complaintRequestDTO.getReportedID()).get();
        Complaint complaint = Complaint.builder()
                .reportDate(LocalDateTime.now())
                .status(Status.TO_REVIEW)
                .reporter(reporter)
                .reported(reported)
                .textComplaint(complaintRequestDTO.getText())
                .build();
        complaintRepository.save(complaint);
        return new ComplaintResponseDTO(complaint);
    }

    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    public String claimComplaint(Long complaintID, Long adminID) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintID);
        if (complaint.isEmpty()) {
            throw new NoSuchElementException("Complaint not found");
        }
        complaint.get().changeStatusUnderReview();
        complaint.get().setAdminID(adminID);
        complaint.get().setClaimDate(LocalDateTime.now());
        complaintRepository.save(complaint.get());
        return "Complaint claimed";
    }

    public String resolveComplaint(Long complaintID, ComplaintResponseDTO complaintResponseDTO, User admin) throws IllegalAccessException {
        Optional<Complaint> complaint = complaintRepository.findById(complaintID);
        if (complaint.isEmpty()) {
            throw new NoSuchElementException("Complaint not found");
        }
        complaint.get().changeStatusResolved(admin.getId());
        complaint.get().setResolveDate(LocalDateTime.now());
        complaint.get().setResponse(complaintResponseDTO.getResponse());
        complaintRepository.save(complaint.get());
        return "Complaint resolved";
    }

    public List<ComplaintResponseDTO> getComplaintsByStatus(Status status) {
        return complaintRepository.getComplaintByStatus(status).stream().map(ComplaintResponseDTO::new).collect(Collectors.toList());
    }

    public ComplaintResponseDTO getComplaint(Long complaintID) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintID);
        if (complaint.isEmpty()) {
            throw new NoSuchElementException("Complaint not found");
        }

        return new ComplaintResponseDTO(complaint.get());
    }

    public List<ComplaintResponseDTO> getAllComplaints() {
        return complaintRepository.findAll().stream().map(complaint -> {
            ComplaintResponseDTO complaintResponseDTO = new ComplaintResponseDTO(complaint);
            return complaintResponseDTO;
        }).collect(Collectors.toList());
    }

    public List<ComplaintResponseDTO> allComplaintsByUser(User reporter) {
        return complaintRepository.getComplaintByReporter(reporter).stream().map(complaint -> {
            ComplaintResponseDTO complaintResponseDTO = new ComplaintResponseDTO(complaint);
            return complaintResponseDTO;
        }).collect(Collectors.toList());
    }

    public List<ComplaintResponseDTO> allComplaintsOnUser(User reported) {
        return complaintRepository.getComplaintByReported(reported).stream().map(complaint -> {
            ComplaintResponseDTO complaintResponseDTO = new ComplaintResponseDTO(complaint);
            return complaintResponseDTO;
        }).collect(Collectors.toList());
    }
}
