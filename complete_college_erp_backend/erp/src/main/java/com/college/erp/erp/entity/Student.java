package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;

    @Column(name = "register_number", nullable = false, unique = true, length = 20)
    private String registerNumber;

    @Column(name = "batch_number", nullable = false, unique = true, length = 10)
    private String batchNumber;

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "dept_id", nullable = false)
    private Integer deptId;

    @Column(name = "program_id", nullable = false)
    private Integer programId;

    @Column(name = "regulation_id", nullable = false)
    private Integer regulationId;

    @Column(name = "current_semester_id")
    private Integer currentSemesterId;

    @Column(name = "section_id", nullable = false)
    private Integer sectionId;

    @Column(name = "admission_year", nullable = false)
    private Integer admissionYear;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";
}