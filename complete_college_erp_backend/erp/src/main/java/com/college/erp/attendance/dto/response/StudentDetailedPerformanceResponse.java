package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StudentDetailedPerformanceResponse {
    private Integer studentId;
    private String registerNumber;
    private String studentName;
    private String email;
    private Integer semesterNo;

    // Attendance Details
    private BigDecimal overallAttendance;
    private String attendanceTrend;
    private List<SubjectAttendanceDetail> subjectWiseAttendance;

    // Performance Details
    private BigDecimal overallAverageMarks;
    private String performanceTrend;
    private List<SubjectPerformanceDetail> subjectWisePerformance;

    // Risk Analysis
    private String riskLevel;
    private Integer atRiskSubjects;
    private List<String> recommendations;
    private Boolean actionRequired;

    // Predictions
    private BigDecimal predictedFinalAttendance;
    private BigDecimal predictedFinalMarks;

    // Comparison with class
    private ClassComparisonData classComparison;

    // Alerts
    private List<AlertInfo> activeAlerts;

    @Data
    @Builder
    public static class SubjectAttendanceDetail {
        private String subjectCode;
        private String subjectName;
        private Integer totalClasses;
        private Integer attendedClasses;
        private BigDecimal percentage;
        private String eligibilityStatus;
        private Integer classesNeededFor75;
    }

    @Data
    @Builder
    public static class SubjectPerformanceDetail {
        private String subjectCode;
        private String subjectName;
        private BigDecimal internal1;
        private BigDecimal internal2;
        private BigDecimal internal3;
        private BigDecimal average;
        private String trend;
    }

    @Data
    @Builder
    public static class ClassComparisonData {
        private BigDecimal classAvgAttendance;
        private BigDecimal classAvgMarks;
        private Integer studentRank;
        private Integer totalStudents;
        private String performanceCategory; // TOP_10, ABOVE_AVERAGE, AVERAGE, BELOW_AVERAGE, BOTTOM_10
    }

    @Data
    @Builder
    public static class AlertInfo {
        private String alertType;
        private String severity;
        private String message;
        private LocalDateTime createdAt;
    }
}