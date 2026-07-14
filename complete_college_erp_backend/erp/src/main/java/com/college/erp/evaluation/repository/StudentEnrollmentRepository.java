package com.college.erp.evaluation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface StudentEnrollmentRepository {

    @Query(value = "SELECT s.student_id, s.student_name, s.roll_number " +
            "FROM student s " +
            "INNER JOIN student_enrollment e ON s.student_id = e.student_id " +
            "WHERE e.exam_id = :examId AND e.subject_id = :subjectId",
            nativeQuery = true)
    List findStudentsByExamAndSubject(
            @Param("examId") Integer examId,
            @Param("subjectId") Integer subjectId
    );
}