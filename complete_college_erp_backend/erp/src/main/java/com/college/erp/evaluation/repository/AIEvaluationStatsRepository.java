package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.AIEvaluationStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AIEvaluationStatsRepository extends JpaRepository<AIEvaluationStats, Integer> {

    Optional<AIEvaluationStats> findByExamIdAndSubjectId(Integer examId, Integer subjectId);

    List<AIEvaluationStats> findByExamId(Integer examId);

    List<AIEvaluationStats> findBySubjectId(Integer subjectId);
}