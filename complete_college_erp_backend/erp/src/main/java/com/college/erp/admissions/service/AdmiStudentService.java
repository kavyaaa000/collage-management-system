package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.*;
import com.college.erp.admissions.repository.*;
import com.college.erp.security.UnifiedSecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class AdmiStudentService {

    private final StudentProfileRepository profileRepository;
    private final StudentMarksRepository marksRepository;
    private final StudentPreferenceRepository preferenceRepository;
    private final StudentDocumentRepository documentRepository;
    private final AdmissionResultRepository admissionResultRepository;
    private final AdDepartmentRepository adDepartmentRepository;
    private final UnifiedSecurityUtil securityUtil;
    private final SystemConfigService configService;
    private final EmailService emailService;

    public ApiResponse<StudentProfileDTO> getMyProfile() {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));
            return ApiResponse.success("Profile retrieved", toProfileDTO(profile));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }


    @Transactional("admissionsTransactionManager")
    public ApiResponse<StudentProfileDTO> updateMyProfile(UpdateStudentProfileRequest request) {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            if (profile.getVerificationStatus() == StudentProfile.VerificationStatus.VERIFIED) {
                return ApiResponse.error("Cannot edit verified profile");
            }

            profile.setPhone(request.getPhone());
            profile.setDateOfBirth(request.getDateOfBirth());
            profile.setGender(StudentProfile.Gender.valueOf(request.getGender()));
            profile.setAddress(request.getAddress());
            profile.setCity(request.getCity());
            profile.setState(request.getState());
            profile.setPincode(request.getPincode());
            profile.setStream(StudentProfile.Stream.valueOf(request.getStream()));
            profile.setVerificationStatus(StudentProfile.VerificationStatus.PENDING);

            // **FIX: Recalculate cutoff if marks exist and stream changed**
            StudentMarks marks = marksRepository.findByStudentProfileId(profile.getId())
                    .orElse(null);
            if (marks != null) {
                BigDecimal cutoff = calculateCutoff(profile.getStream(), marks);
                profile.setCutoffScore(cutoff);
            }

            profile = profileRepository.save(profile);
            return ApiResponse.success("Profile updated successfully", toProfileDTO(profile));

        } catch (Exception e) {
            log.error("Failed to update profile", e);
            return ApiResponse.error("Failed to update profile: " + e.getMessage());
        }
    }
