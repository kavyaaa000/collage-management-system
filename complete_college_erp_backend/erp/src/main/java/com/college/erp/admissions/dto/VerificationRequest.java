package com.college.erp.admissions.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationRequest {
    @NotBlank(message = "Action is required")
    private String action; // VERIFY or REQUEST_CORRECTION

    private String remarks;
}