package com.college.erp.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_results",
        indexes = {
                @Index(name = "idx_student_profile", columnList = "student_profile_id"),
                @Index(name = "idx_allocated_department", columnList = "allocated_department_id"),
                @Index(name = "idx_allocation_status", columnList = "allocation_status"),
                @Index(name = "idx_offer_status", columnList = "offer_status"),
                @Index(name = "idx_offer_token", columnList = "offer_response_token"),
                @Index(name = "idx_admission_notification", columnList = "notification_sent, allocation_status")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false, unique = true)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocated_department_id")
    private Department allocatedDepartment;

    @Enumerated(EnumType.STRING)
    @Column(name = "allocation_status", nullable = false)
    private AllocationStatus allocationStatus;

    @Column(name = "cutoff_score_at_allocation", precision = 5, scale = 2)
    private BigDecimal cutoffScoreAtAllocation;

    @CreationTimestamp
    @Column(name = "allocated_at", updatable = false)
    private LocalDateTime allocatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_status")
    private OfferStatus offerStatus = OfferStatus.PENDING;

    @Column(name = "offer_response_token", unique = true)
    private String offerResponseToken;

    @Column(name = "offer_response_at")
    private LocalDateTime offerResponseAt;

    @Column(name = "notification_sent")
    private Boolean notificationSent = false;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;

    public enum AllocationStatus {
        ALLOTTED, NOT_ALLOTTED, WAITLISTED
    }

    public enum OfferStatus {
        PENDING, ACCEPTED, DECLINED
    }
}