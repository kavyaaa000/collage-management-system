package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subject_comparison_analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectComparisonAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytics_id")
    private Long analyticsId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "academic_session_id", nullable = false)
    private Integer academicSessionId;

    @Column(name = "student_attendance_percentage")
    private BigDecimal studentAttendancePercentage;

    @Column(name = "student_average_marks")
    private BigDecimal studentAverageMarks;

    @Column(name = "class_avg_attendance")
    private BigDecimal classAvgAttendance;

    @Column(name = "class_avg_marks")
    private BigDecimal classAvgMarks;

    @Column(name = "class_highest_marks")
    private BigDecimal classHighestMarks;

    @Column(name = "class_lowest_marks")
    private BigDecimal classLowestMarks;

    @Column(name = "student_rank_in_subject")
    private Integer studentRankInSubject;

    @Column(name = "total_students_in_subject")
    private Integer totalStudentsInSubject;

    @Column(name = "percentile")
    private BigDecimal percentile;

    @Column(name = "above_class_average")
    private Boolean aboveClassAverage;

    @Column(name = "in_top_10_percent")
    private Boolean inTop10Percent;

    @Column(name = "needs_improvement")
    private Boolean needsImprovement;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;
}