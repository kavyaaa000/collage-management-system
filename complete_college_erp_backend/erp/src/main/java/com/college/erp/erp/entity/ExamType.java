package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "ExamType")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_type_id")
    private Integer examTypeId;

    @Column(name = "exam_type_name", nullable = false, unique = true, length = 50)
    private String examTypeName;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(name = "weightage", nullable = false, precision = 5, scale = 2)
    private BigDecimal weightage;
}