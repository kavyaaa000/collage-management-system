package com.college.erp.admissions.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMarksRequest {
    @NotNull(message = "Physics marks is required")
    @DecimalMin(value = "0.0", message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Marks must be between 0 and 100")
    private BigDecimal physicsMarks;

    @NotNull(message = "Chemistry marks is required")
    @DecimalMin(value = "0.0", message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Marks must be between 0 and 100")
    private BigDecimal chemistryMarks;

    @DecimalMin(value = "0.0", message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Marks must be between 0 and 100")
    private BigDecimal mathsMarks;

    @DecimalMin(value = "0.0", message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Marks must be between 0 and 100")
    private BigDecimal computerScienceMarks;
}