package com.college.erp.erp.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SubjectMarksDTO {

    // Subject details
    private Integer subjectId;
    private String subjectCode;
    private String subjectName;
    private String subjectType;
    private Integer credits;

    // Marks
    private BigDecimal ia1Marks;
    private BigDecimal ia2Marks;
    private BigDecimal endSemMarks;

    // Absent flags
    private Boolean ia1Absent;
    private Boolean ia2Absent;
    private Boolean endSemAbsent;

    // Calculated
    private BigDecimal totalMarks;
    private String grade;

    // Helper methods for display
    public String getIa1Display() {
        if (ia1Absent != null && ia1Absent) return "AB";
        return ia1Marks != null ? ia1Marks.toString() : "-";
    }

    public String getIa2Display() {
        if (ia2Absent != null && ia2Absent) return "AB";
        return ia2Marks != null ? ia2Marks.toString() : "-";
    }

    public String getEndSemDisplay() {
        if (endSemAbsent != null && endSemAbsent) return "AB";
        return endSemMarks != null ? endSemMarks.toString() : "-";
    }
}