package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private Long totalStudents;
    private Long pendingVerification;
    private Long verified;
    private Long correctionRequested;
    private Long totalDepartments;
    private Long totalSeatsAvailable;
    private Long allottedStudents;
    private Long notAllottedStudents;
    private Long acceptedOffers;
    private Long declinedOffers;
    private String registrationWindowStatus;
    private String admissionProcessStatus;
}