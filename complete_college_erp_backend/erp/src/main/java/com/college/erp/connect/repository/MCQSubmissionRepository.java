package com.college.erp.connect.repository;

import com.college.erp.connect.entity.MCQSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MCQSubmissionRepository extends JpaRepository<MCQSubmission, Long> {

    Optional<MCQSubmission> findByContestIdAndUserIdAndQuestionId(
            Long contestId, Long userId, Long questionId);

    List<MCQSubmission> findByContestIdAndUserId(Long contestId, Long userId);

    @Query("SELECT SUM(s.pointsEarned) FROM MCQSubmission s " +
            "WHERE s.contest.id = :contestId AND s.user.id = :userId")
    Integer getTotalPointsByContestAndUser(
            @Param("contestId") Long contestId,
            @Param("userId") Long userId);
}
