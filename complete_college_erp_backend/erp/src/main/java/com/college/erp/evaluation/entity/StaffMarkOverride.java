package com.college.erp.evaluation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_mark_override")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffMarkOverride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "override_id")
    private Integer overrideId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "log_id", nullable = false, unique = true)
    private AIEvaluationLog evaluationLog;

    @Column(name = "ai_suggested_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal aiSuggestedMarks;

    @Column(name = "staff_final_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal staffFinalMarks;

    @Column(name = "adjustment_delta", precision = 5, scale = 2, insertable = false, updatable = false)
    private BigDecimal adjustmentDelta;

    @Column(name = "adjustment_percent", precision = 5, scale = 2, insertable = false, updatable = false)
    private BigDecimal adjustmentPercent;

    @Column(name = "staff_remarks", columnDefinition = "TEXT")
    private String staffRemarks;

    @Column(name = "reviewed_by", nullable = false)
    private Integer reviewedBy;

    @CreationTimestamp
    @Column(name = "reviewed_at", nullable = false, updatable = false)
    private LocalDateTime reviewedAt;

    @Column(name = "is_locked", nullable = false)
    private Boolean isLocked = false;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;
}