package com.college.erp.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_application_number", columnList = "application_number"),
        @Index(name = "idx_mentor", columnList = "assigned_mentor_id"),
        @Index(name = "idx_verification_status", columnList = "verification_status"),
        @Index(name = "idx_cutoff_score", columnList = "cutoff_score"),
        @Index(name = "idx_student_verification_mentor", columnList = "verification_status, assigned_mentor_id"),
        @Index(name = "idx_student_cutoff_status", columnList = "cutoff_score, verification_status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "application_number", nullable = false, unique = true, length = 50)
    private String applicationNumber;

    @Column(length = 15)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Stream stream;

    @Column(name = "cutoff_score", precision = 5, scale = 2)
    private BigDecimal cutoffScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "verification_remarks", columnDefinition = "TEXT")
    private String verificationRemarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_mentor_id")
    private User assignedMentor;

    @Column(name = "student_group_number")
    private Integer studentGroupNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status")
    private RegistrationStatus registrationStatus = RegistrationStatus.DRAFT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StudentMarks marks;

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("preferenceOrder ASC")
    private List<StudentPreference> preferences = new ArrayList<>();

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentDocument> documents = new ArrayList<>();

    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AdmissionResult admissionResult;

    public enum Stream {
        BIO_MATHS, COMPUTER_SCIENCE,NOT_SELECTED
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum VerificationStatus {
        PENDING, VERIFIED, CORRECTION_REQUESTED
    }

    public enum RegistrationStatus {
        DRAFT, PENDING, SUBMITTED
    }
}