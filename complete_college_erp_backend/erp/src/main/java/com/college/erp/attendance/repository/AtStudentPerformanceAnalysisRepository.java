package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.StudentPerformanceAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtStudentPerformanceAnalysisRepository extends JpaRepository<StudentPerformanceAnalysis, Long> {

    Optional<StudentPerformanceAnalysis> findTopByStudentIdOrderByAnalysisDateDesc(Integer studentId);

    List<StudentPerformanceAnalysis> findByStudentIdAndSemesterIdOrderByAnalysisDateDesc(
            Integer studentId, Integer semesterId);

    List<StudentPerformanceAnalysis> findByActionRequiredTrueOrderByRiskLevelAsc();

    List<StudentPerformanceAnalysis> findByAnalysisDateAndSemesterId(LocalDate date, Integer semesterId);
}