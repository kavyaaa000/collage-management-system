//package com.college.erp.attendance.controller;
//
//import com.college.erp.attendance.dto.request.*;
//import com.college.erp.attendance.dto.response.*;
//import com.college.erp.attendance.service.AtAttendanceService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("at/attendance")
//@RequiredArgsConstructor
//@Slf4j
//@Tag(name = "Attendance Management", description = "APIs for attendance tracking and management")
//@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
//public class AttendanceController {
//
//    private final AtAttendanceService atAttendanceService;
//
//    @PostMapping("/session/create")
//    @Operation(summary = "Create attendance session", description = "Create a new attendance session for a timetable period")
//    public ResponseEntity<AttendanceSessionResponse> createSession(@Valid @RequestBody CreateSessionRequest request) {
//        log.info("REST request to create attendance session: {}", request);
//        AttendanceSessionResponse response = atAttendanceService.createSession(request);
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//
//    @PostMapping("/mark")
//    @Operation(summary = "Mark attendance", description = "Mark attendance for a single student")
//    public ResponseEntity<Void> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
//        log.info("REST request to mark attendance: {}", request);
//        atAttendanceService.markAttendance(request);
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/bulk-mark")
//    @Operation(summary = "Bulk mark attendance", description = "Mark attendance for multiple students at once")
//    public ResponseEntity<Void> bulkMarkAttendance(@Valid @RequestBody BulkAttendanceRequest request) {
//        log.info("REST request to bulk mark attendance for session: {}", request.getSessionId());
//        atAttendanceService.bulkMarkAttendance(request);
//        return ResponseEntity.ok().build();
//    }
//
//    @PutMapping("/session/{sessionId}/submit")
//    @Operation(summary = "Submit session", description = "Submit attendance session for finalization")
//    public ResponseEntity<Void> submitSession(
//            @PathVariable Long sessionId,
//            @RequestParam Integer staffId) {
//        log.info("REST request to submit session: {}", sessionId);
//        atAttendanceService.submitSession(sessionId, staffId);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/staff/{staffId}/sessions")
//    @Operation(summary = "Get staff sessions", description = "Get all sessions for a staff member on a specific date")
//    public ResponseEntity<List<AttendanceSessionResponse>> getStaffSessions(
//            @PathVariable Integer staffId,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
//        log.info("REST request to get sessions for staff: {}, date: {}", staffId, date);
//        List<AttendanceSessionResponse> sessions = atAttendanceService.getStaffSessions(staffId, date);
//        return ResponseEntity.ok(sessions);
//    }
//
//    @GetMapping("/student/{studentId}")
//    @Operation(summary = "Get student attendance", description = "Get detailed attendance information for a student")
//    public ResponseEntity<StudentAttendanceResponse> getStudentAttendance(
//            @PathVariable Integer studentId,
//            @RequestParam Integer semesterId,
//            @RequestParam Integer academicSessionId) {
//        log.info("REST request to get attendance for student: {}", studentId);
//        StudentAttendanceResponse response = atAttendanceService.getStudentAttendance(
//                studentId, semesterId, academicSessionId);
//        return ResponseEntity.ok(response);
//    }
//}















package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.request.*;
import com.college.erp.attendance.dto.response.*;
import com.college.erp.attendance.service.AtAttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("at/attendance")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Attendance Management", description = "APIs for attendance tracking and management")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AttendanceController {

    private final AtAttendanceService atAttendanceService;

    @PostMapping("/session/create")
    @Operation(summary = "Create attendance session", description = "Create a new attendance session for a timetable period")
    public ResponseEntity<AttendanceSessionResponse> createSession(@Valid @RequestBody CreateSessionRequest request) {
        log.info("REST request to create attendance session: {}", request);
        AttendanceSessionResponse response = atAttendanceService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── NEW: test/demo endpoint — no timetable required ────────────────────
    @PostMapping("/session/create-test")
    @Operation(summary = "Create test session (demo use only)",
            description = "Creates a session without a timetable entry for testing and demonstrations")
    public ResponseEntity<AttendanceSessionResponse> createTestSession(
            @Valid @RequestBody CreateTestSessionRequest request) {
        log.info("REST request to create TEST attendance session for staff: {}, date: {}",
                request.getStaffId(), request.getAttendanceDate());
        AttendanceSessionResponse response = atAttendanceService.createTestSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/mark")
    @Operation(summary = "Mark attendance", description = "Mark attendance for a single student")
    public ResponseEntity<Void> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        log.info("REST request to mark attendance: {}", request);
        atAttendanceService.markAttendance(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk-mark")
    @Operation(summary = "Bulk mark attendance", description = "Mark attendance for multiple students at once")
    public ResponseEntity<Void> bulkMarkAttendance(@Valid @RequestBody BulkAttendanceRequest request) {
        log.info("REST request to bulk mark attendance for session: {}", request.getSessionId());
        atAttendanceService.bulkMarkAttendance(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/session/{sessionId}/submit")
    @Operation(summary = "Submit session", description = "Submit attendance session for finalization")
    public ResponseEntity<Void> submitSession(
            @PathVariable Long sessionId,
            @RequestParam Integer staffId) {
        log.info("REST request to submit session: {}", sessionId);
        atAttendanceService.submitSession(sessionId, staffId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/staff/{staffId}/sessions")
    @Operation(summary = "Get staff sessions", description = "Get all sessions for a staff member on a specific date")
    public ResponseEntity<List<AttendanceSessionResponse>> getStaffSessions(
            @PathVariable Integer staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("REST request to get sessions for staff: {}, date: {}", staffId, date);
        List<AttendanceSessionResponse> sessions = atAttendanceService.getStaffSessions(staffId, date);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student attendance", description = "Get detailed attendance information for a student")
    public ResponseEntity<StudentAttendanceResponse> getStudentAttendance(
            @PathVariable Integer studentId,
            @RequestParam Integer semesterId,
            @RequestParam Integer academicSessionId) {
        log.info("REST request to get attendance for student: {}", studentId);
        StudentAttendanceResponse response = atAttendanceService.getStudentAttendance(
                studentId, semesterId, academicSessionId);
        return ResponseEntity.ok(response);
    }
}