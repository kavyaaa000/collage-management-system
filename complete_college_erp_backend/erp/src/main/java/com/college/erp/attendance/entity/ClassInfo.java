package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "class_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "department_id", nullable = false)
    private Integer departmentId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "section_id", nullable = false)
    private Integer sectionId;

    @Column(name = "academic_year")
    private String academicYear;

    @Column(name = "class_teacher_id")
    private Integer classTeacherId;

    @Column(name = "total_students")
    private Integer totalStudents = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}