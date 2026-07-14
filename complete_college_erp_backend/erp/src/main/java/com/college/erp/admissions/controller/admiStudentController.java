package com.college.erp.admissions.controller;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ad/students")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class admiStudentController {

    private final AdmiStudentService admiStudentService;
    private final AdmiDocumentService admiDocumentService;
    private final AdmiDepartmentService admiDepartmentService;

    // ========== Dashboard ==========
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StudentDashboardDTO>> getDashboard() {
        ApiResponse<StudentDashboardDTO> response = admiStudentService.getMyDashboard();
        return ResponseEntity.ok(response);
    }

    // ========== Profile Management ==========
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getMyProfile() {
        ApiResponse<StudentProfileDTO> response = admiStudentService.getMyProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> updateProfile(
            @Valid @RequestBody UpdateStudentProfileRequest request
    ) {
        ApiResponse<StudentProfileDTO> response = admiStudentService.updateMyProfile(request);
        return ResponseEntity.ok(response);
    }

    // ========== Marks Management ==========
    @PutMapping("/marks")
    public ResponseEntity<ApiResponse<StudentMarksDTO>> updateMarks(
            @Valid @RequestBody UpdateMarksRequest request
    ) {
        ApiResponse<StudentMarksDTO> response = admiStudentService.updateMyMarks(request);
        return ResponseEntity.ok(response);
    }

    // ========== Preferences Management ==========
    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getActiveDepartments() {
        ApiResponse<List<DepartmentDTO>> response = admiDepartmentService.getAllActiveDepartments();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<List<StudentPreferenceDTO>>> updatePreferences(
            @Valid @RequestBody UpdatePreferencesRequest request
    ) {
        ApiResponse<List<StudentPreferenceDTO>> response = admiStudentService.updateMyPreferences(request);
        return ResponseEntity.ok(response);
    }

    // ========== Document Management ==========
    @GetMapping("/documents")
    public ResponseEntity<ApiResponse<List<StudentDocumentDTO>>> getMyDocuments() {
        ApiResponse<List<StudentDocumentDTO>> response = admiDocumentService.getMyDocuments();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/documents/upload")
    public ResponseEntity<ApiResponse<StudentDocumentDTO>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType
    ) {
        ApiResponse<StudentDocumentDTO> response = admiDocumentService.uploadDocument(file, documentType);
        return ResponseEntity.ok(response);
    }

    // ========== Registration Submission ==========
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submitRegistration() {
        ApiResponse<Void> response = admiStudentService.submitRegistration();
        return ResponseEntity.ok(response);
    }
}