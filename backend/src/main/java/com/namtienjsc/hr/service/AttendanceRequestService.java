package com.namtienjsc.hr.service;

import com.namtienjsc.hr.dto.ApprovalRequest;
import com.namtienjsc.hr.dto.AttendanceRequestCreateRequest;
import com.namtienjsc.hr.dto.AttendanceRequestResponse;
import com.namtienjsc.hr.entity.AttendanceRequest;
import com.namtienjsc.hr.entity.User;
import com.namtienjsc.hr.enums.RequestStatus;
import com.namtienjsc.hr.enums.Role;
import com.namtienjsc.hr.repository.AttendanceRequestRepository;
import com.namtienjsc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceRequestService {

    private final AttendanceRequestRepository attendanceRequestRepository;
    private final UserRepository userRepository;

    public AttendanceRequestResponse createRequest(AttendanceRequestCreateRequest request) {
        // Get current user from JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        // Validate dates
        if (request.getFromDate() == null || request.getToDate() == null) {
            throw new RuntimeException("Ngày bắt đầu và ngày kết thúc không được để trống");
        }

        if (request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("Ngày kết thúc không được trước ngày bắt đầu");
        }

        // Validate reason
        if (request.getReason() == null || request.getReason().isBlank()) {
            throw new RuntimeException("Lý do không được để trống");
        }

        // Create attendance request
        AttendanceRequest attendanceRequest = AttendanceRequest.builder()
                .user(user)
                .requestType(request.getRequestType())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .checkTime(request.getCheckTime())
                .reason(request.getReason())
                .status(RequestStatus.PENDING)
                .build();

        AttendanceRequest savedRequest = attendanceRequestRepository.save(attendanceRequest);
        return AttendanceRequestResponse.fromEntity(savedRequest);
    }

    public List<AttendanceRequestResponse> getMyRequests(Long userId) {
        // Get current user from JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        // Get requests
        List<AttendanceRequest> requests = attendanceRequestRepository.findByUserOrderByCreatedAtDesc(user);
        return requests.stream()
                .map(AttendanceRequestResponse::fromEntity)
                .toList();
    }

    public List<AttendanceRequestResponse> getPendingRequests() {
        List<AttendanceRequest> requests = attendanceRequestRepository
                .findByStatusOrderByCreatedAtDesc(RequestStatus.PENDING);
        return requests.stream()
                .map(AttendanceRequestResponse::fromEntity)
                .toList();
    }

    public AttendanceRequestResponse approveRequest(Long requestId, ApprovalRequest approvalRequest) {
        // Find attendance request
        AttendanceRequest attendanceRequest = attendanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn"));

        // Find manager
        User manager = userRepository.findById(approvalRequest.getManagerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người duyệt"));

        // Check manager role
        if (!manager.getRole().equals(Role.MANAGER)) {
            throw new RuntimeException("Chỉ quản lý mới có quyền duyệt đơn");
        }

        // Check request status
        if (!attendanceRequest.getStatus().equals(RequestStatus.PENDING)) {
            throw new RuntimeException("Chỉ có thể duyệt đơn đang chờ duyệt");
        }

        // Update request
        attendanceRequest.setStatus(RequestStatus.APPROVED);
        attendanceRequest.setApprovedBy(manager);
        attendanceRequest.setApprovedAt(LocalDateTime.now());
        attendanceRequest.setManagerNote(approvalRequest.getManagerNote());

        AttendanceRequest savedRequest = attendanceRequestRepository.save(attendanceRequest);
        return AttendanceRequestResponse.fromEntity(savedRequest);
    }

    public AttendanceRequestResponse rejectRequest(Long requestId, ApprovalRequest approvalRequest) {
        // Find attendance request
        AttendanceRequest attendanceRequest = attendanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn"));

        // Find manager
        User manager = userRepository.findById(approvalRequest.getManagerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người duyệt"));

        // Check manager role
        if (!manager.getRole().equals(Role.MANAGER)) {
            throw new RuntimeException("Chỉ quản lý mới có quyền duyệt đơn");
        }

        // Check request status
        if (!attendanceRequest.getStatus().equals(RequestStatus.PENDING)) {
            throw new RuntimeException("Chỉ có thể duyệt đơn đang chờ duyệt");
        }

        // Update request
        attendanceRequest.setStatus(RequestStatus.REJECTED);
        attendanceRequest.setApprovedBy(manager);
        attendanceRequest.setApprovedAt(LocalDateTime.now());
        attendanceRequest.setManagerNote(approvalRequest.getManagerNote());

        AttendanceRequest savedRequest = attendanceRequestRepository.save(attendanceRequest);
        return AttendanceRequestResponse.fromEntity(savedRequest);
    }
}