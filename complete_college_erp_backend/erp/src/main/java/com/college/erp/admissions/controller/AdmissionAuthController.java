//package com.college.erp.controller;
//
//import com.college.erp.admissions.dto.*;
//import com.college.erp.admissions.service.AdmiAuthService;
//import com.college.erp.admissions.service.SystemConfigService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/ad/auth")
//@RequiredArgsConstructor
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
//public class AdmissionAuthController {
//    @Qualifier("admissionAuthService")
//    private final AdmiAuthService admiAuthService;
//    private final SystemConfigService configService;
//
//    @PostMapping("/login")
//    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
//        ApiResponse<LoginResponse> response = admiAuthService.login(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
//        // Check if registration is open
//        String status = configService.getRegistrationWindowStatus();
//        if (!"OPEN".equals(status)) {
//            return ResponseEntity.badRequest()
//                    .body(ApiResponse.error("Registration window is currently closed"));
//        }
//
//        ApiResponse<UserDTO> response = admiAuthService.registerStudent(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/registration-status")
//    public ResponseEntity<ApiResponse<String>> getRegistrationStatus() {
//        String status = configService.getRegistrationWindowStatus();
//        return ResponseEntity.ok(ApiResponse.success("Registration status retrieved", status));
//    }
//}
package com.college.erp.admissions.controller;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.service.AdmiAuthService;
import com.college.erp.admissions.service.SystemConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admissions authentication controller.
 * Handles login, registration, and registration-status for the /api/ad/auth/** path.
 */
@RestController
@RequestMapping("/api/ad/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdmissionAuthController {

    // NOTE: No @Qualifier needed here — AdmiAuthService is in admissions package,
    // so Spring finds it unambiguously. If a naming conflict exists, rename the bean
    // via @Service("admissionAuthService") on AdmiAuthService (already done).
    private final AdmiAuthService admiAuthService;
    private final SystemConfigService systemConfigService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        ApiResponse<LoginResponse> response = admiAuthService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(
            @Valid @RequestBody RegisterRequest request) {
        // Block registration if window is closed
        String status = systemConfigService.getRegistrationWindowStatus();
        if (!"OPEN".equals(status)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration window is currently closed"));
        }
        ApiResponse<UserDTO> response = admiAuthService.registerStudent(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/registration-status")
    public ResponseEntity<ApiResponse<String>> getRegistrationStatus() {
        String status = systemConfigService.getRegistrationWindowStatus();
        return ResponseEntity.ok(ApiResponse.success("Registration status retrieved", status));
    }
}