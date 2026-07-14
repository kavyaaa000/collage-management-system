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
public class StaffWorkloadDTO {
    private Integer staffId;
    private String staffName;
    private String employeeId;
    private Integer assignedHours;
    private Integer maxHours;
    private Double workloadPercentage;
    private List<SubjectAssignmentDTO> subjects;
}
