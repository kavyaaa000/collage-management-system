package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class StudentAttendanceResponse {
    private Integer studentId;
    private String registerNumber;
    private String studentName;
    private Integer semesterId;
    private String semesterName;
    private List<SubjectAttendance> subjectWiseAttendance;
    private Integer totalClassesConducted;
    private Integer totalClassesAttended;
    private BigDecimal overallAttendancePercentage;
    private String eligibilityStatus;

    @Data
    @Builder
    public static class SubjectAttendance {
        private Integer subjectId;
        private String subjectCode;
        private String subjectName;
        private Integer totalClasses;
        private Integer attendedClasses;
        private BigDecimal attendancePercentage;
        private String eligibilityStatus;
        private Integer classesNeededFor75;
    }
}