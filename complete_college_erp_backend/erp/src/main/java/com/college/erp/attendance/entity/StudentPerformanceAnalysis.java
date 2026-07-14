package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_performance_analysis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPerformanceAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analysis_id")
    private Long analysisId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "academic_session_id", nullable = false)
    private Integer academicSessionId;

    @Column(name = "analysis_date", nullable = false)
    private LocalDate analysisDate;

    @Column(name = "overall_attendance_percentage")
    private BigDecimal overallAttendancePercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_trend")
    private Trend attendanceTrend = Trend.STABLE;

    @Column(name = "overall_average_marks")
    private BigDecimal overallAverageMarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "performance_trend")
    private Trend performanceTrend = Trend.STABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Column(name = "at_risk_subjects")
    private Integer atRiskSubjects = 0;

    @Column(name = "predicted_attendance_eod")
    private BigDecimal predictedAttendanceEod;

    @Column(name = "predicted_final_marks")
    private BigDecimal predictedFinalMarks;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "action_required")
    private Boolean actionRequired = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Trend {
        IMPROVING, DECLINING, STABLE
    }

    public enum RiskLevel {
        CRITICAL, HIGH, MEDIUM, LOW
    }
}