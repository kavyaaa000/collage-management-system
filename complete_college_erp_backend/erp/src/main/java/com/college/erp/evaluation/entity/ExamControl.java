package com.college.erp.evaluation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_control")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamControl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_id")
    private Integer controlId;

    @Column(name = "exam_id", nullable = false)
    private Integer examId;

    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "marks_entry_enabled", nullable = false)
    private Boolean marksEntryEnabled = true;

    @Column(name = "ai_evaluation_enabled", nullable = false)
    private Boolean aiEvaluationEnabled = true;

    @Column(name = "entry_deadline")
    private LocalDateTime entryDeadline;

    @Column(name = "enabled_by")
    private Integer enabledBy;

    @Column(name = "enabled_at")
    private LocalDateTime enabledAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}