package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffSubjectStudentDTO {

    @JsonProperty("student_id")
    private Integer studentId;

    @JsonProperty("register_number")
    private String registerNumber;

    @JsonProperty("student_name")
    private String studentName;

    @JsonProperty("student_class")
    private String studentClass;

    @JsonProperty("semester")
    private Integer semester;

    @JsonProperty("subject_id")
    private Integer subjectId;

    @JsonProperty("subject_code")
    private String subjectCode;

    @JsonProperty("subject_name")
    private String subjectName;

    @JsonProperty("staff_id")
    private Integer staffId;

    @JsonProperty("staff_name")
    private String staffName;

    @JsonProperty("exam_id")
    private Integer examId;

    @JsonProperty("exam_name")
    private String examName;

    @JsonProperty("sheet_id")
    private Integer sheetId;

    @JsonProperty("upload_status")
    private String uploadStatus;

    @JsonProperty("pdf_file_path")
    private String pdfFilePath;

    @JsonProperty("uploaded_at")
    private LocalDateTime uploadedAt;

    @JsonProperty("total_marks")
    private Double totalMarks;

    @JsonProperty("max_total_marks")
    private Double maxTotalMarks;

    @JsonProperty("average_confidence")
    private Double averageConfidence;

    @JsonProperty("is_locked")
    private Boolean isLocked;
}