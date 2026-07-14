package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.response.*;
import com.college.erp.attendance.service.AtAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("at/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Analytics", description = "APIs for attendance and performance analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtAnalyticsController {

    private final AtAnalyticsService atAnalyticsService;

    @GetMapping("/dashboard/staff/{staffId}")
    @Operation(summary = "Staff dashboard", description = "Get dashboard statistics for staff")
    public ResponseEntity<DashboardStatsResponse> getStaffDashboard(
            @PathVariable Integer staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("REST request to get staff dashboard for: {}", staffId);
        DashboardStatsResponse response = atAnalyticsService.getStaffDashboard(staffId, date);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/student/{studentId}")
    @Operation(summary = "Student dashboard", description = "Get dashboard statistics for student")
    public ResponseEntity<DashboardStatsResponse> getStudentDashboard(
            @PathVariable Integer studentId,
            @RequestParam Integer semesterId,
            @RequestParam Integer academicSessionId) {
        log.info("REST request to get student dashboard for: {}", studentId);
        DashboardStatsResponse response = atAnalyticsService.getStudentDashboard(
                studentId, semesterId, academicSessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/at-risk-students")
    @Operation(summary = "At-risk students", description = "Get list of students at risk based on attendance and performance")
    public ResponseEntity<List<AtRiskStudentResponse>> getAtRiskStudents(
            @RequestParam Integer semesterId,
            @RequestParam Integer academicSessionId) {
        log.info("REST request to get at-risk students for semester: {}", semesterId);
        List<AtRiskStudentResponse> students = atAnalyticsService.getAtRiskStudents(
                semesterId, academicSessionId);
        return ResponseEntity.ok(students);
    }
}