package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentPreferenceDTO {
    private Long id;
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private Integer preferenceOrder;
}