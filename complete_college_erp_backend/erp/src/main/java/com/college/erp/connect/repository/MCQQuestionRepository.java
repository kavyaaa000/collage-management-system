package com.college.erp.connect.repository;

import com.college.erp.connect.entity.MCQQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MCQQuestionRepository extends JpaRepository<MCQQuestion, Long> {

    List<MCQQuestion> findByContestIdOrderByOrderIndex(Long contestId);

    Long countByContestId(Long contestId);
}
