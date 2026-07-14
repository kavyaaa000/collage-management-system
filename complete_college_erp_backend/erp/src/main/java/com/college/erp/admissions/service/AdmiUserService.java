package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.User;
import com.college.erp.admissions.repository.AdUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Users within the Admissions module.
 * Handles staff CRUD operations on the CollegeERPAdmissionFinal database.
 */
@Service
@RequiredArgsConstructor
public class AdmiUserService {

    private final AdUserRepository adUserRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse<List<UserDTO>> getAllStaff() {
        List<UserDTO> staff = adUserRepository.findByRole(User.UserRole.STAFF)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success("Staff list retrieved", staff);
    }

    public ApiResponse<List<UserDTO>> getAllActiveStaff() {
        List<UserDTO> staff = adUserRepository.findAllActiveStaff()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success("Active staff list retrieved", staff);
    }

    @Transactional
    public ApiResponse<UserDTO> createStaff(CreateStaffRequest request) {
        try {
            if (adUserRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already exists");
            }

            User staff = User.builder()
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .fullName(request.getFullName())
                    .role(User.UserRole.STAFF)
                    .isActive(true)
                    .build();

            staff = adUserRepository.save(staff);
            return ApiResponse.success("Staff created successfully", toDTO(staff));

        } catch (Exception e) {
            return ApiResponse.error("Failed to create staff: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<Void> deleteStaff(Long staffId) {
        try {
            User staff = adUserRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            if (staff.getRole() != User.UserRole.STAFF) {
                return ApiResponse.error("User is not a staff member");
            }

            adUserRepository.delete(staff);
            return ApiResponse.success("Staff deleted successfully", null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to delete staff: " + e.getMessage());
        }
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}