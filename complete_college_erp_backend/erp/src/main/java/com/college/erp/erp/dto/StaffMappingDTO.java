package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffMappingDTO {
    private Integer configId;  // ← ADD THIS FIELD
    private Integer staffId;
    private String staffName;
    private String employeeId;
    private Integer maxHoursPerWeek;
    private Integer currentLoad;
}