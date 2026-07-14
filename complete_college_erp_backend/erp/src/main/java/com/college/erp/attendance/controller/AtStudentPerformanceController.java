package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.response.StudentDetailedPerformanceResponse;
import com.college.erp.attendance.service.AtStudentPerformanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("at/performance")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Student Performance", description = "Detailed student performance APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtStudentPerformanceController {

    private final AtStudentPerformanceService performanceService;

    @GetMapping("/student/{studentId}/detailed")
    @Operation(summary = "Get detailed performance", description = "Get comprehensive student performance analysis")
    public ResponseEntity<StudentDetailedPerformanceResponse> getDetailedPerformance(
            @PathVariable Integer studentId,
            @RequestParam Integer semesterId,
            @RequestParam Integer academicSessionId) {
        log.info("Fetching detailed performance for student: {}", studentId);
        StudentDetailedPerformanceResponse response = performanceService.getDetailedPerformance(
                studentId, semesterId, academicSessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/class")
    @Operation(summary = "Get class performance", description = "Get performance of all students in a class")
    public ResponseEntity<List<StudentDetailedPerformanceResponse>> getClassPerformance(
            @RequestParam Integer semesterId,
            @RequestParam Integer sectionId,
            @RequestParam Integer academicSessionId) {
        log.info("Fetching class performance for semester: {}, section: {}", semesterId, sectionId);
        List<StudentDetailedPerformanceResponse> response = performanceService.getClassPerformance(
                semesterId, sectionId, academicSessionId);
        return ResponseEntity.ok(response);
    }
}