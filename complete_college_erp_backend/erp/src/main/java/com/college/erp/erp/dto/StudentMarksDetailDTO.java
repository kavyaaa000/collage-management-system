package com.college.erp.erp.dto;

import com.college.erp.erp.entity.Student;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class StudentMarksDetailDTO {
    private Student student;
    private Integer semesterId;
    private Integer sessionId;
    private List<SubjectMarksDTO> subjectMarks;

    // Statistics
    private Long totalSubjects;
    private Long completedSubjects;
    private Long passedSubjects;
    private BigDecimal averageMarks;
}