package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.AttendanceCalculationCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtAttendanceCacheRepository extends JpaRepository<AttendanceCalculationCache, Long> {

    Optional<AttendanceCalculationCache> findByStudentIdAndSubjectIdAndSemesterIdAndAcademicSessionId(
            Integer studentId, Integer subjectId, Integer semesterId, Integer academicSessionId);

    List<AttendanceCalculationCache> findByStudentIdAndSemesterIdAndAcademicSessionIdAndIsValidTrue(
            Integer studentId, Integer semesterId, Integer academicSessionId);

    @Modifying
    @Query("UPDATE AttendanceCalculationCache c SET c.isValid = false WHERE c.studentId = :studentId")
    void invalidateCacheForStudent(Integer studentId);

    List<AttendanceCalculationCache> findByEligibilityStatusInAndIsValidTrue(List<String> statuses);
}