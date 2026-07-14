package com.college.erp.erp.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SemesterPerformanceDTO {
    private Integer semesterNo;
    private Integer sessionId;
    private String resultStatus;
    private LocalDate promotedOn;
    private BigDecimal attendancePercentage;
    private String attendanceStatus;
}