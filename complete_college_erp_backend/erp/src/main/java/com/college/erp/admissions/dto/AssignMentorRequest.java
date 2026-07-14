package com.college.erp.admissions.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignMentorRequest {
    @NotNull(message = "Student profile ID is required")
    private Long studentProfileId;

    @NotNull(message = "Mentor ID is required")
    private Long mentorId;
}