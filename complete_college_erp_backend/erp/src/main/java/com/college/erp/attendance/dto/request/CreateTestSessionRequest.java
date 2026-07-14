package com.college.erp.attendance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTestSessionRequest {

    @NotNull
    private Integer staffId;

    @NotNull
    private Integer subjectId;

    @NotNull
    private Integer sectionId;

    @NotNull
    private Integer semesterId;

    @NotNull
    private Integer academicSessionId;

    @NotNull
    private LocalDate attendanceDate;

    @NotNull
    private Integer periodNumber;

    private Integer totalStudents = 30;

    @NotNull
    private Integer createdBy;
}