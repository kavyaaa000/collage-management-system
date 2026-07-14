package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtAttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    Optional<AttendanceSession> findByTimetableIdAndAttendanceDate(Integer timetableId, LocalDate date);

    List<AttendanceSession> findByStaffIdAndAttendanceDate(Integer staffId, LocalDate date);

    List<AttendanceSession> findBySemesterIdAndAttendanceDate(Integer semesterId, LocalDate date);

    @Query("SELECT a FROM AttendanceSession a WHERE a.attendanceDate BETWEEN :startDate AND :endDate " +
            "AND a.semesterId = :semesterId ORDER BY a.attendanceDate DESC")
    List<AttendanceSession> findByDateRangeAndSemester(LocalDate startDate, LocalDate endDate, Integer semesterId);

    @Query("SELECT a FROM AttendanceSession a WHERE a.staffId = :staffId AND a.status = :status " +
            "ORDER BY a.attendanceDate DESC, a.periodNumber ASC")
    List<AttendanceSession> findByStaffIdAndStatus(Integer staffId, String status);
}