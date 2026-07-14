package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.StaffMarkOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffMarkOverrideRepository extends JpaRepository<StaffMarkOverride, Integer> {

    Optional<StaffMarkOverride> findByEvaluationLog_LogId(Integer logId);

    List<StaffMarkOverride> findByReviewedBy(Integer staffId);

    List<StaffMarkOverride> findByIsLocked(Boolean isLocked);

    @Query("SELECT smo FROM StaffMarkOverride smo " +
            "JOIN smo.evaluationLog ael " +
            "WHERE ael.answerSheet.sheetId = :sheetId")
    List<StaffMarkOverride> findBySheetId(@Param("sheetId") Integer sheetId);

    @Query("SELECT COUNT(smo) FROM StaffMarkOverride smo " +
            "JOIN smo.evaluationLog ael " +
            "WHERE ael.answerSheet.sheetId = :sheetId AND smo.isLocked = true")
    Long countLockedBySheetId(@Param("sheetId") Integer sheetId);

    @Query("SELECT AVG(ABS(smo.adjustmentPercent)) FROM StaffMarkOverride smo " +
            "JOIN smo.evaluationLog ael " +
            "WHERE ael.answerSheet.examId = :examId AND ael.answerSheet.subjectId = :subjectId")
    BigDecimal getAverageAdjustmentPercentByExamAndSubject(
            @Param("examId") Integer examId, @Param("subjectId") Integer subjectId
    );

    @Modifying
    @Query("UPDATE StaffMarkOverride smo SET smo.isLocked = true, smo.lockedAt = CURRENT_TIMESTAMP " +
            "WHERE smo.evaluationLog.answerSheet.sheetId = :sheetId AND smo.isLocked = false")
    int lockAllBySheetId(@Param("sheetId") Integer sheetId);
}