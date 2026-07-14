package com.college.erp.evaluation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_evaluation_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIEvaluationStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stat_id")
    private Integer statId;

    @Column(name = "exam_id", nullable = false)
    private Integer examId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "total_sheets_uploaded")
    private Integer totalSheetsUploaded = 0;

    @Column(name = "total_sheets_evaluated")
    private Integer totalSheetsEvaluated = 0;

    @Column(name = "total_sheets_locked")
    private Integer totalSheetsLocked = 0;

    @Column(name = "avg_ai_confidence", precision = 5, scale = 2)
    private BigDecimal avgAiConfidence;

    @Column(name = "avg_staff_adjustment_percent", precision = 5, scale = 2)
    private BigDecimal avgStaffAdjustmentPercent;

    @Column(name = "high_confidence_count")
    private Integer highConfidenceCount = 0;

    @Column(name = "low_confidence_count")
    private Integer lowConfidenceCount = 0;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}