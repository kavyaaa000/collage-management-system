package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HODDashboardStatsDTO {
    private Integer totalStaff;
    private Integer totalSubjects;
    private Integer mappedSubjects;
    private Integer unmappedSubjects;
    private Integer totalClassrooms;
    private Integer assignedClassrooms;
    private Integer activeTimetables;
    private Double averageStaffLoad;
}
