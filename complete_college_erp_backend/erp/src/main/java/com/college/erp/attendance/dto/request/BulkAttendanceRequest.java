package com.college.erp.attendance.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class BulkAttendanceRequest {

    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotEmpty(message = "Student attendance list cannot be empty")
    private List<StudentAttendanceData> attendanceList;

    @NotNull(message = "Marked by staff ID is required")
    private Integer markedBy;

    @Data
    public static class StudentAttendanceData {
        @NotNull
        private Integer studentId;

        @NotNull
        @Pattern(regexp = "PRESENT|ABSENT|ON_DUTY|MEDICAL_LEAVE")
        private String status;

        private String remarks;
    }
}