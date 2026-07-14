package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@Builder
public class ClassInfoResponse {
    private Integer classId;
    private String className;
    private Integer departmentId;
    private Integer semesterId;
    private Integer semesterNo;
    private Integer sectionId;
    private String academicYear;
    private Integer classTeacherId;
    private String classTeacherName;
    private Integer totalStudents;

    // Statistics
    private BigDecimal averageAttendance;
    private BigDecimal averageMarks;
    private Integer studentsAbove75Attendance;
    private Integer studentsBelow75Attendance;
}