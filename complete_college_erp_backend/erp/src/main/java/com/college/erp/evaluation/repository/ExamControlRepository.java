package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.ExamControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamControlRepository extends JpaRepository<ExamControl, Integer> {

    Optional<ExamControl> findByExamIdAndSubjectIdAndSessionId(
            Integer examId, Integer subjectId, Integer sessionId
    );

    List<ExamControl> findByExamId(Integer examId);

    List<ExamControl> findBySessionId(Integer sessionId);

    @Query("SELECT ec FROM ExamControl ec " +
            "WHERE ec.examId = :examId AND ec.subjectId = :subjectId AND ec.sessionId = :sessionId " +
            "AND ec.marksEntryEnabled = true AND ec.aiEvaluationEnabled = true")
    Optional<ExamControl> findActiveControl(
            @Param("examId") Integer examId,
            @Param("subjectId") Integer subjectId,
            @Param("sessionId") Integer sessionId
    );

    boolean existsByExamIdAndSubjectIdAndSessionId(Integer examId, Integer subjectId, Integer sessionId);
}