//    @Transactional("admissionsTransactionManager")
//    public ApiResponse<StudentProfileDTO> updateMyProfile(UpdateStudentProfileRequest request) {
//        try {
//            Long userId = securityUtil.getCurrentUserId();
//            StudentProfile profile = profileRepository.findByUserId(userId)
//                    .orElseThrow(() -> new RuntimeException("Profile not found"));
//
//            if (profile.getVerificationStatus() == StudentProfile.VerificationStatus.VERIFIED) {
//                return ApiResponse.error("Cannot edit verified profile");
//            }
//
//            profile.setPhone(request.getPhone());
//            profile.setDateOfBirth(request.getDateOfBirth());
//            profile.setGender(StudentProfile.Gender.valueOf(request.getGender()));
//            profile.setAddress(request.getAddress());
//            profile.setCity(request.getCity());
//            profile.setState(request.getState());
//            profile.setPincode(request.getPincode());
//            profile.setStream(StudentProfile.Stream.valueOf(request.getStream()));
//            profile.setVerificationStatus(StudentProfile.VerificationStatus.PENDING);
//
//            profile = profileRepository.save(profile);
//            return ApiResponse.success("Profile updated successfully", toProfileDTO(profile));
//
//        } catch (Exception e) {
//            return ApiResponse.error("Failed to update profile: " + e.getMessage());
//        }
//    }

    @Transactional("admissionsTransactionManager")
    public ApiResponse<StudentMarksDTO> updateMyMarks(UpdateMarksRequest request) {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            if (profile.getVerificationStatus() == StudentProfile.VerificationStatus.VERIFIED) {
                return ApiResponse.error("Cannot edit marks after verification");
            }

            // Validate marks based on stream
            if (profile.getStream() == StudentProfile.Stream.BIO_MATHS) {
                if (request.getMathsMarks() == null) {
                    return ApiResponse.error("Maths marks required for Bio-Maths stream");
                }
            } else if (profile.getStream() == StudentProfile.Stream.COMPUTER_SCIENCE) {
                if (request.getComputerScienceMarks() == null) {
                    return ApiResponse.error("Computer Science marks required for CS stream");
                }
            }

            StudentMarks marks = marksRepository.findByStudentProfileId(profile.getId())
                    .orElse(StudentMarks.builder().studentProfile(profile).build());

            marks.setPhysicsMarks(request.getPhysicsMarks());
            marks.setChemistryMarks(request.getChemistryMarks());
            marks.setMathsMarks(request.getMathsMarks());
            marks.setComputerScienceMarks(request.getComputerScienceMarks());

            marks = marksRepository.save(marks);

            // Calculate cutoff
            BigDecimal cutoff = calculateCutoff(profile.getStream(), marks);
            profile.setCutoffScore(cutoff);
            profile.setVerificationStatus(StudentProfile.VerificationStatus.PENDING);
            profileRepository.save(profile);

            return ApiResponse.success("Marks updated successfully", toMarksDTO(marks));

        } catch (Exception e) {
            return ApiResponse.error("Failed to update marks: " + e.getMessage());
        }
    }

    private BigDecimal calculateCutoff(StudentProfile.Stream stream, StudentMarks marks) {
        BigDecimal cutoff;
        BigDecimal physicsHalf = marks.getPhysicsMarks().divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);
        BigDecimal chemistryHalf = marks.getChemistryMarks().divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);

        if (stream == StudentProfile.Stream.BIO_MATHS) {
            cutoff = marks.getMathsMarks().add(physicsHalf).add(chemistryHalf);
        } else {
            cutoff = marks.getComputerScienceMarks().add(physicsHalf).add(chemistryHalf);
        }

        return cutoff.setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional("admissionsTransactionManager")
    public ApiResponse<List<StudentPreferenceDTO>> updateMyPreferences(UpdatePreferencesRequest request) {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            if (profile.getVerificationStatus() == StudentProfile.VerificationStatus.VERIFIED) {
                return ApiResponse.error("Cannot edit preferences after verification");
            }

            // Delete existing preferences
            preferenceRepository.deleteByStudentProfileId(profile.getId());

            // Create new preferences
            List<StudentPreference> preferences = new ArrayList<>();
            for (UpdatePreferencesRequest.PreferenceItem item : request.getPreferences()) {
                Department dept = adDepartmentRepository.findById(item.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Department not found"));

                StudentPreference pref = StudentPreference.builder()
                        .studentProfile(profile)
                        .department(dept)
                        .preferenceOrder(item.getPreferenceOrder())
                        .build();
                preferences.add(pref);
            }

            preferences = preferenceRepository.saveAll(preferences);
            profile.setVerificationStatus(StudentProfile.VerificationStatus.PENDING);
            profileRepository.save(profile);

            List<StudentPreferenceDTO> dtos = preferences.stream()
                    .map(this::toPreferenceDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Preferences updated successfully", dtos);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update preferences: " + e.getMessage());
        }
    }

    @Transactional("admissionsTransactionManager")
    public ApiResponse<Void> submitRegistration() {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            // Validate completion
            if (profile.getPhone() == null || profile.getDateOfBirth() == null) {
                return ApiResponse.error("Please complete your profile");
            }

            StudentMarks marks = marksRepository.findByStudentProfileId(profile.getId())
                    .orElse(null);
            if (marks == null || profile.getCutoffScore() == null) {
                return ApiResponse.error("Please enter your marks");
            }

            long prefsCount = preferenceRepository.countByStudentProfileId(profile.getId());
            if (prefsCount == 0) {
                return ApiResponse.error("Please select department preferences");
            }

            List<StudentDocument> docs = documentRepository.findByStudentProfileId(profile.getId());
            if (docs.size() < 3) { // Minimum required documents
                return ApiResponse.error("Please upload all required documents");
            }

            profile.setRegistrationStatus(StudentProfile.RegistrationStatus.SUBMITTED);
            profileRepository.save(profile);

            return ApiResponse.success("Registration submitted successfully", null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to submit registration: " + e.getMessage());
        }
    }
