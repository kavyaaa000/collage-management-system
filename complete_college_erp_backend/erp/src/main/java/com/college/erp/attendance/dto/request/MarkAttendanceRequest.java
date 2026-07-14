package com.college.erp.attendance.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class MarkAttendanceRequest {

    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotNull(message = "Student ID is required")
    private Integer studentId;

    @NotNull(message = "Attendance status is required")
    @Pattern(regexp = "PRESENT|ABSENT|ON_DUTY|MEDICAL_LEAVE", message = "Invalid attendance status")
    private String status;

    private String remarks;

    @NotNull(message = "Marked by staff ID is required")
    private Integer markedBy;
}