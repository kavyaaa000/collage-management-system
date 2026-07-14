//package com.college.erp.erp.controller;
//
//import com.college.erp.erp.dto.AuthResponse;
//import com.college.erp.erp.dto.LoginRequest;
//import com.college.erp.erp.entity.User;
//import com.college.erp.erp.repository.ErpUserRepository;
//import com.college.erp.security.UnifiedJwtUtil;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/erp/auth")
//@CrossOrigin(origins = "*")
//@RequiredArgsConstructor
//@Slf4j
//public class ErpAuthController {
//
//    private final AuthenticationManager authenticationManager;
//    private final UnifiedJwtUtil jwtService;
//    private final ErpUserRepository erpUserRepository;
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
//        log.info("Login attempt for user: {}", request.getUsername());
//
//        try {
//            // Authenticate
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            request.getUsername(),
//                            request.getPassword()
//                    )
//            );
//
//            // Get user details
//            User user = erpUserRepository.findByUsername(request.getUsername())
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            // Generate token with user info
//            Map<String, Object> claims = new HashMap<>();
//            claims.put("userId", user.getUserId());
//            claims.put("role", user.getRole().name());
//            claims.put("deptId", user.getDeptId());
//            claims.put("fullName", user.getFullName());
//
//            String token = jwtService.generateToken(claims, user);
//
//            log.info("Login successful for user: {} with role: {}", user.getUsername(), user.getRole());
//
//            return ResponseEntity.ok(AuthResponse.builder()
//                    .token(token)
//                    .username(user.getUsername())
//                    .fullName(user.getFullName())
//                    .role(user.getRole().name())
//                    .deptId(user.getDeptId())
//                    .build());
//
//        } catch (Exception e) {
//            log.error("Login failed for user: {}", request.getUsername(), e);
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    @GetMapping("/me")
//    public ResponseEntity<Map<String, Object>> getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return ResponseEntity.status(401).build();
//        }
//
//        User user = (User) authentication.getPrincipal();
//
//        Map<String, Object> userInfo = new HashMap<>();
//        userInfo.put("username", user.getUsername());
//        userInfo.put("fullName", user.getFullName());
//        userInfo.put("role", user.getRole().name());
//        userInfo.put("deptId", user.getDeptId());
//        userInfo.put("email", user.getEmail());
//
//        return ResponseEntity.ok(userInfo);
//    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<Map<String, String>> logout() {
//        // In JWT, logout is handled client-side by removing the token
//        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
//    }
//}


package com.college.erp.erp.controller;

import com.college.erp.erp.dto.AuthResponse;
import com.college.erp.erp.dto.LoginRequest;
import com.college.erp.erp.entity.User;
import com.college.erp.erp.repository.ErpUserRepository;
import com.college.erp.security.UnifiedJwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/erp/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ErpAuthController {

    private final AuthenticationManager authenticationManager;
    private final UnifiedJwtUtil jwtService;
    private final ErpUserRepository erpUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());

        try {
            // First, find user by username to get email
            User user = erpUserRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Authenticate using EMAIL (the unified system uses email as principal)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),  // ← Use email here instead of username
                            request.getPassword()
                    )
            );

            // Generate token with user info using email as subject
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getUserId());
            claims.put("role", user.getRole().name());
            claims.put("deptId", user.getDeptId());
            claims.put("fullName", user.getFullName());

            // Use the email as the subject in JWT token
            String token = jwtService.generateToken(claims, user.getEmail());

            log.info("Login successful for user: {} with role: {}", user.getUsername(), user.getRole());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .deptId(user.getDeptId())
                    .build());

        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid username or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        // The principal is now email (not User object)
        String email = authentication.getName();

        User user = erpUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("fullName", user.getFullName());
        userInfo.put("role", user.getRole().name());
        userInfo.put("deptId", user.getDeptId());
        userInfo.put("email", user.getEmail());

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}