//
//package com.college.erp.admissions.service;
//
//import com.college.erp.admissions.dto.*;
//import com.college.erp.admissions.entity.*;
//import com.college.erp.admissions.repository.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class AdmissionService {
//
//    private final StudentProfileRepository profileRepository;
//    private final StudentPreferenceRepository preferenceRepository;
//    private final AdDepartmentRepository adDepartmentRepository;
//    private final AdmissionResultRepository admissionResultRepository;
//    private final OfferResponseRepository offerResponseRepository;
//    private final AdmiDepartmentService admiDepartmentService;
//    private final EmailService emailService;
//
//    /**
//     * Main admissions allocation algorithm
//     * Allocates departments to students based on:
//     * 1. Highest cutoff score first
//     * 2. For tied cutoffs: earliest registration (createdAt)
//     * 3. Student's preference order
//     * 4. Seat availability
//     */
//    @Transactional
//    public ApiResponse<String> runAdmissionProcess() {
//        try {
//            log.info("Starting admissions allocation process");
//
//            // Clear existing results
//            admissionResultRepository.deleteAll();
//
//            // Reset all department seats
//            admiDepartmentService.resetAllSeats();
//
//            // Get all verified students ordered by cutoff (desc) and registration time (asc)
//            List<StudentProfile> eligibleStudents = profileRepository.findAllVerifiedStudentsForAdmission();
//
//            if (eligibleStudents.isEmpty()) {
//                return ApiResponse.error("No eligible students found for admissions");
//            }
//
//            log.info("Processing {} eligible students", eligibleStudents.size());
//
//            int allocated = 0;
//            int notAllocated = 0;
//
//            // Process each student in order
//            for (StudentProfile student : eligibleStudents) {
//                boolean allotted = allocateDepartment(student);
//                if (allotted) {
//                    allocated++;
//                } else {
//                    notAllocated++;
//                }
//            }
//
//            String message = String.format(
//                    "Admission process completed. Allocated: %d, Not Allocated: %d",
//                    allocated, notAllocated
//            );
//
//            log.info(message);
//            return ApiResponse.success(message, null);
//
//        } catch (Exception e) {
//            log.error("Admission process failed", e);
//            return ApiResponse.error("Admission process failed: " + e.getMessage());
//        }
//    }
//
//    /**
//     * Allocate department to a single student based on their preferences
//     */
//    private boolean allocateDepartment(StudentProfile student) {
//        // Get student preferences in order
//        List<StudentPreference> preferences = preferenceRepository
//                .findByStudentProfileIdOrderByPreferenceOrderAsc(student.getId());
//
//        if (preferences.isEmpty()) {
//            createNotAllottedResult(student, "No preferences submitted");
//            return false;
//        }
//
//        // Try to allocate based on preferences
//        for (StudentPreference preference : preferences) {
//            Department department = preference.getDepartment();
//
//            // Check if department is active and has seats
//            if (department.getIsActive() && department.getAvailableSeats() > 0) {
//                // Allocate this department
//                department.setAvailableSeats(department.getAvailableSeats() - 1);
//                adDepartmentRepository.save(department);
//
//                createAllottedResult(student, department);
//                log.info("Allocated {} to {} (Cutoff: {})",
//                        student.getApplicationNumber(),
//                        department.getCode(),
//                        student.getCutoffScore());
//                return true;
//            }
//        }
//
//        // No seats available in any preferred department
//        createNotAllottedResult(student, "No seats available in preferred departments");
//        log.info("Not allocated: {} (Cutoff: {})",
//                student.getApplicationNumber(),
//                student.getCutoffScore());
//        return false;
//    }
//
//    /**
//     * Create admissions result for allotted student
//     */
//    private void createAllottedResult(StudentProfile student, Department department) {
//        String token = UUID.randomUUID().toString();
//
//        AdmissionResult result = AdmissionResult.builder()
//                .studentProfile(student)
//                .allocatedDepartment(department)
//                .allocationStatus(AdmissionResult.AllocationStatus.ALLOTTED)
//                .cutoffScoreAtAllocation(student.getCutoffScore())
//                .offerStatus(AdmissionResult.OfferStatus.PENDING)
//                .offerResponseToken(token)
//                .notificationSent(false)
//                .build();
//
//        admissionResultRepository.save(result);
//    }
//
//    /**
//     * Create admissions result for not allotted student
//     */
//    private void createNotAllottedResult(StudentProfile student, String reason) {
//        AdmissionResult result = AdmissionResult.builder()
//                .studentProfile(student)
//                .allocationStatus(AdmissionResult.AllocationStatus.NOT_ALLOTTED)
//                .cutoffScoreAtAllocation(student.getCutoffScore())
//                .offerStatus(AdmissionResult.OfferStatus.PENDING)
//                .notificationSent(false)
//                .build();
//
//        admissionResultRepository.save(result);
//    }
//
//    /**
//     * Send notifications to all students with admissions results
//     */
//    @Transactional
//    public ApiResponse<String> notifyStudents() {
//        try {
//            List<AdmissionResult> pendingNotifications = admissionResultRepository.findPendingNotifications();
//
//            if (pendingNotifications.isEmpty()) {
//                return ApiResponse.error("No pending notifications found");
//            }
//
//            int successCount = 0;
//            int failureCount = 0;
//
//            for (AdmissionResult result : pendingNotifications) {
//                try {
//                    if (result.getAllocationStatus() == AdmissionResult.AllocationStatus.ALLOTTED) {
//                        emailService.sendAllocationEmail(result);
//                    } else {
//                        emailService.sendRejectionEmail(result);
//                    }
//
//                    result.setNotificationSent(true);
//                    result.setNotificationSentAt(LocalDateTime.now());
//                    admissionResultRepository.save(result);
//                    successCount++;
//
//                } catch (Exception e) {
//                    log.error("Failed to send notification to {}",
//                            result.getStudentProfile().getUser().getEmail(), e);
//                    failureCount++;
//                }
//            }
//
//            String message = String.format(
//                    "Notifications sent. Success: %d, Failed: %d",
//                    successCount, failureCount
//            );
//
//            return ApiResponse.success(message, null);
//
//        } catch (Exception e) {
//            return ApiResponse.error("Failed to send notifications: " + e.getMessage());
//        }
//    }
//
//    /**
//     * Handle student offer response (Accept/Decline)
//     */
//    @Transactional
//    public ApiResponse<String> respondToOffer(String token, String response, String ipAddress, String userAgent) {
//        try {
//            AdmissionResult result = admissionResultRepository.findByOfferResponseToken(token)
//                    .orElseThrow(() -> new RuntimeException("Invalid or expired token"));
//
//            if (result.getOfferStatus() != AdmissionResult.OfferStatus.PENDING) {
//                return ApiResponse.error("Offer already responded to");
//            }
//
//            AdmissionResult.OfferStatus newStatus = response.equalsIgnoreCase("ACCEPT")
//                    ? AdmissionResult.OfferStatus.ACCEPTED
//                    : AdmissionResult.OfferStatus.DECLINED;
//
//            result.setOfferStatus(newStatus);
//            result.setOfferResponseAt(LocalDateTime.now());
//            admissionResultRepository.save(result);
//
//            // Create audit record
//            OfferResponse.ResponseType responseType = response.equalsIgnoreCase("ACCEPT")
//                    ? OfferResponse.ResponseType.ACCEPTED
//                    : OfferResponse.ResponseType.DECLINED;
//
//            OfferResponse auditRecord = OfferResponse.builder()
//                    .admissionResult(result)
//                    .responseType(responseType)
//                    .ipAddress(ipAddress)
//                    .userAgent(userAgent)
//                    .build();
//
//            offerResponseRepository.save(auditRecord);
//
//            // Send confirmation email
//            emailService.sendOfferResponseConfirmation(result);
//
//            String message = String.format("Offer %s successfully",
//                    response.equalsIgnoreCase("ACCEPT") ? "accepted" : "declined");
//
//            return ApiResponse.success(message, null);
//
//        } catch (Exception e) {
//            return ApiResponse.error("Failed to process response: " + e.getMessage());
//        }
//    }
//
//    /**
//     * Get all admissions results
//     */
//    public ApiResponse<List<AdmissionResultDTO>> getAllResults() {
//        try {
//            List<AdmissionResult> results = admissionResultRepository.findAllWithDetails();
//            List<AdmissionResultDTO> dtos = results.stream()
//                    .map(this::toDTO)   // was toAdmissionResultDTO, correct name is toDTO
//                    .collect(Collectors.toList());
//            return ApiResponse.success("Results retrieved", dtos);
//        } catch (Exception e) {
//            return ApiResponse.error(e.getMessage());
//        }
//    }
//
//    /**
//     * Get admissions statistics
//     */
//    public ApiResponse<Map<String, Object>> getAdmissionStatistics() {
//        Map<String, Object> stats = new HashMap<>();
//
//        long totalStudents = profileRepository.count();
//        long verifiedStudents = profileRepository.countByVerificationStatus(StudentProfile.VerificationStatus.VERIFIED);
//        long allottedCount = admissionResultRepository.countByAllocationStatus(AdmissionResult.AllocationStatus.ALLOTTED);
//        long notAllottedCount = admissionResultRepository.countByAllocationStatus(AdmissionResult.AllocationStatus.NOT_ALLOTTED);
//        long acceptedCount = admissionResultRepository.countByOfferStatus(AdmissionResult.OfferStatus.ACCEPTED);
//        long declinedCount = admissionResultRepository.countByOfferStatus(AdmissionResult.OfferStatus.DECLINED);
//        long pendingCount = admissionResultRepository.countByOfferStatus(AdmissionResult.OfferStatus.PENDING);
//
//        stats.put("totalStudents", totalStudents);
//        stats.put("verifiedStudents", verifiedStudents);
//        stats.put("allotted", allottedCount);
//        stats.put("notAllotted", notAllottedCount);
//        stats.put("accepted", acceptedCount);
//        stats.put("declined", declinedCount);
//        stats.put("pending", pendingCount);
//
//        // Department-wise allocation
//        List<Department> departments = adDepartmentRepository.findAll();
//        List<Map<String, Object>> deptStats = new ArrayList<>();
//
//        for (Department dept : departments) {
//            Map<String, Object> deptStat = new HashMap<>();
//            deptStat.put("code", dept.getCode());
//            deptStat.put("name", dept.getName());
//            deptStat.put("totalSeats", dept.getTotalSeats());
//            deptStat.put("availableSeats", dept.getAvailableSeats());
//            deptStat.put("allocatedSeats", dept.getTotalSeats() - dept.getAvailableSeats());
//            deptStats.add(deptStat);
//        }
//
//        stats.put("departmentStatistics", deptStats);
//
//        return ApiResponse.success("Statistics retrieved", stats);
//    }
//
//    private AdmissionResultDTO toDTO(AdmissionResult result) {
//        return AdmissionResultDTO.builder()
//                .id(result.getId())
//                .studentProfileId(result.getStudentProfile().getId())
//                .studentName(result.getStudentProfile().getUser().getFullName())
//                .applicationNumber(result.getStudentProfile().getApplicationNumber())
//                .cutoffScore(result.getCutoffScoreAtAllocation())
//                .allocatedDepartmentId(result.getAllocatedDepartment() != null ? result.getAllocatedDepartment().getId() : null)
//                .allocatedDepartmentCode(result.getAllocatedDepartment() != null ? result.getAllocatedDepartment().getCode() : null)
//                .allocatedDepartmentName(result.getAllocatedDepartment() != null ? result.getAllocatedDepartment().getName() : null)
//                .allocationStatus(result.getAllocationStatus().name())
//                .offerStatus(result.getOfferStatus().name())
//                .notificationSent(result.getNotificationSent())
//                .allocatedAt(result.getAllocatedAt())
//                .offerResponseAt(result.getOfferResponseAt())
//                .build();
//    }
//}

