package com.college.erp.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "offer_responses",
        indexes = {
                @Index(name = "idx_admission_result", columnList = "admission_result_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_result_id", nullable = false)
    private AdmissionResult admissionResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "response_type", nullable = false)
    private ResponseType responseType;

    @CreationTimestamp
    @Column(name = "responded_at", updatable = false)
    private LocalDateTime respondedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    public enum ResponseType {
        ACCEPTED, DECLINED
    }
}