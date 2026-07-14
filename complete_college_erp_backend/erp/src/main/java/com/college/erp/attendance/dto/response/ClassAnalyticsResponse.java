package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ClassAnalyticsResponse {
    private Integer classId;
    private String className;
    private Integer totalStudents;

    // Overall metrics
    private BigDecimal avgClassAttendance;
    private BigDecimal avgClassMarks;
    private BigDecimal minAttendance;
    private BigDecimal maxAttendance;

    // Distribution
    private Integer studentsAbove75Attendance;
    private Integer studentsBelow75Attendance;
    private Integer studentsAbove60Marks;
    private Integer studentsBelow50Marks;

    // Subject-wise breakdown
    private List<SubjectAnalytics> subjectAnalytics;

    // Attendance trends
    private List<AttendanceTrend> attendanceTrends;

    // Performance distribution
    private List<PerformanceDistribution> performanceDistribution;

    // Top performers
    private List<TopStudentSummary> topPerformers;

    @Data
    @Builder
    public static class SubjectAnalytics {
        private Integer subjectId;
        private String subjectCode;
        private String subjectName;
        private BigDecimal avgAttendance;
        private BigDecimal avgMarks;
        private Integer totalStudents;
        private Integer passingStudents;
        private Integer failingStudents;
    }

    @Data
    @Builder
    public static class AttendanceTrend {
        private String period; // Week, Month, etc.
        private BigDecimal avgAttendance;
        private Integer totalClasses;
        private Integer studentsPresent;
    }

    @Data
    @Builder
    public static class PerformanceDistribution {
        private String category; // Excellent (>75), Good (60-75), Average (50-60), Poor (<50)
        private Integer count;
        private BigDecimal percentage;
    }

    @Data
    @Builder
    public static class TopStudentSummary {
        private Integer studentId;
        private String studentName;
        private String registerNumber;
        private Integer rank;
        private BigDecimal overallPercentage;
        private BigDecimal attendancePercentage;
    }
}