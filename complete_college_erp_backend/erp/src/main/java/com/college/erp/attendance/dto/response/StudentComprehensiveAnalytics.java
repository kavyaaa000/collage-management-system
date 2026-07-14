package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class StudentComprehensiveAnalytics {
    private Integer studentId;
    private String registerNumber;
    private String studentName;
    private String email;
    private Integer classId;
    private String className;

    // Overall summary
    private BigDecimal overallAttendance;
    private BigDecimal overallAverageMarks;
    private BigDecimal currentSgpa;
    private BigDecimal cgpa;

    // Semester-wise analytics
    private List<SemesterAnalytics> semesterAnalytics;

    // Subject comparison (all subjects across semesters)
    private List<SubjectComparison> subjectComparisons;

    // Trends
    private TrendAnalysis trendAnalysis;

    // Achievements
    private List<Achievement> achievements;

    // Recommendations
    private List<String> recommendations;

    @Data
    @Builder
    public static class SemesterAnalytics {
        private Integer semesterId;
        private Integer semesterNo;
        private BigDecimal attendancePercentage;
        private BigDecimal averageMarks;
        private BigDecimal sgpa;
        private Integer classRank;
        private Integer totalStudents;
        private List<SubjectPerformance> subjects;
    }

    @Data
    @Builder
    public static class SubjectPerformance {
        private String subjectCode;
        private String subjectName;
        private BigDecimal attendance;
        private BigDecimal internal1;
        private BigDecimal internal2;
        private BigDecimal internal3;
        private BigDecimal average;
        private Integer rank;
        private String trend;
    }

    @Data
    @Builder
    public static class SubjectComparison {
        private Integer subjectId;
        private String subjectCode;
        private String subjectName;
        private Integer semesterId;

        // Student's performance
        private BigDecimal studentAttendance;
        private BigDecimal studentMarks;
        private Integer studentRank;

        // Class statistics
        private BigDecimal classAvgAttendance;
        private BigDecimal classAvgMarks;
        private BigDecimal classHighest;
        private BigDecimal classLowest;

        // Comparison
        private Boolean aboveAverage;
        private BigDecimal percentile;
        private String performanceCategory; // EXCELLENT, GOOD, AVERAGE, POOR
    }

    @Data
    @Builder
    public static class TrendAnalysis {
        private String attendanceTrend; // IMPROVING, STABLE, DECLINING
        private String performanceTrend;
        private List<SemesterTrend> semesterTrends;
    }

    @Data
    @Builder
    public static class SemesterTrend {
        private Integer semesterNo;
        private BigDecimal attendance;
        private BigDecimal marks;
        private BigDecimal sgpa;
    }

    @Data
    @Builder
    public static class Achievement {
        private String title;
        private String description;
        private String category; // TOPPER, ATTENDANCE_STAR, MOST_IMPROVED
        private Integer semesterId;
        private Integer rank;
    }
}