package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.*;
import com.college.erp.admissions.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Core admissions allocation and notification service.
 *
 * Key fix: getAllResults() now calls findAllWithDetails() (FETCH JOIN query)
 * instead of findAll(), which prevented LazyInitializationException on
 * studentProfile.user and allocatedDepartment navigation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final StudentProfileRepository profileRepository;
    private final StudentPreferenceRepository preferenceRepository;
    private final AdDepartmentRepository adDepartmentRepository;
    private final AdmissionResultRepository admissionResultRepository;
    private final OfferResponseRepository offerResponseRepository;
    private final AdmiDepartmentService admiDepartmentService;
    private final EmailService emailService;

    /**
     * Main admissions allocation — runs the seat-allocation algorithm.
     * Priority: highest cutoff score first; ties broken by earliest createdAt.
     */
    @Transactional
    public ApiResponse<String> runAdmissionProcess() {
        try {
            log.info("Starting admissions allocation process");

            // Clear previous results and reset seats
            admissionResultRepository.deleteAll();
            admiDepartmentService.resetAllSeats();

            List<StudentProfile> eligible = profileRepository.findAllVerifiedStudentsForAdmission();
            if (eligible.isEmpty()) {
                return ApiResponse.error("No eligible students found for admissions");
            }

            log.info("Processing {} eligible students", eligible.size());

            for (StudentProfile student : eligible) {
                List<StudentPreference> preferences =
                        preferenceRepository.findByStudentProfileIdOrderByPreferenceOrderAsc(student.getId());

                AdmissionResult result = allocateDepartment(student, preferences);
                admissionResultRepository.save(result);
            }

            long allotted = admissionResultRepository.countByAllocationStatus(
                    AdmissionResult.AllocationStatus.ALLOTTED);
            long notAllotted = admissionResultRepository.countByAllocationStatus(
                    AdmissionResult.AllocationStatus.NOT_ALLOTTED);

            return ApiResponse.success(
                    String.format("Admission process complete. Allotted: %d, Not Allotted: %d",
                            allotted, notAllotted),
                    null
            );
        } catch (Exception e) {
            log.error("Admission process failed", e);
            return ApiResponse.error("Admission process failed: " + e.getMessage());
        }
    }

    private AdmissionResult allocateDepartment(StudentProfile student,
                                               List<StudentPreference> preferences) {
        for (StudentPreference pref : preferences) {
            Department dept = pref.getDepartment();

            // Reload fresh to get current availableSeats
            dept = adDepartmentRepository.findById(dept.getId()).orElse(dept);

            if (dept.getAvailableSeats() > 0) {
                // Decrement seat
                adDepartmentRepository.decrementAvailableSeats(dept.getId());

                return AdmissionResult.builder()
                        .studentProfile(student)
                        .allocatedDepartment(dept)
                        .cutoffScoreAtAllocation(student.getCutoffScore())
                        .allocationStatus(AdmissionResult.AllocationStatus.ALLOTTED)
                        .offerStatus(AdmissionResult.OfferStatus.PENDING)
                        .notificationSent(false)
                        .allocatedAt(LocalDateTime.now())
                        .build();
            }
        }

        // No seat found in any preferred department
        return AdmissionResult.builder()
                .studentProfile(student)
                .allocatedDepartment(null)
                .cutoffScoreAtAllocation(student.getCutoffScore())
                .allocationStatus(AdmissionResult.AllocationStatus.NOT_ALLOTTED)
                .offerStatus(AdmissionResult.OfferStatus.PENDING)
                .notificationSent(false)
                .allocatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Sends email notifications to all students with unsent results.
     */
    @Transactional
    public ApiResponse<String> notifyStudents() {
        try {
            List<AdmissionResult> pending = admissionResultRepository.findPendingNotifications();

            if (pending.isEmpty()) {
                return ApiResponse.success("No pending notifications", null);
            }

            int sent = 0;
            int failed = 0;
            for (AdmissionResult result : pending) {
                try {
                    // Use the correct EmailService method names from the working module
                    if (result.getAllocationStatus() == AdmissionResult.AllocationStatus.ALLOTTED) {
                        emailService.sendAllocationEmail(result);
                    } else {
                        emailService.sendRejectionEmail(result);
                    }
                    result.setNotificationSent(true);
                    admissionResultRepository.save(result);
                    sent++;
                } catch (Exception e) {
                    log.warn("Failed to notify student {}: {}",
                            result.getStudentProfile().getUser().getEmail(), e.getMessage());
                    failed++;
                }
            }

            return ApiResponse.success(
                    String.format("Notifications sent: %d of %d (failed: %d)",
                            sent, pending.size(), failed), null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to send notifications: " + e.getMessage());
        }
    }

    /**
     * Student responds to their offer (Accept/Decline via email link).
     */
    @Transactional
    public ApiResponse<String> respondToOffer(String token, String response,
                                              String ipAddress, String userAgent) {
        try {
            AdmissionResult result = admissionResultRepository
                    .findByOfferResponseToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

            if (result.getOfferStatus() != AdmissionResult.OfferStatus.PENDING) {
                return ApiResponse.error("Offer has already been responded to");
            }

            boolean accepted = "ACCEPT".equalsIgnoreCase(response);

            result.setOfferStatus(accepted
                    ? AdmissionResult.OfferStatus.ACCEPTED
                    : AdmissionResult.OfferStatus.DECLINED);
            result.setOfferResponseAt(LocalDateTime.now());

            // If declined, release the seat
            if (!accepted && result.getAllocatedDepartment() != null) {
                adDepartmentRepository.resetAvailableSeats(result.getAllocatedDepartment().getId());
            }

            admissionResultRepository.save(result);

            // Audit trail
            OfferResponse auditRecord = OfferResponse.builder()
                    .admissionResult(result)
                    .responseType(accepted
                            ? OfferResponse.ResponseType.ACCEPTED
                            : OfferResponse.ResponseType.DECLINED)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();
            offerResponseRepository.save(auditRecord);

            emailService.sendOfferResponseConfirmation(result);

            return ApiResponse.success(
                    String.format("Offer %s successfully", accepted ? "accepted" : "declined"), null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to process response: " + e.getMessage());
        }
    }

    /**
     * Returns all admission results with full join (avoids LazyInitializationException).
     */
    public ApiResponse<List<AdmissionResultDTO>> getAllResults() {
        // ← Key fix: use findAllWithDetails() (FETCH JOIN) instead of findAll()
        List<AdmissionResultDTO> results = admissionResultRepository.findAllWithDetails()
                .stream()
                .map(this::toDTO)
                .sorted(Comparator.comparing(AdmissionResultDTO::getCutoffScore,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        return ApiResponse.success("Admission results retrieved", results);
    }

    /**
     * Returns aggregate statistics for the admin dashboard.
     */
    public ApiResponse<Map<String, Object>> getAdmissionStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalStudents", profileRepository.count());
        stats.put("verifiedStudents",
                profileRepository.countByVerificationStatus(StudentProfile.VerificationStatus.VERIFIED));
        stats.put("allotted",
                admissionResultRepository.countByAllocationStatus(AdmissionResult.AllocationStatus.ALLOTTED));
        stats.put("notAllotted",
                admissionResultRepository.countByAllocationStatus(AdmissionResult.AllocationStatus.NOT_ALLOTTED));
        stats.put("accepted",
                admissionResultRepository.countByOfferStatus(AdmissionResult.OfferStatus.ACCEPTED));
        stats.put("declined",
                admissionResultRepository.countByOfferStatus(AdmissionResult.OfferStatus.DECLINED));
        stats.put("pending",
                admissionResultRepository.countByOfferStatus(AdmissionResult.OfferStatus.PENDING));

        // Department-wise allocation
        List<Department> departments = adDepartmentRepository.findAll();
        List<Map<String, Object>> deptStats = departments.stream().map(dept -> {
            Map<String, Object> d = new HashMap<>();
            d.put("code", dept.getCode());
            d.put("name", dept.getName());
            d.put("totalSeats", dept.getTotalSeats());
            d.put("availableSeats", dept.getAvailableSeats());
            d.put("allocatedSeats", dept.getTotalSeats() - dept.getAvailableSeats());
            return d;
        }).collect(Collectors.toList());

        stats.put("departmentStatistics", deptStats);

        return ApiResponse.success("Statistics retrieved", stats);
    }

    // ── DTO mapper ──────────────────────────────────────────────────────────
    private AdmissionResultDTO toDTO(AdmissionResult result) {
        return AdmissionResultDTO.builder()
                .id(result.getId())
                .studentProfileId(result.getStudentProfile().getId())
                .studentName(result.getStudentProfile().getUser().getFullName())
                .applicationNumber(result.getStudentProfile().getApplicationNumber())
                .cutoffScore(result.getCutoffScoreAtAllocation())
                .allocatedDepartmentId(
                        result.getAllocatedDepartment() != null
                                ? result.getAllocatedDepartment().getId() : null)
                .allocatedDepartmentCode(
                        result.getAllocatedDepartment() != null
                                ? result.getAllocatedDepartment().getCode() : null)
                .allocatedDepartmentName(
                        result.getAllocatedDepartment() != null
                                ? result.getAllocatedDepartment().getName() : null)
                .allocationStatus(result.getAllocationStatus().name())
                .offerStatus(result.getOfferStatus().name())
                .notificationSent(result.getNotificationSent())
                .allocatedAt(result.getAllocatedAt())
                .offerResponseAt(result.getOfferResponseAt())
                .build();
    }
}