package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionResultDTO {
    private Long id;
    private Long studentProfileId;
    private String studentName;
    private String applicationNumber;
    private BigDecimal cutoffScore;
    private Long allocatedDepartmentId;
    private String allocatedDepartmentCode;
    private String allocatedDepartmentName;
    private String allocationStatus;
    private String offerStatus;
    private Boolean notificationSent;
    private LocalDateTime allocatedAt;
    private LocalDateTime offerResponseAt;
}