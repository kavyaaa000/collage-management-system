package com.college.erp.connect.repository;

import com.college.erp.connect.entity.CodeSubmission;
import com.college.erp.connect.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {

    List<CodeSubmission> findByContestIdAndUserIdOrderBySubmittedAtDesc(Long contestId, Long userId);

    List<CodeSubmission> findByProblemIdAndUserIdOrderBySubmittedAtDesc(Long problemId, Long userId);

    Optional<CodeSubmission> findByJudge0Token(String token);

    List<CodeSubmission> findByStatusIn(List<SubmissionStatus> statuses);

    @Query("SELECT COALESCE(MAX(s.pointsEarned), 0) FROM CodeSubmission s " +
            "WHERE s.problem.id = :problemId AND s.user.id = :userId")
    Integer getMaxPointsByProblemAndUser(
            @Param("problemId") Long problemId,
            @Param("userId") Long userId
    );
}
