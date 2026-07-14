package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.AnswerKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerKeyRepository extends JpaRepository<AnswerKey, Integer> {

    List<AnswerKey> findByExamIdAndSubjectId(Integer examId, Integer subjectId);

    Optional<AnswerKey> findByExamIdAndSubjectIdAndQuestionNumber(
            Integer examId, Integer subjectId, Integer questionNumber
    );

    @Query("SELECT ak FROM AnswerKey ak LEFT JOIN FETCH ak.keywords WHERE ak.keyId = :keyId")
    Optional<AnswerKey> findByIdWithKeywords(@Param("keyId") Integer keyId);

    @Query("SELECT ak FROM AnswerKey ak LEFT JOIN FETCH ak.keywords " +
            "WHERE ak.examId = :examId AND ak.subjectId = :subjectId " +
            "ORDER BY ak.questionNumber")
    List<AnswerKey> findByExamIdAndSubjectIdWithKeywords(
            @Param("examId") Integer examId, @Param("subjectId") Integer subjectId
    );

    boolean existsByExamIdAndSubjectIdAndQuestionNumber(
            Integer examId, Integer subjectId, Integer questionNumber
    );

    @Query("SELECT COUNT(ak) FROM AnswerKey ak WHERE ak.examId = :examId AND ak.subjectId = :subjectId")
    Long countByExamIdAndSubjectId(@Param("examId") Integer examId, @Param("subjectId") Integer subjectId);
}