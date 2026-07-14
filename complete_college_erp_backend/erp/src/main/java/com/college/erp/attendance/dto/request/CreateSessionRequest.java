package com.college.erp.attendance.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class CreateSessionRequest {

    @NotNull(message = "Timetable ID is required")
    private Integer timetableId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Academic session ID is required")
    private Integer academicSessionId;

    @NotNull(message = "Created by staff ID is required")
    private Integer createdBy;
}