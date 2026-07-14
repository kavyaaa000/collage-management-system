package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;

    @Column(name = "register_number", unique = true, nullable = false)
    private String registerNumber;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dept_id", nullable = false)   // ✅ FIXED
    private Integer departmentId;

    @Column(name = "current_semester_id")
    private Integer currentSemesterId;

    @Column(name = "section_id")
    private Integer sectionId;

    @Column(name = "admission_year")
    private Integer admissionYear;

    @Column(name = "current_cgpa")
    private BigDecimal currentCgpa;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Column(name = "class_id")
    private Integer classId;

}