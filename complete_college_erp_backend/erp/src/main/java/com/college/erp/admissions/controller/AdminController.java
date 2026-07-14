//package com.college.erp.admissions.controller;
//
//import com.college.erp.admissions.dto.*;
//import com.college.erp.admissions.entity.AdmissionResult;
//import com.college.erp.admissions.entity.Department;
//import com.college.erp.admissions.entity.StudentProfile;
//import com.college.erp.admissions.repository.AdmissionResultRepository;
//import com.college.erp.admissions.repository.AdDepartmentRepository;
//import com.college.erp.admissions.service.*;
//import com.college.erp.admissions.repository.StudentProfileRepository;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/ad/admin")
//@PreAuthorize("hasRole('ADMIN')")
//@RequiredArgsConstructor
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
//public class AdminController {
//
//    private final AdmiUserService admiUserService;
//    private final AdmiDepartmentService admiDepartmentService;
//    private final AdmiStaffService admiStaffService;
//    private final AdmissionService admissionService;
//    private final SystemConfigService configService;
//    private final StudentProfileRepository profileRepository;
//    private final AdmissionResultRepository admissionResultRepository ;
//    private final AdDepartmentRepository adDepartmentRepository;
//    // ========== Dashboard ==========
//    @GetMapping("/dashboard")
//    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getDashboard() {
//        long totalStudents = profileRepository.count();
//        long pending = profileRepository.countByVerificationStatus(
//                StudentProfile.VerificationStatus.PENDING);
//        long verified = profileRepository.countByVerificationStatus(
//                StudentProfile.VerificationStatus.VERIFIED);
//        long correctionRequested = profileRepository.countByVerificationStatus(
//                StudentProfile.VerificationStatus.CORRECTION_REQUESTED);
//
//        List<Department> departments = adDepartmentRepository.findAll();
//        long totalSeats = departments.stream().mapToLong(Department::getTotalSeats).sum();
//
//        long allotted = admissionResultRepository.countByAllocationStatus(
//                AdmissionResult.AllocationStatus.ALLOTTED);
//        long notAllotted = admissionResultRepository.countByAllocationStatus(
//                AdmissionResult.AllocationStatus.NOT_ALLOTTED);
//        long accepted = admissionResultRepository.countByOfferStatus(
//                AdmissionResult.OfferStatus.ACCEPTED);
//        long declined = admissionResultRepository.countByOfferStatus(
//                AdmissionResult.OfferStatus.DECLINED);
//
//        String regStatus = configService.getRegistrationWindowStatus();
//
//        AdminDashboardDTO dashboard = AdminDashboardDTO.builder()
//                .totalStudents(totalStudents)
//                .pendingVerification(pending)
//                .verified(verified)
//                .correctionRequested(correctionRequested)
//                .totalDepartments((long) departments.size())
//                .totalSeatsAvailable(totalSeats)
//                .allottedStudents(allotted)
//                .notAllottedStudents(notAllotted)
//                .acceptedOffers(accepted)
//                .declinedOffers(declined)
//                .registrationWindowStatus(regStatus)
//                .admissionProcessStatus("COMPLETED") // Can be dynamic
//                .build();
//
//        return ResponseEntity.ok(ApiResponse.success("Dashboard retrieved", dashboard));
//    }
//
//    // ========== Registration Window ==========
//    @PostMapping("/registration/toggle")
//    public ResponseEntity<ApiResponse<String>> toggleRegistrationWindow() {
//        ApiResponse<String> response = configService.toggleRegistrationWindow();
//        return ResponseEntity.ok(response);
//    }
//
//    // ========== Staff Management ==========
//    @GetMapping("/staff")
//    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllStaff() {
//        ApiResponse<List<UserDTO>> response = admiUserService.getAllStaff();
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/staff")
//    public ResponseEntity<ApiResponse<UserDTO>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
//        ApiResponse<UserDTO> response = admiUserService.createStaff(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @DeleteMapping("/staff/{staffId}")
//    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long staffId) {
//        ApiResponse<Void> response = admiUserService.deleteStaff(staffId);
//        return ResponseEntity.ok(response);
//    }
//
//    // ========== Department Management ==========
//    @GetMapping("/departments")
//    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
//        ApiResponse<List<DepartmentDTO>> response = admiDepartmentService.getAllDepartments();
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/departments")
//    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(
//            @Valid @RequestBody CreateDepartmentRequest request
//    ) {
//        ApiResponse<DepartmentDTO> response = admiDepartmentService.createDepartment(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @PutMapping("/departments/{id}")
//    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
//            @PathVariable Long id,
//            @Valid @RequestBody UpdateDepartmentRequest request
//    ) {
//        ApiResponse<DepartmentDTO> response = admiDepartmentService.updateDepartment(id, request);
//        return ResponseEntity.ok(response);
//    }
//
//    @DeleteMapping("/departments/{id}")
//    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
//        ApiResponse<Void> response = admiDepartmentService.deleteDepartment(id);
//        return ResponseEntity.ok(response);
//    }
//
//    // ========== Mentor Assignment ==========
//    @PostMapping("/assign-mentors/random")
//    public ResponseEntity<ApiResponse<Void>> assignMentorsRandomly() {
//        ApiResponse<Void> response = admiStaffService.assignMentorsRandomly();
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/assign-mentor")
//    public ResponseEntity<ApiResponse<StudentProfileDTO>> reassignMentor(
//            @Valid @RequestBody AssignMentorRequest request
//    ) {
//        ApiResponse<StudentProfileDTO> response = admiStaffService.reassignMentor(
//                request.getStudentProfileId(),
//                request.getMentorId()
//        );
//        return ResponseEntity.ok(response);
//    }
//
//    // ========== Admission Process ==========
//    @PostMapping("/admissions/run")
//    public ResponseEntity<ApiResponse<String>> runAdmissionProcess() {
//        ApiResponse<String> response = admissionService.runAdmissionProcess();
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/admissions/notify")
//    public ResponseEntity<ApiResponse<String>> notifyStudents() {
//        ApiResponse<String> response = admissionService.notifyStudents();
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/admissions/results")
//    public ResponseEntity<ApiResponse<List<AdmissionResultDTO>>> getAdmissionResults() {
//        ApiResponse<List<AdmissionResultDTO>> response = admissionService.getAllResults();
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/admissions/statistics")
//    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdmissionStatistics() {
//        ApiResponse<Map<String, Object>> response = admissionService.getAdmissionStatistics();
//        return ResponseEntity.ok(response);
//    }
//
//    // ========== Student Management ==========
//    @GetMapping("/students")
//    public ResponseEntity<ApiResponse<List<StudentProfileDTO>>> getAllStudents() {
//        List<StudentProfile> students = profileRepository.findAllWithUserAndMentor();
//        List<StudentProfileDTO> dtos = students.stream()
//                .map(this::toProfileDTO)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(ApiResponse.success("Students retrieved", dtos));
//    }
//
//    @GetMapping("/students/{id}")
//    public ResponseEntity<ApiResponse<StudentProfileDTO>> getStudentById(@PathVariable Long id) {
//        StudentProfile student = profileRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//        return ResponseEntity.ok(ApiResponse.success("Student retrieved", toProfileDTO(student)));
//    }
//
//    private StudentProfileDTO toProfileDTO(StudentProfile profile) {
//        return StudentProfileDTO.builder()
//                .id(profile.getId())
//                .userId(profile.getUser().getId())
//                .applicationNumber(profile.getApplicationNumber())
//                .email(profile.getUser().getEmail())
//                .fullName(profile.getUser().getFullName())
//                .phone(profile.getPhone())
//                .dateOfBirth(profile.getDateOfBirth())
//                .gender(profile.getGender() != null ? profile.getGender().name() : null)
//                .stream(profile.getStream() != null ? profile.getStream().name() : null)
//                .cutoffScore(profile.getCutoffScore())
//                .verificationStatus(profile.getVerificationStatus().name())
//                .verificationRemarks(profile.getVerificationRemarks())
//                .registrationStatus(profile.getRegistrationStatus().name())
//                .studentGroupNumber(profile.getStudentGroupNumber())
//                .assignedMentorId(profile.getAssignedMentor() != null ? profile.getAssignedMentor().getId() : null)
//                .assignedMentorName(profile.getAssignedMentor() != null ? profile.getAssignedMentor().getFullName() : null)
//                .createdAt(profile.getCreatedAt())
//                .build();
//    }
//}



