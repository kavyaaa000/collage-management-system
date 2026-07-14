
package com.college.erp.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_marks", indexes = {
        @Index(name = "idx_student_profile", columnList = "student_profile_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentMarks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false, unique = true)
    private StudentProfile studentProfile;

    @Column(name = "physics_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal physicsMarks;

    @Column(name = "chemistry_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal chemistryMarks;

    @Column(name = "maths_marks", precision = 5, scale = 2)
    private BigDecimal mathsMarks;

    @Column(name = "computer_science_marks", precision = 5, scale = 2)
    private BigDecimal computerScienceMarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}