package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "studentsemesterattendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSemesterAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer attendanceId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "total_working_days", nullable = false)
    private Integer totalWorkingDays;

    @Column(name = "days_present", nullable = false)
    private Integer daysPresent;

    @Column(name = "attendance_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal attendancePercentage;

    @Column(name = "attendance_status", nullable = false, length = 20)
    private String attendanceStatus;

    @Column(name = "calculated_on", nullable = false)
    private LocalDate calculatedOn;
}