package com.namtienjsc.hr.controller;

import com.namtienjsc.hr.dto.ApprovalRequest;
import com.namtienjsc.hr.dto.AttendanceRequestCreateRequest;
import com.namtienjsc.hr.dto.AttendanceRequestResponse;
import com.namtienjsc.hr.service.AttendanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class AttendanceRequestController {

    private final AttendanceRequestService attendanceRequestService;

    @PostMapping
    public ResponseEntity<AttendanceRequestResponse> createRequest(
            @RequestBody AttendanceRequestCreateRequest request) {
        AttendanceRequestResponse response = attendanceRequestService.createRequest(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<AttendanceRequestResponse>> getMyRequests() {
        List<AttendanceRequestResponse> responses = attendanceRequestService.getMyRequests(null);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AttendanceRequestResponse>> getPendingRequests() {
        List<AttendanceRequestResponse> responses = attendanceRequestService.getPendingRequests();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<AttendanceRequestResponse> approveRequest(
            @PathVariable("id") Long id,
            @RequestBody ApprovalRequest approvalRequest) {
        AttendanceRequestResponse response = attendanceRequestService.approveRequest(id, approvalRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AttendanceRequestResponse> rejectRequest(
            @PathVariable("id") Long id,
            @RequestBody ApprovalRequest approvalRequest) {
        AttendanceRequestResponse response = attendanceRequestService.rejectRequest(id, approvalRequest);
        return ResponseEntity.ok(response);
    }
}
