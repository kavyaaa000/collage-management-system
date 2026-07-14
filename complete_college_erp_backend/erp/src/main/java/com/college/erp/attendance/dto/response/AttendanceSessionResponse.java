package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceSessionResponse {
    private Long sessionId;
    private Integer timetableId;
    private LocalDate attendanceDate;
    private Integer semesterId;
    private String semesterName;
    private Integer sectionId;
    private String sectionName;
    private Integer subjectId;
    private String subjectCode;
    private String subjectName;
    private Integer staffId;
    private String staffName;
    private Integer periodNumber;
    private String status;
    private Integer totalStudents;
    private Integer presentCount;
    private Integer absentCount;
    private Double attendancePercentage;
    private LocalDateTime createdAt;
    private LocalDateTime submittedAt;
}