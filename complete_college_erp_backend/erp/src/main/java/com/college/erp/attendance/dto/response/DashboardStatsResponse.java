package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private StaffStats staffStats;
    private StudentStats studentStats;
    private List<TodaySchedule> todaySchedule;
    private List<AtRiskStudent> atRiskStudents;

    @Data
    @Builder
    public static class StaffStats {
        private Integer totalClasses;
        private Integer completedClasses;
        private Integer pendingClasses;
        private BigDecimal averageAttendance;
    }

    @Data
    @Builder
    public static class StudentStats {
        private BigDecimal overallAttendance;
        private BigDecimal averageMarks;
        private Integer totalSubjects;
        private Integer subjectsAtRisk;
        private String performanceCategory;
    }

    @Data
    @Builder
    public static class TodaySchedule {
        private Integer periodNumber;
        private String subjectName;
        private String staffName;
        private String roomNumber;
        private String status;
        private Long sessionId;
    }

    @Data
    @Builder
    public static class AtRiskStudent {
        private Integer studentId;
        private String studentName;
        private String registerNumber;
        private BigDecimal attendance;
        private BigDecimal averageMarks;
        private String riskLevel;
    }
}