package com.college.erp.connect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "code_submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmission {

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
    @JoinColumn(name = "problem_id", nullable = false)
    private CodeProblem problem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String sourceCode;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private Integer languageId; // Judge0 language ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @Column
    private Integer passedTestCases;

    @Column
    private Integer totalTestCases;

    @Column
    private Integer executionTime; // milliseconds

    @Column
    private Integer memoryUsed; // kilobytes

    @Column(columnDefinition = "TEXT")
    private String compilerOutput;

    @Column(columnDefinition = "TEXT")
    private String stderr;

    @Column(nullable = false)
    @Builder.Default
    private Integer pointsEarned = 0;

    @Column
    private String judge0Token;

    @CreationTimestamp
    @Column(nullable = true)
    private LocalDateTime submittedAt;
}