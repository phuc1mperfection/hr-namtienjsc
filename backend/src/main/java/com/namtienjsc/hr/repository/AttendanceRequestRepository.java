package com.namtienjsc.hr.repository;

import com.namtienjsc.hr.entity.AttendanceRequest;
import com.namtienjsc.hr.entity.User;
import com.namtienjsc.hr.enums.RequestStatus;
import com.namtienjsc.hr.enums.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRequestRepository extends JpaRepository<AttendanceRequest, Long> {

    List<AttendanceRequest> findByUserOrderByCreatedAtDesc(User user);

    List<AttendanceRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    long countByStatus(RequestStatus status);

    long countByRequestTypeAndStatusAndFromDateLessThanEqualAndToDateGreaterThanEqual(
            RequestType requestType,
            RequestStatus status,
            LocalDate date1,
            LocalDate date2
    );
}