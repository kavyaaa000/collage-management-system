
package com.college.erp.admissions.controller;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.StudentDocument;
import com.college.erp.admissions.entity.StudentProfile;
import com.college.erp.admissions.repository.StudentProfileRepository;
import com.college.erp.admissions.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ad/staff")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class admiStaffController {

    private final AdmiStaffService admiStaffService;
    private final StudentProfileRepository profileRepository;

    // ========== Dashboard ==========
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StaffDashboardDTO>> getDashboard() {
        ApiResponse<StaffDashboardDTO> response = admiStaffService.getMyDashboard();
        return ResponseEntity.ok(response);
    }

    // ========== Student Management ==========
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfileDTO>>> getAssignedStudents() {
        ApiResponse<List<StudentProfileDTO>> response = admiStaffService.getMyAssignedStudents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/students/pending")
    public ResponseEntity<ApiResponse<List<StudentProfileDTO>>> getPendingVerifications() {
        ApiResponse<List<StudentProfileDTO>> response = admiStaffService.getPendingVerifications();
        return ResponseEntity.ok(response);
    }

    // ========== Verification ==========
    @PostMapping("/verify/{studentProfileId}")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> verifyStudent(
            @PathVariable Long studentProfileId
    ) {
        ApiResponse<StudentProfileDTO> response = admiStaffService.verifyStudent(studentProfileId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-correction/{studentProfileId}")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> requestCorrection(
            @PathVariable Long studentProfileId,
            @Valid @RequestBody VerificationRequest request
    ) {
        ApiResponse<StudentProfileDTO> response = admiStaffService.requestCorrection(
                studentProfileId,
                request.getRemarks()
        );
        return ResponseEntity.ok(response);
    }



    @GetMapping("/students/{id}/documents")
    public ResponseEntity<ApiResponse<List<StudentDocumentDTO>>> getStudentDocuments(@PathVariable Long id) {
        StudentProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<StudentDocument> docs = profile.getDocuments();
        List<StudentDocumentDTO> dtos = docs.stream().map(doc -> StudentDocumentDTO.builder()
                        .id(doc.getId())
                        .studentProfileId(profile.getId())
                        .documentType(doc.getDocumentType().name())
                        .originalFilename(doc.getOriginalFilename())
                        .storedFilename(doc.getStoredFilename())
                        .fileSize(doc.getFileSize())
                        .mimeType(doc.getMimeType())
                        .uploadedAt(doc.getUploadedAt())
                        .build())
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Documents retrieved", dtos));
    }

}
