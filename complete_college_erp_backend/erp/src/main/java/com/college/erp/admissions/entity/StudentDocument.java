package com.college.erp.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_documents",
        indexes = {
                @Index(name = "idx_student_profile", columnList = "student_profile_id"),
                @Index(name = "idx_document_type", columnList = "document_type")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_student_document",
                        columnNames = {"student_profile_id", "document_type"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "stored_filename", nullable = false, unique = true)
    private String storedFilename;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    public enum DocumentType {
        PHOTO,
        TENTH_MARKSHEET,
        TWELFTH_MARKSHEET,
        TRANSFER_CERTIFICATE,
        COMMUNITY_CERTIFICATE,
        INCOME_CERTIFICATE
    }
}
