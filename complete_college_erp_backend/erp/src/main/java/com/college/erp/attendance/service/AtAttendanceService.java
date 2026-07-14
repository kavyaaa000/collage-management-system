package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.request.*;
import com.college.erp.attendance.dto.response.*;
import com.college.erp.attendance.entity.*;
import com.college.erp.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtAttendanceService {

    private final AtAttendanceSessionRepository sessionRepository;
    private final AtAttendanceRecordRepository recordRepository;
    private final AtTimetableRepository atTimetableRepository;
    private final AtStudentRepository atStudentRepository;
    private final AtAttendanceCacheRepository cacheRepository;


















    @Transactional
    public AttendanceSessionResponse createTestSession(CreateTestSessionRequest request) {
        log.info("Creating TEST attendance session for staff: {}, subject: {}, date: {}",
                request.getStaffId(), request.getSubjectId(), request.getAttendanceDate());

        // Grab any existing timetable_id to satisfy the FK constraint
        Integer dummyTimetableId = atTimetableRepository.findFirstId()
                .orElseThrow(() -> new RuntimeException("No timetable entries found in DB"));

        AttendanceSession session = AttendanceSession.builder()
                .timetableId(dummyTimetableId)
                .attendanceDate(request.getAttendanceDate())
                .academicSessionId(request.getAcademicSessionId())
                .semesterId(request.getSemesterId())
                .sectionId(request.getSectionId())
                .subjectId(request.getSubjectId())
                .staffId(request.getStaffId())
                .periodNumber(request.getPeriodNumber())
                .status("OPEN")
                .totalStudents(request.getTotalStudents())
                .presentCount(0)
                .absentCount(0)
                .createdAt(LocalDateTime.now())
                .createdBy(request.getCreatedBy())
                .build();

        session = sessionRepository.save(session);
        log.info("TEST attendance session created with ID: {}", session.getSessionId());

        return mapToResponse(session);
    }























    @Transactional
    public AttendanceSessionResponse createSession(CreateSessionRequest request) {
        log.info("Creating attendance session for timetable: {}, date: {}",
                request.getTimetableId(), request.getAttendanceDate());

        // Check if session already exists
        var existing = sessionRepository.findByTimetableIdAndAttendanceDate(
                request.getTimetableId(), request.getAttendanceDate());

        if (existing.isPresent()) {
            throw new RuntimeException("Attendance session already exists for this period");
        }

        // Get timetable details
        Timetable timetable = atTimetableRepository.findById(request.getTimetableId())
                .orElseThrow(() -> new RuntimeException("Timetable not found"));

        // Get students in this section
        List<Student> students = atStudentRepository.findByCurrentSemesterIdAndSectionId(
                timetable.getSemesterId(), timetable.getSectionId());

        // Create session
        AttendanceSession session = AttendanceSession.builder()
                .timetableId(request.getTimetableId())
                .attendanceDate(request.getAttendanceDate())
                .academicSessionId(request.getAcademicSessionId())
                .semesterId(timetable.getSemesterId())
                .sectionId(timetable.getSectionId())
                .subjectId(timetable.getSubjectId())
                .staffId(timetable.getStaffId())
                .periodNumber(timetable.getPeriodNumber())
                .status("OPEN")
                .totalStudents(students.size())
                .presentCount(0)
                .absentCount(0)
                .createdAt(LocalDateTime.now())
                .createdBy(request.getCreatedBy())
                .build();

        session = sessionRepository.save(session);
        log.info("Attendance session created successfully with ID: {}", session.getSessionId());

        return mapToResponse(session);
    }

    @Transactional
    public void markAttendance(MarkAttendanceRequest request) {
        log.info("Marking attendance for student: {} in session: {}",
                request.getStudentId(), request.getSessionId());

        AttendanceSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if ("LOCKED".equals(session.getStatus())) {
            throw new RuntimeException("Cannot modify locked session");
        }

        // Check if record exists
        var existingRecord = recordRepository.findBySessionIdAndStudentId(
                request.getSessionId(), request.getStudentId());

        if (existingRecord.isPresent()) {
            // Update existing record
            AttendanceRecord record = existingRecord.get();
            record.setStatus(request.getStatus());
            record.setRemarks(request.getRemarks());
            record.setModifiedAt(LocalDateTime.now());
            record.setModifiedBy(request.getMarkedBy());
            recordRepository.save(record);
        } else {
            // Create new record
            AttendanceRecord record = AttendanceRecord.builder()
                    .sessionId(request.getSessionId())
                    .studentId(request.getStudentId())
                    .status(request.getStatus())
                    .remarks(request.getRemarks())
                    .markedAt(LocalDateTime.now())
                    .markedBy(request.getMarkedBy())
                    .build();
            recordRepository.save(record);
        }

        // Update session counts
        updateSessionCounts(request.getSessionId());

        // Invalidate cache for this student
        cacheRepository.invalidateCacheForStudent(request.getStudentId());

        log.info("Attendance marked successfully");
    }

    @Transactional
    public void bulkMarkAttendance(BulkAttendanceRequest request) {
        log.info("Bulk marking attendance for session: {} with {} students",
                request.getSessionId(), request.getAttendanceList().size());

        AttendanceSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if ("LOCKED".equals(session.getStatus())) {
            throw new RuntimeException("Cannot modify locked session");
        }

        for (var studentData : request.getAttendanceList()) {
            var existingRecord = recordRepository.findBySessionIdAndStudentId(
                    request.getSessionId(), studentData.getStudentId());

            if (existingRecord.isPresent()) {
                AttendanceRecord record = existingRecord.get();
                record.setStatus(studentData.getStatus());
                record.setRemarks(studentData.getRemarks());
                record.setModifiedAt(LocalDateTime.now());
                record.setModifiedBy(request.getMarkedBy());
                recordRepository.save(record);
            } else {
                AttendanceRecord record = AttendanceRecord.builder()
                        .sessionId(request.getSessionId())
                        .studentId(studentData.getStudentId())
                        .status(studentData.getStatus())
                        .remarks(studentData.getRemarks())
                        .markedAt(LocalDateTime.now())
                        .markedBy(request.getMarkedBy())
                        .build();
                recordRepository.save(record);
            }

            // Invalidate cache
            cacheRepository.invalidateCacheForStudent(studentData.getStudentId());
        }

        updateSessionCounts(request.getSessionId());
        log.info("Bulk attendance marked successfully");
    }

    @Transactional
    public void submitSession(Long sessionId, Integer staffId) {
        log.info("Submitting attendance session: {}", sessionId);

        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus("SUBMITTED");
        session.setSubmittedAt(LocalDateTime.now());
        sessionRepository.save(session);

        log.info("Session submitted successfully");
    }

    public List<AttendanceSessionResponse> getStaffSessions(Integer staffId, LocalDate date) {
        List<AttendanceSession> sessions = sessionRepository.findByStaffIdAndAttendanceDate(staffId, date);
        return sessions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentAttendanceResponse getStudentAttendance(Integer studentId, Integer semesterId, Integer academicSessionId) {
        Student student = atStudentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<AttendanceCalculationCache> caches = cacheRepository
                .findByStudentIdAndSemesterIdAndAcademicSessionIdAndIsValidTrue(
                        studentId, semesterId, academicSessionId);

        List<StudentAttendanceResponse.SubjectAttendance> subjectAttendances = caches.stream()
                .filter(c -> c.getSubjectId() != null)
                .map(cache -> StudentAttendanceResponse.SubjectAttendance.builder()
                        .subjectId(cache.getSubjectId())
                        .totalClasses(cache.getTotalClasses())
                        .attendedClasses(cache.getAttendedClasses())
                        .attendancePercentage(cache.getAttendancePercentage())
                        .eligibilityStatus(cache.getEligibilityStatus())
                        .classesNeededFor75(cache.getClassesNeededFor75())
                        .build())
                .collect(Collectors.toList());

        int totalClasses = caches.stream().mapToInt(AttendanceCalculationCache::getTotalClasses).sum();
        int attendedClasses = caches.stream().mapToInt(AttendanceCalculationCache::getAttendedClasses).sum();

        BigDecimal overallPercentage = totalClasses > 0
                ? BigDecimal.valueOf(attendedClasses * 100.0 / totalClasses).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        String eligibility = overallPercentage.compareTo(BigDecimal.valueOf(75)) >= 0 ? "ELIGIBLE" : "AT_RISK";

        return StudentAttendanceResponse.builder()
                .studentId(studentId)
                .registerNumber(student.getRegisterNumber())
                .studentName(student.getStudentName())
                .semesterId(semesterId)
                .subjectWiseAttendance(subjectAttendances)
                .totalClassesConducted(totalClasses)
                .totalClassesAttended(attendedClasses)
                .overallAttendancePercentage(overallPercentage)
                .eligibilityStatus(eligibility)
                .build();
    }

    private void updateSessionCounts(Long sessionId) {
        long presentCount = recordRepository.countBySessionIdAndStatus(sessionId, "PRESENT") +
                recordRepository.countBySessionIdAndStatus(sessionId, "ON_DUTY");
        long absentCount = recordRepository.countBySessionIdAndStatus(sessionId, "ABSENT");

        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setPresentCount((int) presentCount);
        session.setAbsentCount((int) absentCount);
        sessionRepository.save(session);
    }

    private AttendanceSessionResponse mapToResponse(AttendanceSession session) {
        Double percentage = session.getTotalStudents() > 0
                ? (session.getPresentCount() * 100.0 / session.getTotalStudents())
                : 0.0;

        return AttendanceSessionResponse.builder()
                .sessionId(session.getSessionId())
                .timetableId(session.getTimetableId())
                .attendanceDate(session.getAttendanceDate())
                .semesterId(session.getSemesterId())
                .sectionId(session.getSectionId())
                .subjectId(session.getSubjectId())
                .staffId(session.getStaffId())
                .periodNumber(session.getPeriodNumber())
                .status(session.getStatus())
                .totalStudents(session.getTotalStudents())
                .presentCount(session.getPresentCount())
                .absentCount(session.getAbsentCount())
                .attendancePercentage(percentage)
                .createdAt(session.getCreatedAt())
                .submittedAt(session.getSubmittedAt())
                .build();
    }
}