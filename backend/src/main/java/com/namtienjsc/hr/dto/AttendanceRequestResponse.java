package com.namtienjsc.hr.dto;

import com.namtienjsc.hr.entity.AttendanceRequest;
import com.namtienjsc.hr.enums.RequestStatus;
import com.namtienjsc.hr.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequestResponse {
    private Long id;
    private Long userId;
    private String employeeCode;
    private String employeeName;
    private String department;
    private RequestType requestType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private LocalDateTime checkTime;
    private String reason;
    private RequestStatus status;
    private String managerNote;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;

    public static AttendanceRequestResponse fromEntity(AttendanceRequest request) {
        String approvedByName = null;
        if (request.getApprovedBy() != null) {
            approvedByName = request.getApprovedBy().getFullName();
        }

        return AttendanceRequestResponse.builder()
                .id(request.getId())
                .userId(request.getUser().getId())
                .employeeCode(request.getUser().getEmployeeCode())
                .employeeName(request.getUser().getFullName())
                .department(request.getUser().getDepartment())
                .requestType(request.getRequestType())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .checkTime(request.getCheckTime())
                .reason(request.getReason())
                .status(request.getStatus())
                .managerNote(request.getManagerNote())
                .approvedByName(approvedByName)
                .approvedAt(request.getApprovedAt())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
