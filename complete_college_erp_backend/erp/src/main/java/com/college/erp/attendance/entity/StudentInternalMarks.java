package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_internal_marks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentInternalMarks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mark_id")
    private Integer markId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "test_number", nullable = false)
    private Integer testNumber;

    @Column(name = "max_marks")
    private Integer maxMarks = 100;

    @Column(name = "marks_obtained", nullable = false)
    private BigDecimal marksObtained;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}