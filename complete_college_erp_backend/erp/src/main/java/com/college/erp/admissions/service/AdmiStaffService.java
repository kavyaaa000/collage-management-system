package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.*;
import com.college.erp.admissions.repository.*;
import com.college.erp.security.UnifiedSecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmiStaffService {

    private final StudentProfileRepository profileRepository;
    private final AdUserRepository adUserRepository;
    private final UnifiedSecurityUtil securityUtil;
    private final EmailService emailService;

    public ApiResponse<List<StudentProfileDTO>> getMyAssignedStudents() {
        try {
            Long staffId = securityUtil.getCurrentUserId();
            List<StudentProfile> students = profileRepository.findByAssignedMentorId(staffId);

            List<StudentProfileDTO> dtos = students.stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Assigned students retrieved", dtos);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    public ApiResponse<List<StudentProfileDTO>> getPendingVerifications() {
        try {
            Long staffId = securityUtil.getCurrentUserId();
            List<StudentProfile> students = profileRepository.findByMentorAndVerificationStatus(
                    staffId, StudentProfile.VerificationStatus.PENDING
            );

            List<StudentProfileDTO> dtos = students.stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Pending verifications retrieved", dtos);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<StudentProfileDTO> verifyStudent(Long studentProfileId) {
        try {
            Long staffId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findById(studentProfileId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            if (!profile.getAssignedMentor().getId().equals(staffId)) {
                return ApiResponse.error("Not authorized to verify this student");
            }

            profile.setVerificationStatus(StudentProfile.VerificationStatus.VERIFIED);
            profile.setVerificationRemarks("Verified successfully");
            profile = profileRepository.save(profile);

            return ApiResponse.success("Student verified successfully", toDTO(profile));
        } catch (Exception e) {
            return ApiResponse.error("Verification failed: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<StudentProfileDTO> requestCorrection(Long studentProfileId, String remarks) {
        try {
            Long staffId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findById(studentProfileId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            if (!profile.getAssignedMentor().getId().equals(staffId)) {
                return ApiResponse.error("Not authorized to request correction for this student");
            }

            profile.setVerificationStatus(StudentProfile.VerificationStatus.CORRECTION_REQUESTED);
            profile.setVerificationRemarks(remarks);
            profile = profileRepository.save(profile);

            // Send email to student
            emailService.sendCorrectionRequestEmail(profile);
            profile.setRegistrationStatus(StudentProfile.RegistrationStatus.DRAFT);
            profileRepository.save(profile);
            return ApiResponse.success("Correction request sent", toDTO(profile));
        } catch (Exception e) {
            return ApiResponse.error("Failed to request correction: " + e.getMessage());
        }
    }

    public ApiResponse<StaffDashboardDTO> getMyDashboard() {
        try {
            Long staffId = securityUtil.getCurrentUserId();

            List<StudentProfile> allAssigned = profileRepository.findByAssignedMentorId(staffId);
            long pending = allAssigned.stream()
                    .filter(s -> s.getVerificationStatus() == StudentProfile.VerificationStatus.PENDING)
                    .count();
            long verified = allAssigned.stream()
                    .filter(s -> s.getVerificationStatus() == StudentProfile.VerificationStatus.VERIFIED)
                    .count();
            long correctionRequested = allAssigned.stream()
                    .filter(s -> s.getVerificationStatus() == StudentProfile.VerificationStatus.CORRECTION_REQUESTED)
                    .count();

            StaffDashboardDTO dashboard = StaffDashboardDTO.builder()
                    .totalAssignedStudents((long) allAssigned.size())
                    .pendingVerification(pending)
                    .verified(verified)
                    .correctionRequested(correctionRequested)
                    .assignedStudents(allAssigned.stream().map(this::toDTO).collect(Collectors.toList()))
                    .build();

            return ApiResponse.success("Dashboard retrieved", dashboard);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<Void> assignMentorsRandomly() {
        try {
            List<StudentProfile> unassignedStudents = profileRepository.findUnassignedStudents();
            List<User> activeStaff = adUserRepository.findAllActiveStaff();

            if (activeStaff.isEmpty()) {
                return ApiResponse.error("No active staff available");
            }

            if (unassignedStudents.isEmpty()) {
                return ApiResponse.error("No unassigned students found");
            }

            // Get max group number
            Integer maxGroup = profileRepository.findMaxGroupNumber();
            int currentGroup = maxGroup + 1;

            // Calculate students per group
            int studentsPerGroup = (int) Math.ceil((double) unassignedStudents.size() / activeStaff.size());

            // Shuffle students for random distribution
            Collections.shuffle(unassignedStudents);

            int staffIndex = 0;
            int studentCount = 0;

            for (StudentProfile student : unassignedStudents) {
                User mentor = activeStaff.get(staffIndex);
                student.setAssignedMentor(mentor);
                student.setStudentGroupNumber(currentGroup);

                studentCount++;

                if (studentCount >= studentsPerGroup && staffIndex < activeStaff.size() - 1) {
                    staffIndex++;
                    currentGroup++;
                    studentCount = 0;
                }
            }

            profileRepository.saveAll(unassignedStudents);

            return ApiResponse.success("Mentors assigned successfully", null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to assign mentors: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<StudentProfileDTO> reassignMentor(Long studentProfileId, Long mentorId) {
        try {
            StudentProfile profile = profileRepository.findById(studentProfileId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            User mentor = adUserRepository.findById(mentorId)
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));

            if (mentor.getRole() != User.UserRole.STAFF) {
                return ApiResponse.error("Selected user is not a staff member");
            }

            profile.setAssignedMentor(mentor);
            profile = profileRepository.save(profile);

            return ApiResponse.success("Mentor reassigned successfully", toDTO(profile));
        } catch (Exception e) {
            return ApiResponse.error("Failed to reassign mentor: " + e.getMessage());
        }
    }

    private StudentProfileDTO toDTO(StudentProfile profile) {
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
}