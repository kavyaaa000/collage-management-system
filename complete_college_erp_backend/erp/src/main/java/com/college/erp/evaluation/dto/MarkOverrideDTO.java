package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarkOverrideDTO {

    private Integer overrideId;

    @NotNull(message = "Log ID is required")
    @JsonProperty("logId")   // ✅ FIX
    private Integer logId;

    @JsonProperty("aiSuggestedMarks")
    private BigDecimal aiSuggestedMarks;

    @NotNull(message = "Staff final marks is required")
    @DecimalMin(value = "0.00", message = "Marks cannot be negative")
    @JsonProperty("staffFinalMarks")   // ✅ FIX
    private BigDecimal staffFinalMarks;

    @JsonProperty("adjustmentDelta")
    private BigDecimal adjustmentDelta;

    @JsonProperty("adjustmentPercent")
    private BigDecimal adjustmentPercent;

    @JsonProperty("staffRemarks")
    private String staffRemarks;

    @NotNull(message = "Reviewed by (staff ID) is required")
    @JsonProperty("reviewedBy")   // ✅ FIX
    private Integer reviewedBy;

    @JsonProperty("isLocked")
    private Boolean isLocked;
}
