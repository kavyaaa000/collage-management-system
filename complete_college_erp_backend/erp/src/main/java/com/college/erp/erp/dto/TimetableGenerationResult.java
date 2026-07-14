package com.college.erp.erp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimetableGenerationResult {
    private boolean success;
    private Integer timetableId;
    private Double solverCost;
    private String solverStatus;
    private String errorMessage;
}
