package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.request.LoginRequest;
import com.college.erp.attendance.dto.response.LoginResponse;
import com.college.erp.attendance.service.AtAuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("at/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Login and authentication APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtAuthenticationController {

    private final AtAuthenticationService atAuthenticationService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate staff or student")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for username: {}", request.getUsername());
        LoginResponse response = atAuthenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout current user")
    public ResponseEntity<Void> logout() {
        log.info("Logout request received");
        return ResponseEntity.ok().build();
    }
}