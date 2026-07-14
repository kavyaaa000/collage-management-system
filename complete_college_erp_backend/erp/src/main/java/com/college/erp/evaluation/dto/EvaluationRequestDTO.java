package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRequestDTO {

    @NotNull(message = "Sheet ID is required")
    @JsonProperty("sheet_id")
    private Integer sheetId;

    @NotNull(message = "Exam ID is required")
    @JsonProperty("exam_id")
    private Integer examId;

    @NotNull(message = "Student ID is required")
    @JsonProperty("student_id")
    private Integer studentId;

    @NotNull(message = "Subject ID is required")
    @JsonProperty("subject_id")
    private Integer subjectId;

    @NotNull(message = "PDF file path is required")
    @JsonProperty("pdf_file_path")
    private String pdfFilePath;

    @JsonProperty("answer_keys")
    private List<AnswerKeyDTO> answerKeys;
}