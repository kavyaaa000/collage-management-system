package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.response.SemesterAnalyticsResponse;
import com.college.erp.attendance.dto.response.StudentComprehensiveAnalytics;
import com.college.erp.attendance.service.AtAttendanceStudentAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("at/student-analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Student Analytics", description = "Advanced student analytics APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtStudentAnalyticsController {

    private final AtAttendanceStudentAnalyticsService atAttendanceStudentAnalyticsService;

    @GetMapping("/{studentId}/comprehensive")
    @Operation(summary = "Get comprehensive analytics", description = "Get complete student analytics across all semesters")
    public ResponseEntity<StudentComprehensiveAnalytics> getComprehensiveAnalytics(
            @PathVariable Integer studentId) {
        log.info("Fetching comprehensive analytics for student: {}", studentId);
        StudentComprehensiveAnalytics analytics = atAttendanceStudentAnalyticsService.getComprehensiveAnalytics(studentId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/{studentId}/semester-wise")
    @Operation(summary = "Get semester-wise analytics", description = "Get analytics for each semester")
    public ResponseEntity<List<SemesterAnalyticsResponse>> getSemesterWiseAnalytics(
            @PathVariable Integer studentId) {
        log.info("Fetching semester-wise analytics for student: {}", studentId);
        List<SemesterAnalyticsResponse> analytics = atAttendanceStudentAnalyticsService.getSemesterWiseAnalytics(studentId);
        return ResponseEntity.ok(analytics);
    }
}