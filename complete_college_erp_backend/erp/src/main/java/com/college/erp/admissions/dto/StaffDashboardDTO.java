package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDashboardDTO {
    private Long totalAssignedStudents;
    private Long pendingVerification;
    private Long verified;
    private Long correctionRequested;
    private List<StudentProfileDTO> assignedStudents;
}