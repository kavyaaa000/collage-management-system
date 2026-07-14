package com.college.erp.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_preferences",
        indexes = {
                @Index(name = "idx_student_profile", columnList = "student_profile_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_student_preference",
                        columnNames = {"student_profile_id", "preference_order"}),
                @UniqueConstraint(name = "unique_student_department",
                        columnNames = {"student_profile_id", "department_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "preference_order", nullable = false)
    private Integer preferenceOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
