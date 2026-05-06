package com.namtienjsc.hr.dto;

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
public class AttendanceRequestCreateRequest {
    private RequestType requestType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private LocalDateTime checkTime;
    private String reason;
}
