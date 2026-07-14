package com.college.erp.evaluation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_answer_sheet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswerSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sheet_id")
    private Integer sheetId;

    @Column(name = "exam_id", nullable = false)
    private Integer examId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "pdf_file_path", nullable = false, length = 500)
    private String pdfFilePath;

    @Column(name = "pdf_original_name", nullable = false, length = 255)
    private String pdfOriginalName;

    @Column(name = "pdf_file_size")
    private Long pdfFileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "upload_status", nullable = false, length = 30)
    private UploadStatus uploadStatus = UploadStatus.UPLOADED;

    @Column(name = "uploaded_by", nullable = false)
    private Integer uploadedBy;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "answerSheet", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AIEvaluationLog> evaluationLogs = new ArrayList<>();

    public enum UploadStatus {
        UPLOADED, PROCESSING, OCR_COMPLETED, EVALUATION_COMPLETED, LOCKED, FAILED
    }
}