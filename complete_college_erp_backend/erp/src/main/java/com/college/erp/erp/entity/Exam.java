package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Exam")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id")
    private Integer examId;

    @Column(name = "exam_type_id", nullable = false)
    private Integer examTypeId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    // Optional: Add relationships for easier data access
    // Use insertable=false, updatable=false to avoid conflicts
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_type_id", insertable = false, updatable = false)
    private ExamType examType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", insertable = false, updatable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", insertable = false, updatable = false)
    private Semester semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", insertable = false, updatable = false)
    private AcademicSession session;
}