package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "timetable_id", nullable = true)
    private Integer timetableId;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    @Column(name = "academic_session_id")
    private Integer academicSessionId;

    @Column(name = "semester_id")
    private Integer semesterId;

    @Column(name = "section_id")
    private Integer sectionId;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "staff_id")
    private Integer staffId;

    @Column(name = "period_number")
    private Integer periodNumber;

    @Column(name = "status")
    private String status = "OPEN";

    @Column(name = "total_students")
    private Integer totalStudents = 0;

    @Column(name = "present_count")
    private Integer presentCount = 0;

    @Column(name = "absent_count")
    private Integer absentCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "locked_by")
    private Integer lockedBy;
}