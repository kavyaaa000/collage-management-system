package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableGenerationResponse {
    private Integer timetableId;
    private String status;
    private String message;
    private String excelPath;
    private String pdfPath;
    private String solverStatus;
    private Double solverCost;
}
