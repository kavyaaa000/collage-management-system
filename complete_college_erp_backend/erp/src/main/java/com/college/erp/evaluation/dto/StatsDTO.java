package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsDTO {

    @JsonProperty("exam_id")
    private Integer examId;

    @JsonProperty("subject_id")
    private Integer subjectId;

    @JsonProperty("total_sheets_uploaded")
    private Integer totalSheetsUploaded;

    @JsonProperty("total_sheets_evaluated")
    private Integer totalSheetsEvaluated;

    @JsonProperty("total_sheets_locked")
    private Integer totalSheetsLocked;

    @JsonProperty("avg_ai_confidence")
    private BigDecimal avgAiConfidence;

    @JsonProperty("avg_staff_adjustment_percent")
    private BigDecimal avgStaffAdjustmentPercent;

    @JsonProperty("high_confidence_count")
    private Integer highConfidenceCount;

    @JsonProperty("low_confidence_count")
    private Integer lowConfidenceCount;

    @JsonProperty("completion_percentage")
    private BigDecimal completionPercentage;
}