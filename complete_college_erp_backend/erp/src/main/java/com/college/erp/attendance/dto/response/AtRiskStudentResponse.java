package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AtRiskStudentResponse {
    private Integer studentId;
    private String registerNumber;
    private String studentName;
    private Integer semesterNo;
    private BigDecimal avgAttendance;
    private BigDecimal minSubjectAttendance;
    private Integer subjectsAtRiskAttendance;
    private BigDecimal avgMarks;
    private Integer failingSubjects;
    private String riskLevel;
    private List<String> recommendations;
}