package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectOfferingDTO {
    private Integer offeringId;
    private Integer subjectId;
    private String subjectCode;
    private String subjectName;
    private String subjectType;
    private Integer semesterId;
    private Integer sectionId;
    private Integer credits;
    private String className;
    private Boolean isMapped;
    private List<StaffMappingDTO> staffMappings;
}
