package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.StudentAnswerSheet;
import com.college.erp.evaluation.entity.StudentAnswerSheet.UploadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAnswerSheetRepository extends JpaRepository<StudentAnswerSheet, Integer> {

    Optional<StudentAnswerSheet> findByExamIdAndStudentIdAndSubjectId(
            Integer examId, Integer studentId, Integer subjectId
    );

    List<StudentAnswerSheet> findByExamIdAndSubjectId(Integer examId, Integer subjectId);

    List<StudentAnswerSheet> findByUploadStatus(UploadStatus status);

    List<StudentAnswerSheet> findByExamIdAndSubjectIdAndUploadStatus(
            Integer examId, Integer subjectId, UploadStatus status
    );

    @Query("SELECT sas FROM StudentAnswerSheet sas LEFT JOIN FETCH sas.evaluationLogs " +
            "WHERE sas.sheetId = :sheetId")
    Optional<StudentAnswerSheet> findByIdWithEvaluations(@Param("sheetId") Integer sheetId);

    @Query("SELECT COUNT(sas) FROM StudentAnswerSheet sas " +
            "WHERE sas.examId = :examId AND sas.subjectId = :subjectId")
    Long countByExamIdAndSubjectId(@Param("examId") Integer examId, @Param("subjectId") Integer subjectId);

    @Query("SELECT COUNT(sas) FROM StudentAnswerSheet sas " +
            "WHERE sas.examId = :examId AND sas.subjectId = :subjectId AND sas.uploadStatus = :status")
    Long countByExamIdAndSubjectIdAndStatus(
            @Param("examId") Integer examId,
            @Param("subjectId") Integer subjectId,
            @Param("status") UploadStatus status
    );

    boolean existsByExamIdAndStudentIdAndSubjectId(Integer examId, Integer studentId, Integer subjectId);


    List<StudentAnswerSheet> findByExamIdAndSubjectIdAndUploadStatus(
            Integer examId, Integer subjectId, String uploadStatus);

    /**
     * Find all sheets by exam and subject
     */

}