package com.college.erp.admissions.controller;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.AdmissionResult;
import com.college.erp.admissions.entity.Department;
import com.college.erp.admissions.entity.StudentProfile;
import com.college.erp.admissions.repository.AdmissionResultRepository;
import com.college.erp.admissions.repository.AdDepartmentRepository;
import com.college.erp.admissions.repository.StudentProfileRepository;
import com.college.erp.admissions.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admissions Admin Controller.
 * All admin operations for the admissions module live at /api/ad/admin/**.
 */
@RestController
@RequestMapping("/api/ad/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    private final AdmiUserService admiUserService;
    private final AdmiDepartmentService admiDepartmentService;
    private final AdmiStaffService admiStaffService;
    private final AdmissionService admissionService;
    private final SystemConfigService systemConfigService;
    private final StudentProfileRepository profileRepository;
    private final AdmissionResultRepository admissionResultRepository;
    private final AdDepartmentRepository departmentRepository;

    // ========== Dashboard ==========
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getDashboard() {
        long totalStudents = profileRepository.count();
        long pending = profileRepository.countByVerificationStatus(
                StudentProfile.VerificationStatus.PENDING);
        long verified = profileRepository.countByVerificationStatus(
                StudentProfile.VerificationStatus.VERIFIED);
        long correctionRequested = profileRepository.countByVerificationStatus(
                StudentProfile.VerificationStatus.CORRECTION_REQUESTED);

        List<Department> departments = departmentRepository.findAll();
        long totalSeats = departments.stream().mapToLong(Department::getTotalSeats).sum();

        long allotted = admissionResultRepository.countByAllocationStatus(
                AdmissionResult.AllocationStatus.ALLOTTED);
        long notAllotted = admissionResultRepository.countByAllocationStatus(
                AdmissionResult.AllocationStatus.NOT_ALLOTTED);
        long accepted = admissionResultRepository.countByOfferStatus(
                AdmissionResult.OfferStatus.ACCEPTED);
        long declined = admissionResultRepository.countByOfferStatus(
                AdmissionResult.OfferStatus.DECLINED);

        String regStatus = systemConfigService.getRegistrationWindowStatus();

        AdminDashboardDTO dashboard = AdminDashboardDTO.builder()
                .totalStudents(totalStudents)
                .pendingVerification(pending)
                .verified(verified)
                .correctionRequested(correctionRequested)
                .totalDepartments((long) departments.size())
                .totalSeatsAvailable(totalSeats)
                .allottedStudents(allotted)
                .notAllottedStudents(notAllotted)
                .acceptedOffers(accepted)
                .declinedOffers(declined)
                .registrationWindowStatus(regStatus)
                .admissionProcessStatus("COMPLETED")
                .build();

        return ResponseEntity.ok(ApiResponse.success("Dashboard retrieved", dashboard));
    }

    // ========== Registration Window ==========
    @PostMapping("/registration/toggle")
    public ResponseEntity<ApiResponse<String>> toggleRegistrationWindow() {
        ApiResponse<String> response = systemConfigService.toggleRegistrationWindow();
        return ResponseEntity.ok(response);
    }

    // ========== Staff Management ==========
    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllStaff() {
        ApiResponse<List<UserDTO>> response = admiUserService.getAllStaff();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserDTO>> createStaff(
            @Valid @RequestBody CreateStaffRequest request) {
        ApiResponse<UserDTO> response = admiUserService.createStaff(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/staff/{staffId}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long staffId) {
        ApiResponse<Void> response = admiUserService.deleteStaff(staffId);
        return ResponseEntity.ok(response);
    }

    // ========== Department Management ==========
    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        ApiResponse<List<DepartmentDTO>> response = admiDepartmentService.getAllDepartments();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(
            @Valid @RequestBody CreateDepartmentRequest request) {
        ApiResponse<DepartmentDTO> response = admiDepartmentService.createDepartment(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDepartmentRequest request) {
        ApiResponse<DepartmentDTO> response = admiDepartmentService.updateDepartment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        ApiResponse<Void> response = admiDepartmentService.deleteDepartment(id);
        return ResponseEntity.ok(response);
    }

    // ========== Mentor Assignment ==========
    @PostMapping("/assign-mentors/random")
    public ResponseEntity<ApiResponse<Void>> assignMentorsRandomly() {
        ApiResponse<Void> response = admiStaffService.assignMentorsRandomly();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign-mentor")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> reassignMentor(
            @Valid @RequestBody AssignMentorRequest request) {
        ApiResponse<StudentProfileDTO> response = admiStaffService.reassignMentor(
                request.getStudentProfileId(),
                request.getMentorId()
        );
        return ResponseEntity.ok(response);
    }

    // ========== Admission Process ==========
    @PostMapping("/admissions/run")
    public ResponseEntity<ApiResponse<String>> runAdmissionProcess() {
        ApiResponse<String> response = admissionService.runAdmissionProcess();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admissions/notify")
    public ResponseEntity<ApiResponse<String>> notifyStudents() {
        ApiResponse<String> response = admissionService.notifyStudents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admissions/results")
    public ResponseEntity<ApiResponse<List<AdmissionResultDTO>>> getAdmissionResults() {
        ApiResponse<List<AdmissionResultDTO>> response = admissionService.getAllResults();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admissions/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdmissionStatistics() {
        ApiResponse<Map<String, Object>> response = admissionService.getAdmissionStatistics();
        return ResponseEntity.ok(response);
    }

    // ========== Student Management ==========
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfileDTO>>> getAllStudents() {
        List<StudentProfile> students = profileRepository.findAllWithUserAndMentor();
        List<StudentProfileDTO> dtos = students.stream()
                .map(this::toProfileDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", dtos));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getStudentById(@PathVariable Long id) {
        StudentProfile student = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(ApiResponse.success("Student retrieved", toProfileDTO(student)));
    }

    private StudentProfileDTO toProfileDTO(StudentProfile profile) {
        return StudentProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .applicationNumber(profile.getApplicationNumber())
                .email(profile.getUser().getEmail())
                .fullName(profile.getUser().getFullName())
                .phone(profile.getPhone())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender() != null ? profile.getGender().name() : null)
                .stream(profile.getStream() != null ? profile.getStream().name() : null)
                .cutoffScore(profile.getCutoffScore())
                .verificationStatus(profile.getVerificationStatus().name())
                .verificationRemarks(profile.getVerificationRemarks())
                .registrationStatus(profile.getRegistrationStatus().name())
                .studentGroupNumber(profile.getStudentGroupNumber())
                .assignedMentorId(profile.getAssignedMentor() != null ? profile.getAssignedMentor().getId() : null)
                .assignedMentorName(profile.getAssignedMentor() != null ? profile.getAssignedMentor().getFullName() : null)
                .createdAt(profile.getCreatedAt())
                .build();
    }
}