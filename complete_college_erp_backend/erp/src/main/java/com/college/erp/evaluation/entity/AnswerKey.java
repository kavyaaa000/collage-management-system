package com.college.erp.evaluation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "answer_key")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "key_id")
    private Integer keyId;
    @Column(name = "exam_id", nullable = false)
    private Integer examId;
    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;
    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    private BigDecimal maxMarks;

    @Column(columnDefinition = "TEXT")
    private String markingScheme;

    private Integer createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "answerKey", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default   // 🔥 THIS FIXES YOUR ERROR
    private List<AnswerKeyKeyword> keywords = new ArrayList<>();

    public void addKeyword(AnswerKeyKeyword keyword) {
        keywords.add(keyword);
        keyword.setAnswerKey(this);
    }

    public void removeKeyword(AnswerKeyKeyword keyword) {
        keywords.remove(keyword);
        keyword.setAnswerKey(null);
    }
}
