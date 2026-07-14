package com.college.erp.erp.dto;

import com.college.erp.erp.entity.Student;
import lombok.Data;

import java.util.List;

@Data
public class StudentJourneyDTO {
    private Student student;
    private List<SemesterPerformanceDTO> semesterPerformances;
}