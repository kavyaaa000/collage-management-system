package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableGenerationRequest {
    private Integer sessionId;
    private Integer deptId;
    private Integer generatedBy;
    private List<Integer> semesterIds; // Optional: specific semesters
}
