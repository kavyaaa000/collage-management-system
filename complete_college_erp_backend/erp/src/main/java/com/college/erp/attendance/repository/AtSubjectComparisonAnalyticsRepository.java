package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.SubjectComparisonAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtSubjectComparisonAnalyticsRepository extends JpaRepository<SubjectComparisonAnalytics, Long> {

    List<SubjectComparisonAnalytics> findByStudentIdAndSemesterIdAndAcademicSessionId(
            Integer studentId, Integer semesterId, Integer academicSessionId);

    List<SubjectComparisonAnalytics> findBySubjectIdAndSemesterIdAndAcademicSessionIdOrderByStudentRankInSubjectAsc(
            Integer subjectId, Integer semesterId, Integer academicSessionId);
}