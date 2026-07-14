package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
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
public class AnswerKeyDTO {

    @JsonProperty("key_id")
    private Integer keyId;

    @NotNull(message = "Exam ID is required")
    @JsonProperty("exam_id")
    private Integer examId;

    @NotNull(message = "Subject ID is required")
    @JsonProperty("subject_id")
    private Integer subjectId;

    @NotNull(message = "Question number is required")
    @Min(value = 1, message = "Question number must be at least 1")
    @JsonProperty("question_number")
    private Integer questionNumber;

    @JsonProperty("question_text")
    private String questionText;

    @NotNull(message = "Max marks is required")
    @DecimalMin(value = "0.01", message = "Max marks must be greater than 0")
    @DecimalMax(value = "100.00", message = "Max marks cannot exceed 100")
    @JsonProperty("max_marks")
    private BigDecimal maxMarks;

    @JsonProperty("marking_scheme")
    private String markingScheme;

    @NotNull(message = "Created by (staff ID) is required")
    @JsonProperty("created_by")
    private Integer createdBy;

    @NotEmpty(message = "At least one keyword is required")
    @Valid
    @JsonProperty("keywords")
    private List<KeywordDTO> keywords;
}