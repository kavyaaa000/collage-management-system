package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "semester")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "semester_id")
    private Integer semesterId;

    @Column(name = "semester_no", nullable = false)
    private Integer semesterNo;

    @Column(name = "semester_type")
    private String semesterType;

    @Column(name = "academic_year")
    private String academicYear;
}