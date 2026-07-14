package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_calculation_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceCalculationCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cache_id")
    private Long cacheId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "academic_session_id", nullable = false)
    private Integer academicSessionId;

    @Column(name = "total_classes")
    private Integer totalClasses = 0;

    @Column(name = "attended_classes")
    private Integer attendedClasses = 0;

    @Column(name = "attendance_percentage")
    private BigDecimal attendancePercentage = BigDecimal.ZERO;

    @Column(name = "eligibility_status")
    private String eligibilityStatus = "ELIGIBLE";

    @Column(name = "classes_needed_for_75")
    private Integer classesNeededFor75 = 0;

    @Column(name = "last_calculated_at")
    private LocalDateTime lastCalculatedAt;

    @Column(name = "is_valid")
    private Boolean isValid = true;
}