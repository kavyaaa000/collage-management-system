package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class SemesterAnalyticsResponse {
    private Integer semesterId;
    private Integer semesterNo;
    private Integer totalClassesConducted;
    private Integer totalClassesAttended;
    private BigDecimal overallAttendancePercentage;
    private Integer totalSubjects;
    private BigDecimal averageMarks;
    private Integer subjectsPassed;
    private Integer subjectsFailed;
    private BigDecimal sgpa;
    private Integer classRank;
    private Integer sectionRank;

    // Subject-wise details
    private List<SubjectDetail> subjects;

    @Data
    @Builder
    public static class SubjectDetail {
        private Integer subjectId;
        private String subjectCode;
        private String subjectName;
        private BigDecimal attendancePercentage;
        private BigDecimal averageMarks;
        private Integer rank;
        private String grade;
    }
}