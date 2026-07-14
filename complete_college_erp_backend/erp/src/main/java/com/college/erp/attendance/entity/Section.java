package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Integer sectionId;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "semester_id")
    private Integer semesterId;
}