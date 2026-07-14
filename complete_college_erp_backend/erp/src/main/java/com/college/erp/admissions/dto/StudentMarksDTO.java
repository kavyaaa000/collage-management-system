package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentMarksDTO {
    private Long id;
    private Long studentProfileId;
    private BigDecimal physicsMarks;
    private BigDecimal chemistryMarks;
    private BigDecimal mathsMarks;
    private BigDecimal computerScienceMarks;
}