package com.college.erp.admissions.controller;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.service.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ad/public")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PublicController {

    private final AdmissionService admissionService;
    private final SystemConfigService configService;

    /**
     * Handle offer response (Accept/Decline) - Public endpoint with token
     */
    @PostMapping("/offer/respond")
    public ResponseEntity<ApiResponse<String>> respondToOffer(
            @RequestParam String token,
            @RequestParam String response,
            HttpServletRequest request
    ) {
        String ipAddress = getClientIP(request);
        String userAgent = request.getHeader("User-Agent");

        ApiResponse<String> apiResponse = admissionService.respondToOffer(
                token,
                response,
                ipAddress,
                userAgent
        );
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * Get registration window status - Public endpoint
     */
    @GetMapping("/registration-status")
    public ResponseEntity<ApiResponse<String>> getRegistrationStatus() {
        String status = configService.getRegistrationWindowStatus();
        return ResponseEntity.ok(ApiResponse.success("Registration status retrieved", status));
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
