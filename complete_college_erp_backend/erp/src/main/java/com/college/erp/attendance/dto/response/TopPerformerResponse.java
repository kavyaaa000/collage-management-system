package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@Builder
public class TopPerformerResponse {
    private Long performerId;
    private Integer studentId;
    private String studentName;
    private String registerNumber;
    private Integer rankPosition;
    private BigDecimal overallPercentage;
    private BigDecimal attendancePercentage;
    private String category;
    private String subjectName;
    private Boolean canViewProfile;
}