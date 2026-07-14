package com.college.erp.admissions.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDepartmentRequest {
    @NotBlank(message = "Department name is required")
    private String name;

    @NotNull(message = "Total seats is required")
    @Min(value = 0, message = "Total seats must be non-negative")
    private Integer totalSeats;

    private Boolean isActive;
}