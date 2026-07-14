package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.SemesterPerformanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtSemesterPerformanceSummaryRepository extends JpaRepository<SemesterPerformanceSummary, Long> {

    List<SemesterPerformanceSummary> findByStudentIdOrderBySemesterIdAsc(Integer studentId);

    Optional<SemesterPerformanceSummary> findByStudentIdAndSemesterIdAndAcademicSessionId(
            Integer studentId, Integer semesterId, Integer academicSessionId);

    @Query("SELECT sps FROM SemesterPerformanceSummary sps " +
            "JOIN Student s ON sps.studentId = s.studentId " +
            "WHERE s.classId = :classId AND sps.semesterId = :semesterId " +
            "AND sps.academicSessionId = :academicSessionId " +
            "ORDER BY sps.averageMarks DESC")
    List<SemesterPerformanceSummary> findByClassIdOrderByAverageMarksDesc(
            Integer classId, Integer semesterId, Integer academicSessionId);
}