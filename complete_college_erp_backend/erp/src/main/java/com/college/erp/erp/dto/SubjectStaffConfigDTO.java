package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectStaffConfigDTO {
    private Integer configId;
    private Integer offeringId;
    private Integer staffId;
    private Integer maxHoursPerWeek;
    private Integer maxPeriodsPerSubjectPerWeek;
    private Boolean isActive;
    private Integer createdBy;

    // Enriched fields
    private String subjectCode;
    private String subjectName;
    private String staffName;
    private String className;
}
