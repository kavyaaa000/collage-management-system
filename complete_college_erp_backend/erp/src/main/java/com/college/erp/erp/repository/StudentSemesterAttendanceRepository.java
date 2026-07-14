package com.college.erp.erp.repository;

import com.college.erp.erp.entity.StudentSemesterAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentSemesterAttendanceRepository extends JpaRepository<StudentSemesterAttendance, Integer> {
    StudentSemesterAttendance findByStudentIdAndSemesterIdAndSessionId(
            Integer studentId, Integer semesterId, Integer sessionId);
}