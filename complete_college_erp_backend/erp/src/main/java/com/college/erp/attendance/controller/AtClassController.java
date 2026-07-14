package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.response.ClassAnalyticsResponse;
import com.college.erp.attendance.dto.response.ClassInfoResponse;
import com.college.erp.attendance.service.AtClassAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("at/class")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Class Management", description = "Class information and analytics APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtClassController {

    private final AtClassAnalyticsService atClassAnalyticsService;

    @GetMapping("/staff/{staffId}/classes")
    @Operation(summary = "Get staff classes", description = "Get all classes assigned to a staff member")
    public ResponseEntity<List<ClassInfoResponse>> getStaffClasses(@PathVariable Integer staffId) {
        log.info("Fetching classes for staff: {}", staffId);
        List<ClassInfoResponse> classes = atClassAnalyticsService.getStaffClasses(staffId);
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all classes", description = "Get all active classes (for HOD)")
    public ResponseEntity<List<ClassInfoResponse>> getAllClasses() {
        log.info("Fetching all active classes");
        List<ClassInfoResponse> classes = atClassAnalyticsService.getAllActiveClasses();
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{classId}/analytics")
    @Operation(summary = "Get class analytics", description = "Get comprehensive analytics for a class")
    public ResponseEntity<ClassAnalyticsResponse> getClassAnalytics(
            @PathVariable Integer classId,
            @RequestParam(defaultValue = "25") Integer academicSessionId) {
        log.info("Fetching analytics for class: {}", classId);
        ClassAnalyticsResponse analytics = atClassAnalyticsService.getClassAnalytics(classId, academicSessionId);
        return ResponseEntity.ok(analytics);
    }
}