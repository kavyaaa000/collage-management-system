package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerSheetUploadDTO {

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

    @JsonProperty("pdf_file_path")
    private String pdfFilePath;

    @JsonProperty("pdf_original_name")
    private String pdfOriginalName;

    @JsonProperty("pdf_file_size")
    private Long pdfFileSize;

    @NotNull(message = "Uploaded by (staff ID) is required")
    @JsonProperty("uploaded_by")
    private Integer uploadedBy;

    @JsonProperty("upload_status")
    private String uploadStatus;
}