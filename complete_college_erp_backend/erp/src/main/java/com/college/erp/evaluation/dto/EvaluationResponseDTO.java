package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResponseDTO {

    @JsonProperty("sheet_id")
    private Integer sheetId;

    @JsonProperty("success")
    private Boolean success;

    @JsonProperty("evaluations")
    private List<QuestionEvaluationDTO> evaluations;

    @JsonProperty("total_marks")
    private BigDecimal totalMarks;

    @JsonProperty("max_total_marks")
    private BigDecimal maxTotalMarks;

    @JsonProperty("average_confidence")
    private BigDecimal averageConfidence;

    @JsonProperty("error_message")
    private String errorMessage;
}