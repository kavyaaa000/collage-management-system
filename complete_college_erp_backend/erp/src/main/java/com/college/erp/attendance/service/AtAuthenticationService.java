package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.request.LoginRequest;
import com.college.erp.attendance.dto.response.LoginResponse;
import com.college.erp.attendance.entity.*;
import com.college.erp.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtAuthenticationService {

    private final AtUserCredentialsRepository atUserCredentialsRepository;
    private final AtStaffRepository atStaffRepository;
    private final AtStudentRepository atStudentRepository;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for username: {}", request.getUsername());

        UserCredentials credentials = atUserCredentialsRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!credentials.getIsActive()) {
            throw new RuntimeException("Account is inactive. Please contact administrator.");
        }

        // Validate password
        if (!validatePassword(request.getPassword(), credentials.getUserType())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Update last login
        credentials.setLastLogin(LocalDateTime.now());
        atUserCredentialsRepository.save(credentials);

        // Build response based on user type
        LoginResponse.LoginResponseBuilder responseBuilder = LoginResponse.builder()
                .token(generateToken(credentials))
                .userType(credentials.getUserType().name())
                .userId(credentials.getUserId())
                .referenceId(credentials.getReferenceId());

        if (credentials.getUserType() == UserCredentials.UserType.STAFF ||
                credentials.getUserType() == UserCredentials.UserType.HOD) {

            Staff staff = atStaffRepository.findById(credentials.getReferenceId())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            responseBuilder
                    .name(staff.getStaffName())
                    .email(staff.getEmail())
                    .departmentId(staff.getDepartmentId());

        } else if (credentials.getUserType() == UserCredentials.UserType.STUDENT) {

            Student student = atStudentRepository.findById(credentials.getReferenceId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            responseBuilder
                    .name(student.getStudentName())
                    .email(student.getEmail())
                    .semesterId(student.getCurrentSemesterId())
                    .sectionId(student.getSectionId())
                    .departmentId(student.getDepartmentId());
        }

        log.info("Login successful for user: {} ({})", request.getUsername(), credentials.getUserType());
        return responseBuilder.build();
    }

    private boolean validatePassword(String password, UserCredentials.UserType userType) {
        // For demo purposes
        if (userType == UserCredentials.UserType.STAFF) {
            return "staff123".equals(password);
        } else if (userType == UserCredentials.UserType.STUDENT) {
            return "student123".equals(password);
        } else if (userType == UserCredentials.UserType.HOD) {
            return "hod123".equals(password);
        }
        return false;
    }

    private String generateToken(UserCredentials credentials) {
        return "Bearer_" + credentials.getUsername() + "_" + System.currentTimeMillis();
    }

    public UserCredentials validateToken(String token) {
        if (token == null || !token.startsWith("Bearer_")) {
            throw new RuntimeException("Invalid token");
        }

        String username = token.split("_")[1];
        return atUserCredentialsRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
    }
}