//
//    public ApiResponse<StudentDashboardDTO> getMyDashboard() {
//        try {
//            Long userId = securityUtil.getCurrentUserId();
//            StudentProfile profile = profileRepository.findByUserId(userId)
//                    .orElseThrow(() -> new RuntimeException("Profile not found"));
//
//            StudentMarks marks = marksRepository.findByStudentProfileId(profile.getId()).orElse(null);
//            List<StudentPreference> prefs = preferenceRepository.findByStudentProfileIdOrderByPreferenceOrderAsc(profile.getId());
//            List<StudentDocument> docs = documentRepository.findByStudentProfileId(profile.getId());
//            AdmissionResult result = admissionResultRepository.findByStudentProfileId(profile.getId()).orElse(null);
//
//            String registrationStatus = configService.getRegistrationWindowStatus();
//
//            StudentDashboardDTO dashboard = StudentDashboardDTO.builder()
//                    .profile(toProfileDTO(profile))
//                    .marks(marks != null ? toMarksDTO(marks) : null)
//                    .preferences(prefs.stream().map(this::toPreferenceDTO).collect(Collectors.toList()))
//                    .documents(docs.stream().map(this::toDocumentDTO).collect(Collectors.toList()))
//                    .admissionResult(result != null ? toAdmissionResultDTO(result) : null)
//                    .registrationWindowStatus(registrationStatus)
//                    .build();
//
//            return ApiResponse.success("Dashboard retrieved", dashboard);
//
//        } catch (Exception e) {
//            return ApiResponse.error(e.getMessage());
//        }
//    }



    public ApiResponse<StudentDashboardDTO> getMyDashboard() {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            // Fetch marks - handle Optional properly
            StudentMarks marks = marksRepository.findByStudentProfileId(profile.getId())
                    .orElse(null);

            // Fetch preferences
            List<StudentPreference> prefs = preferenceRepository
                    .findByStudentProfileIdOrderByPreferenceOrderAsc(profile.getId());

            // Fetch documents
            List<StudentDocument> docs = documentRepository
                    .findByStudentProfileId(profile.getId());

            // Fetch admission result
            AdmissionResult result = admissionResultRepository
                    .findByStudentProfileId(profile.getId())
                    .orElse(null);

            // Get registration window status
            String registrationStatus = configService.getRegistrationWindowStatus();

            StudentDashboardDTO dashboard = StudentDashboardDTO.builder()
                    .profile(toProfileDTO(profile))
                    .marks(marks != null ? toMarksDTO(marks) : null)
                    .preferences(prefs.stream()
                            .map(this::toPreferenceDTO)
                            .collect(Collectors.toList()))
                    .documents(docs.stream()
                            .map(this::toDocumentDTO)
                            .collect(Collectors.toList()))
                    .admissionResult(result != null ? toAdmissionResultDTO(result) : null)
                    .registrationWindowStatus(registrationStatus)
                    .build();

            return ApiResponse.success("Dashboard retrieved", dashboard);

        } catch (Exception e) {
            log.error("Failed to load dashboard", e);
            return ApiResponse.error("Failed to load dashboard: " + e.getMessage());
        }
    }

    // DTO Mappers
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
                .address(profile.getAddress())
                .city(profile.getCity())
                .state(profile.getState())
                .pincode(profile.getPincode())
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

    private StudentMarksDTO toMarksDTO(StudentMarks marks) {
        return StudentMarksDTO.builder()
                .id(marks.getId())
                .studentProfileId(marks.getStudentProfile().getId())
                .physicsMarks(marks.getPhysicsMarks())
                .chemistryMarks(marks.getChemistryMarks())
                .mathsMarks(marks.getMathsMarks())
                .computerScienceMarks(marks.getComputerScienceMarks())
                .build();
    }

    private StudentPreferenceDTO toPreferenceDTO(StudentPreference pref) {
        return StudentPreferenceDTO.builder()
                .id(pref.getId())
                .departmentId(pref.getDepartment().getId())
                .departmentCode(pref.getDepartment().getCode())
                .departmentName(pref.getDepartment().getName())
                .preferenceOrder(pref.getPreferenceOrder())
                .build();
    }

    private StudentDocumentDTO toDocumentDTO(StudentDocument doc) {
        return StudentDocumentDTO.builder()
                .id(doc.getId())
                .studentProfileId(doc.getStudentProfile().getId())
                .documentType(doc.getDocumentType().name())
                .originalFilename(doc.getOriginalFilename())
                .storedFilename(doc.getStoredFilename())
                .fileSize(doc.getFileSize())
                .mimeType(doc.getMimeType())
                .uploadedAt(doc.getUploadedAt())
                .viewUrl("/api/documents/" + doc.getId() + "/view")
                .build();
    }

    private AdmissionResultDTO toAdmissionResultDTO(AdmissionResult result) {
        return AdmissionResultDTO.builder()
                .id(result.getId())
                .studentProfileId(result.getStudentProfile().getId())
                .studentName(result.getStudentProfile().getUser().getFullName())
                .applicationNumber(result.getStudentProfile().getApplicationNumber())
                .cutoffScore(result.getCutoffScoreAtAllocation())
                .allocatedDepartmentId(result.getAllocatedDepartment() != null ? result.getAllocatedDepartment().getId() : null)
                .allocatedDepartmentCode(result.getAllocatedDepartment() != null ? result.getAllocatedDepartment().getCode() : null)
                .allocatedDepartmentName(result.getAllocatedDepartment() != null ? result.getAllocatedDepartment().getName() : null)
                .allocationStatus(result.getAllocationStatus().name())
                .offerStatus(result.getOfferStatus().name())
                .notificationSent(result.getNotificationSent())
                .allocatedAt(result.getAllocatedAt())
                .offerResponseAt(result.getOfferResponseAt())
                .build();
    }

}