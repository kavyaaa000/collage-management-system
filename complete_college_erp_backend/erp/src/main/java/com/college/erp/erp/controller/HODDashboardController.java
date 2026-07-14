package com.college.erp.erp.controller;

import com.college.erp.erp.dto.*;
import com.college.erp.erp.service.HODTimetableService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/erp/hod")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class HODDashboardController {

    private final HODTimetableService timetableService;

    // ===== Dashboard Statistics =====

    @GetMapping("/dashboard/stats")
    public ResponseEntity<HODDashboardStatsDTO> getDashboardStats(
            @RequestParam Integer deptId,
            @RequestParam Integer sessionId) {
        log.info("Fetching dashboard stats for dept={}, session={}", deptId, sessionId);

        HODDashboardStatsDTO stats = timetableService.getDashboardStats(deptId, sessionId);
        return ResponseEntity.ok(stats);
    }

    // ===== Subject-Staff Mapping =====

    @GetMapping("/subject-staff-mappings")
    public ResponseEntity<List<SubjectOfferingDTO>> getSubjectOfferings(
            @RequestParam Integer deptId,
            @RequestParam Integer sessionId) {
        log.info("Fetching subject offerings for dept={}, session={}", deptId, sessionId);

        List<SubjectOfferingDTO> offerings = timetableService.getSubjectOfferingsWithMappings(
                sessionId, deptId);
        return ResponseEntity.ok(offerings);
    }

    @PostMapping("/subject-staff-mappings")
    public ResponseEntity<SubjectStaffConfigDTO> saveSubjectStaffMapping(
            @RequestBody SubjectStaffConfigDTO dto) {
        log.info("Saving subject-staff mapping: {}", dto);

        SubjectStaffConfigDTO saved = timetableService.saveSubjectStaffMapping(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/subject-staff-mappings/{configId}")
    public ResponseEntity<SubjectStaffConfigDTO> updateSubjectStaffMapping(
            @PathVariable Integer configId,
            @RequestBody SubjectStaffConfigDTO dto) {
        log.info("Updating subject-staff mapping: {}", configId);

        dto.setConfigId(configId);
        SubjectStaffConfigDTO updated = timetableService.saveSubjectStaffMapping(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/subject-staff-mappings/{configId}")
    public ResponseEntity<Void> deleteSubjectStaffMapping(@PathVariable Integer configId) {
        log.info("Deleting subject-staff mapping: {}", configId);

        timetableService.deleteSubjectStaffMapping(configId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/staff-workload")
    public ResponseEntity<List<StaffWorkloadDTO>> getStaffWorkload(
            @RequestParam Integer deptId,
            @RequestParam Integer sessionId) {
        log.info("Fetching staff workload for dept={}, session={}", deptId, sessionId);

        List<StaffWorkloadDTO> workload = timetableService.getStaffWorkload(deptId, sessionId);
        return ResponseEntity.ok(workload);
    }

    @PutMapping("/staff/{staffId}/max-hours")
    public ResponseEntity<Void> updateStaffMaxHours(
            @PathVariable Integer staffId,
            @RequestParam Integer maxHours) {
        log.info("Updating max hours for staff={} to {}", staffId, maxHours);

        timetableService.updateStaffMaxHours(staffId, maxHours);
        return ResponseEntity.ok().build();
    }

    // ===== Timetable Generation =====

    @PostMapping("/timetable/generate")
    public ResponseEntity<TimetableGenerationResponse> generateTimetable(
            @RequestBody TimetableGenerationRequest request) {
        log.info("Generating timetable for dept={}, session={}",
                request.getDeptId(), request.getSessionId());

        TimetableGenerationResponse response = timetableService.generateTimetable(request);

        if ("SUCCESS".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/timetables")
    public ResponseEntity<List<TimetableViewDTO>> getTimetables(
            @RequestParam Integer deptId,
            @RequestParam(required = false) Integer sessionId) {
        log.info("Fetching timetables for dept={}, session={}", deptId, sessionId);

        List<TimetableViewDTO> timetables = timetableService.getTimetables(deptId, sessionId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/timetables/{timetableId}")
    public ResponseEntity<TimetableViewDTO> getTimetableById(@PathVariable Integer timetableId) {
        log.info("Fetching timetable: {}", timetableId);

        TimetableViewDTO timetable = timetableService.getTimetableById(timetableId);
        return ResponseEntity.ok(timetable);
    }

    @PutMapping("/timetables/{timetableId}/status")
    public ResponseEntity<Void> updateTimetableStatus(
            @PathVariable Integer timetableId,
            @RequestParam String status) {
        log.info("Updating timetable {} status to {}", timetableId, status);

        timetableService.updateTimetableStatus(timetableId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/timetables/{timetableId}/download/excel")
    public ResponseEntity<Resource> downloadExcel(@PathVariable Integer timetableId) {
        log.info("Downloading Excel for timetable: {}", timetableId);

        try {
            String filePath = timetableService.getExcelPath(timetableId);

            // Check if file path exists
            if (filePath == null || filePath.isEmpty()) {
                log.warn("Excel file path not found for timetable: {}", timetableId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            // Check if file exists on disk
            File file = new File(filePath);
            if (!file.exists()) {
                log.warn("Excel file does not exist: {}", filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            Resource resource = new FileSystemResource(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"timetable_" + timetableId + ".xlsx\"")
                    .body(resource);

        } catch (Exception e) {
            log.error("Error downloading Excel for timetable {}: {}", timetableId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/timetables/{timetableId}/download/pdf")
    public ResponseEntity<Resource> downloadPDF(@PathVariable Integer timetableId) {
        log.info("Downloading PDF for timetable: {}", timetableId);

        try {
            String filePath = timetableService.getPDFPath(timetableId);

            // Check if file path exists
            if (filePath == null || filePath.isEmpty()) {
                log.warn("PDF file path not found for timetable: {}", timetableId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            // Check if file exists on disk
            File file = new File(filePath);
            if (!file.exists()) {
                log.warn("PDF file does not exist: {}", filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            Resource resource = new FileSystemResource(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"timetable_" + timetableId + ".pdf\"")
                    .body(resource);

        } catch (Exception e) {
            log.error("Error downloading PDF for timetable {}: {}", timetableId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // ===== Classroom Assignment =====

    @GetMapping("/classrooms/available")
    public ResponseEntity<List<AvailableRoomDTO>> getAvailableRooms(
            @RequestParam Integer deptId,
            @RequestParam(required = false) String roomType) {
        log.info("Fetching available rooms for dept={}, type={}", deptId, roomType);

        List<AvailableRoomDTO> rooms = timetableService.getAvailableRooms(deptId, roomType);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/classroom-assignments")
    public ResponseEntity<List<ClassroomAssignmentDTO>> getClassroomAssignments(
            @RequestParam Integer sessionId,
            @RequestParam Integer deptId) {
        log.info("Fetching classroom assignments for session={}, dept={}", sessionId, deptId);

        List<ClassroomAssignmentDTO> assignments = timetableService.getClassroomAssignments(
                sessionId, deptId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping("/classroom-assignments")
    public ResponseEntity<ClassroomAssignmentDTO> assignClassroom(
            @RequestBody ClassroomAssignmentDTO dto) {
        log.info("Assigning classroom: {}", dto);

        ClassroomAssignmentDTO assignment = timetableService.assignClassroom(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    @PutMapping("/classroom-assignments/{assignmentId}")
    public ResponseEntity<ClassroomAssignmentDTO> updateClassroomAssignment(
            @PathVariable Integer assignmentId,
            @RequestBody ClassroomAssignmentDTO dto) {
        log.info("Updating classroom assignment: {}", assignmentId);

        dto.setAssignmentId(assignmentId);
        ClassroomAssignmentDTO updated = timetableService.assignClassroom(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/classroom-assignments/{assignmentId}")
    public ResponseEntity<Void> deleteClassroomAssignment(@PathVariable Integer assignmentId) {
        log.info("Deleting classroom assignment: {}", assignmentId);

        timetableService.deleteClassroomAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/staff/available")
    public ResponseEntity<List<StaffDTO>> getAvailableStaff(@RequestParam Integer deptId) {
        log.info("Fetching available staff for dept={}", deptId);

        List<StaffDTO> staff = timetableService.getAvailableStaff(deptId);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable Integer staffId) {
        log.info("Fetching staff: {}", staffId);

        StaffDTO staff = timetableService.getStaffById(staffId);
        return ResponseEntity.ok(staff);
    }


}