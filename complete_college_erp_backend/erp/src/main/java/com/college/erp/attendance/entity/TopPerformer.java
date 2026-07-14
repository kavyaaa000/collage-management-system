package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "top_performers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopPerformer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "performer_id")
    private Long performerId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "class_id", nullable = false)
    private Integer classId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "academic_session_id", nullable = false)
    private Integer academicSessionId;

    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @Column(name = "overall_percentage")
    private BigDecimal overallPercentage;

    @Column(name = "attendance_percentage")
    private BigDecimal attendancePercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "is_visible_to_students")
    private Boolean isVisibleToStudents = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Category {
        OVERALL_TOPPER, ATTENDANCE_STAR, MOST_IMPROVED, SUBJECT_TOPPER
    }
}