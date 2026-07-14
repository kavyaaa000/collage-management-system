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
public class ClassTimetableDTO {
    private String classId;
    private String className;
    private List<List<TimetableSlotDTO>> schedule; // [day][period]
}
