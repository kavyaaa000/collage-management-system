package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "semester_performance_summary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemesterPerformanceSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long summaryId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "academic_session_id", nullable = false)
    private Integer academicSessionId;

    @Column(name = "total_classes_conducted")
    private Integer totalClassesConducted = 0;

    @Column(name = "total_classes_attended")
    private Integer totalClassesAttended = 0;

    @Column(name = "overall_attendance_percentage")
    private BigDecimal overallAttendancePercentage = BigDecimal.ZERO;

    @Column(name = "total_subjects")
    private Integer totalSubjects = 0;

    @Column(name = "average_marks")
    private BigDecimal averageMarks = BigDecimal.ZERO;

    @Column(name = "subjects_passed")
    private Integer subjectsPassed = 0;

    @Column(name = "subjects_failed")
    private Integer subjectsFailed = 0;

    @Column(name = "sgpa")
    private BigDecimal sgpa = BigDecimal.ZERO;

    @Column(name = "class_rank")
    private Integer classRank;

    @Column(name = "section_rank")
    private Integer sectionRank;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;
}