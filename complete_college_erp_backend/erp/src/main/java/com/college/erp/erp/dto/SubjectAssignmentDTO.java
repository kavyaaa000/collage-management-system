package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectAssignmentDTO {
    private Integer subjectId;
    private String subjectCode;
    private String subjectName;
    private String className;
    private Integer hoursPerWeek;
}
