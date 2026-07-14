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
public class QuestionEvaluationDTO {
    @JsonProperty("logId")   // ✅ match frontend
    private Integer logId;


    @JsonProperty("question_number")
    private Integer questionNumber;

    @JsonProperty("extracted_text")
    private String extractedText;

    @JsonProperty("ocr_confidence")
    private BigDecimal ocrConfidence;

    @JsonProperty("keywords_found")
    private List<String> keywordsFound;

    @JsonProperty("keywords_missing")
    private List<String> keywordsMissing;

    @JsonProperty("ai_suggested_marks")
    private BigDecimal aiSuggestedMarks;

    @JsonProperty("max_marks")
    private BigDecimal maxMarks;

    @JsonProperty("ai_confidence_score")
    private BigDecimal aiConfidenceScore;

    @JsonProperty("ai_explanation")
    private String aiExplanation;
}