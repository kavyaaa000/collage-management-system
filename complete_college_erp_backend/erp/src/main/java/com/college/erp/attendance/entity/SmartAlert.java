package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "smart_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alert_id")
    private Long alertId;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "trigger_value", nullable = false)
    private BigDecimal triggerValue;

    @Column(name = "threshold_value", nullable = false)
    private BigDecimal thresholdValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private Severity severity;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "is_notified")
    private Boolean isNotified = false;

    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum AlertType {
        ATTENDANCE_BELOW_75, ATTENDANCE_BELOW_65, MARKS_BELOW_50,
        CONSECUTIVE_ABSENT, PERFORMANCE_DROP
    }

    public enum Severity {
        INFO, WARNING, CRITICAL
    }
}