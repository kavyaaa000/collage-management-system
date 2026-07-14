package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtAttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findBySessionId(Long sessionId);

    Optional<AttendanceRecord> findBySessionIdAndStudentId(Long sessionId, Integer studentId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentId = :studentId " +
            "AND ar.sessionId IN :sessionIds")
    List<AttendanceRecord> findByStudentIdAndSessionIds(Integer studentId, List<Long> sessionIds);

    long countBySessionIdAndStatus(Long sessionId, String status);
}