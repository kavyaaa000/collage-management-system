package com.college.erp.connect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mcq_submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MCQSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private MCQQuestion question;

    @Column(nullable = false)
    private Integer selectedOptionIndex;

    @Column(nullable = false)
    private Boolean isCorrect;

    @Column(nullable = false)
    private Integer pointsEarned;

    @CreationTimestamp
    @Column
    private LocalDateTime submittedAt;
}