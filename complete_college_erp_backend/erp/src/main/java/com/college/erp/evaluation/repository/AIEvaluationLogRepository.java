package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.AIEvaluationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AIEvaluationLogRepository extends JpaRepository<AIEvaluationLog, Integer> {

    List<AIEvaluationLog> findByAnswerSheet_SheetId(Integer sheetId);

    Optional<AIEvaluationLog> findByAnswerSheet_SheetIdAndQuestionNumber(
            Integer sheetId, Integer questionNumber
    );

    @Query("SELECT ael FROM AIEvaluationLog ael LEFT JOIN FETCH ael.markOverride " +
            "WHERE ael.answerSheet.sheetId = :sheetId ORDER BY ael.questionNumber")
    List<AIEvaluationLog> findBySheetIdWithOverrides(@Param("sheetId") Integer sheetId);

    @Query("SELECT AVG(ael.aiConfidenceScore) FROM AIEvaluationLog ael " +
            "WHERE ael.answerSheet.examId = :examId AND ael.answerSheet.subjectId = :subjectId")
    BigDecimal getAverageConfidenceByExamAndSubject(
            @Param("examId") Integer examId, @Param("subjectId") Integer subjectId
    );

    @Query("SELECT COUNT(ael) FROM AIEvaluationLog ael " +
            "WHERE ael.answerSheet.sheetId = :sheetId")
    Long countBySheetId(@Param("sheetId") Integer sheetId);
}