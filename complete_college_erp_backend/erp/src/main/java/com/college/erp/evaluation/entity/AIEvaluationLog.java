package com.college.erp.evaluation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_evaluation_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIEvaluationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sheet_id", nullable = false)
    private StudentAnswerSheet answerSheet;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "extracted_text", columnDefinition = "TEXT")
    private String extractedText;

    @Column(name = "ocr_confidence", precision = 5, scale = 2)
    private BigDecimal ocrConfidence;

    @Column(name = "keywords_found", columnDefinition = "TEXT")
    private String keywordsFound;

    @Column(name = "keywords_missing", columnDefinition = "TEXT")
    private String keywordsMissing;

    @Column(name = "ai_suggested_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal aiSuggestedMarks;

    @Column(name = "ai_confidence_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal aiConfidenceScore;

    @Column(name = "ai_explanation", columnDefinition = "TEXT")
    private String aiExplanation;

    @CreationTimestamp
    @Column(name = "processed_at", nullable = false, updatable = false)
    private LocalDateTime processedAt;

    @OneToOne(mappedBy = "evaluationLog", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private StaffMarkOverride markOverride;
}