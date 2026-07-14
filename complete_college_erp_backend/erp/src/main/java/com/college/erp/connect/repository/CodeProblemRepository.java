package com.college.erp.connect.repository;

import com.college.erp.connect.entity.CodeProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeProblemRepository extends JpaRepository<CodeProblem, Long> {

    List<CodeProblem> findByContestIdOrderByOrderIndex(Long contestId);

    Long countByContestId(Long contestId);
}