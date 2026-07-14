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
public class TimetableViewDTO {
    private Integer timetableId;
    private String status;
    private String generationDate;
    private String generatedByName;
    private String solverStatus;
    private Double solverCost;
    private List<ClassTimetableDTO> classTimetables;
}
