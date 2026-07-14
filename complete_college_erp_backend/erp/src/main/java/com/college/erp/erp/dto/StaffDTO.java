package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDTO {
    private Integer staffId;
    private String employeeId;
    private String staffName;
    private String designation;
    private String qualification;
    private Integer maxHoursWeek;
    private Integer currentLoad;
    private Double workloadPercentage;
    private String status;
}
