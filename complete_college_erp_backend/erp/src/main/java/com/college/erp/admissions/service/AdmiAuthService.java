////package com.college.erp.admissions.service;
////
////import com.college.erp.admissions.dto.LoginRequest;
////import com.college.erp.admissions.dto.LoginResponse;
////import com.college.erp.admissions.dto.*;
////import com.college.erp.admissions.entity.User;
////import com.college.erp.admissions.entity.StudentProfile;
////import com.college.erp.admissions.repository.AdUserRepository;
////import com.college.erp.admissions.repository.StudentProfileRepository;
////import com.college.erp.security.UnifiedJwtUtil;
////import lombok.RequiredArgsConstructor;
////import org.springframework.security.authentication.AuthenticationManager;
////import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
////import org.springframework.security.core.userdetails.UserDetails;
////import org.springframework.security.core.userdetails.UserDetailsService;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.stereotype.Service;
////import org.springframework.transaction.annotation.Transactional;
////
////import java.time.Year;
////
////@Service
////@RequiredArgsConstructor
////public class AdmiAuthService {
////
////    private final AdUserRepository userRepository;
////    private final StudentProfileRepository studentProfileRepository;
////    private final PasswordEncoder passwordEncoder;
////    private final UnifiedJwtUtil jwtUtil;
////    private final AuthenticationManager authenticationManager;
////    private final UserDetailsService userDetailsService;
////
////    @Transactional
////    public ApiResponse<LoginResponse> login(LoginRequest request) {
////        try {
////            authenticationManager.authenticate(
////                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
////            );
////
////            User user = userRepository.findByEmail(request.getEmail())
////                    .orElseThrow(() -> new RuntimeException("User not found"));
////
////            if (!user.getIsActive()) {
////                return ApiResponse.error("Account is inactive");
////            }
////
////            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
////            String token = jwtUtil.generateToken(userDetails);
////
////            LoginResponse response = LoginResponse.builder()
////                    .token(token)
////                    .userId(user.getId())
////                    .email(user.getEmail())
////                    .fullName(user.getFullName())
////                    .role(user.getRole().name())
////                    .build();
////
////            return ApiResponse.success("Login successful", response);
////
////        } catch (Exception e) {
////            return ApiResponse.error("Invalid email or password");
////        }
////    }
////
////    @Transactional
////    public ApiResponse<UserDTO> registerStudent(RegisterRequest request) {
////        try {
////            if (userRepository.existsByEmail(request.getEmail())) {
////                return ApiResponse.error("Email already registered");
////            }
////
////            User user = User.builder()
////                    .email(request.getEmail())
////                    .passwordHash(passwordEncoder.encode(request.getPassword()))
////                    .fullName(request.getFullName())
////                    .role(User.UserRole.STUDENT)
////                    .isActive(true)
////                    .build();
////
////            user = userRepository.save(user);
////
////            // Create student profile with application number
////            String applicationNumber = generateApplicationNumber();
////            StudentProfile profile = StudentProfile.builder()
////                    .user(user)
////                    .applicationNumber(applicationNumber)
////                    .stream(StudentProfile.Stream.NOT_SELECTED)  // ✅ temporary
////                    .registrationStatus(StudentProfile.RegistrationStatus.DRAFT)
////                    .verificationStatus(StudentProfile.VerificationStatus.PENDING)
////                    .build();
////
////
////            studentProfileRepository.save(profile);
////
////            UserDTO dto = UserDTO.builder()
////                    .id(user.getId())
////                    .email(user.getEmail())
////                    .fullName(user.getFullName())
////                    .role(user.getRole().name())
////                    .isActive(user.getIsActive())
////                    .createdAt(user.getCreatedAt())
////                    .build();
////
////            return ApiResponse.success("Registration successful", dto);
////
////        } catch (Exception e) {
////            return ApiResponse.error("Registration failed: " + e.getMessage());
////        }
////    }
////
////    private String generateApplicationNumber() {
////        int year = Year.now().getValue();
////        long count = studentProfileRepository.count();
////        return String.format("APP%d%06d", year, count + 1);
////    }
////}
//
//
//
//package com.college.erp.admissions.service;
//
//import com.college.erp.admissions.dto.*;
//import com.college.erp.admissions.entity.StudentProfile;
//import com.college.erp.admissions.entity.User;
//import com.college.erp.admissions.repository.AdUserRepository;
//import com.college.erp.admissions.repository.StudentProfileRepository;
//import com.college.erp.security.UnifiedJwtUtil;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.Year;
//
///**
// * Authentication service for the Admissions module.
// * Bean name "admissionAuthService" avoids conflict with ERP AuthService.
// */
//@Service("admissionAuthService")
//@RequiredArgsConstructor
//public class AdmiAuthService {
//
//    private final AdUserRepository adUserRepository;
//    private final StudentProfileRepository studentProfileRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final UnifiedJwtUtil jwtUtil;
//    private final AuthenticationManager authenticationManager;
//    private final UserDetailsService userDetailsService;  // → UnifiedUserDetailsService
//
//    @Transactional
//    public ApiResponse<LoginResponse> login(LoginRequest request) {
//        try {
//            // Delegate to Spring Security (UnifiedUserDetailsService handles cross-module lookup)
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            request.getEmail(), request.getPassword())
//            );
//
//            User user = adUserRepository.findByEmail(request.getEmail())
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            if (!Boolean.TRUE.equals(user.getIsActive())) {
//                return ApiResponse.error("Account is inactive");
//            }
//
//            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
//            String token = jwtUtil.generateToken(userDetails);
//
//            LoginResponse loginResponse = LoginResponse.builder()
//                    .token(token)
//                    .userId(user.getId())
//                    .email(user.getEmail())
//                    .fullName(user.getFullName())
//                    .role(user.getRole().name())
//                    .build();
//
//            return ApiResponse.success("Login successful", loginResponse);
//
//        } catch (Exception e) {
//            return ApiResponse.error("Invalid email or password");
//        }
//    }
//
//    @Transactional
//    public ApiResponse<UserDTO> registerStudent(RegisterRequest request) {
//        try {
//            if (adUserRepository.existsByEmail(request.getEmail())) {
//                return ApiResponse.error("Email already registered");
//            }
//
//            User user = User.builder()
//                    .email(request.getEmail())
//                    .passwordHash(passwordEncoder.encode(request.getPassword()))
//                    .fullName(request.getFullName())
//                    .role(User.UserRole.STUDENT)
//                    .isActive(true)
//                    .build();
//
//            user = adUserRepository.save(user);
//
//            // Create student profile
//            String applicationNumber = generateApplicationNumber();
//            StudentProfile profile = StudentProfile.builder()
//                    .user(user)
//                    .applicationNumber(applicationNumber)
//                    .registrationStatus(StudentProfile.RegistrationStatus.DRAFT)
//                    .verificationStatus(StudentProfile.VerificationStatus.PENDING)
//                    .build();
//
//            studentProfileRepository.save(profile);
//
//            UserDTO dto = UserDTO.builder()
//                    .id(user.getId())
//                    .email(user.getEmail())
//                    .fullName(user.getFullName())
//                    .role(user.getRole().name())
//                    .isActive(user.getIsActive())
//                    .createdAt(user.getCreatedAt())
//                    .build();
//
//            return ApiResponse.success("Registration successful", dto);
//
//        } catch (Exception e) {
//            return ApiResponse.error("Registration failed: " + e.getMessage());
//        }
//    }
//
//    private String generateApplicationNumber() {
//        int year = Year.now().getValue();
//        long count = studentProfileRepository.count();
//        return String.format("APP%d%06d", year, count + 1);
//    }
//}


package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.StudentProfile;
import com.college.erp.admissions.entity.User;
import com.college.erp.admissions.repository.AdUserRepository;
import com.college.erp.admissions.repository.StudentProfileRepository;
import com.college.erp.security.UnifiedJwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;

/**
 * Authentication service for the Admissions module.
 * Bean name "admissionAuthService" avoids conflict with ERP AuthService.
 */
@Service("admissionAuthService")
@RequiredArgsConstructor
public class AdmiAuthService {

    private final AdUserRepository adUserRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final UnifiedJwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;  // → UnifiedUserDetailsService

    @Transactional
    public ApiResponse<LoginResponse> login(LoginRequest request) {
        try {
            // Delegate to Spring Security (UnifiedUserDetailsService handles cross-module lookup)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword())
            );

            User user = adUserRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!Boolean.TRUE.equals(user.getIsActive())) {
                return ApiResponse.error("Account is inactive");
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            LoginResponse loginResponse = LoginResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .build();

            return ApiResponse.success("Login successful", loginResponse);

        } catch (Exception e) {
            return ApiResponse.error("Invalid email or password");
        }
    }

    @Transactional
    public ApiResponse<UserDTO> registerStudent(RegisterRequest request) {
        try {
            if (adUserRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already registered");
            }

            User user = User.builder()
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .fullName(request.getFullName())
                    .role(User.UserRole.STUDENT)
                    .isActive(true)
                    .build();

            user = adUserRepository.save(user);

            // Create student profile
            String applicationNumber = generateApplicationNumber();
            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .applicationNumber(applicationNumber)
                    .stream(StudentProfile.Stream.NOT_SELECTED)
                    .registrationStatus(StudentProfile.RegistrationStatus.DRAFT)
                    .verificationStatus(StudentProfile.VerificationStatus.PENDING)
                    .build();

            studentProfileRepository.save(profile);

            UserDTO dto = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .isActive(user.getIsActive())
                    .createdAt(user.getCreatedAt())
                    .build();

            return ApiResponse.success("Registration successful", dto);

        } catch (Exception e) {
            return ApiResponse.error("Registration failed: " + e.getMessage());
        }
    }

    private String generateApplicationNumber() {
        int year = Year.now().getValue();
        long count = studentProfileRepository.count();
        return String.format("APP%d%06d", year, count + 1);
    }
}