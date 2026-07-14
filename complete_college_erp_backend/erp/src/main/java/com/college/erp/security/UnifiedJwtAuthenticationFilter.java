//package com.college.erp.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.lang.NonNull;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
///**
// * Unified JWT Authentication Filter for all modules
// * Handles JWT token validation and authentication
// */
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class UnifiedJwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final UnifiedJwtUtil jwtUtil;
//    private final UnifiedUserDetailsService userDetailsService;
//
//    @Override
//    protected void doFilterInternal(
//            @NonNull HttpServletRequest request,
//            @NonNull HttpServletResponse response,
//            @NonNull FilterChain filterChain
//    ) throws ServletException, IOException {
//
//        // Skip JWT validation for public endpoints
//        if (shouldSkipAuthentication(request)) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        final String authHeader = request.getHeader("Authorization");
//
//        // Check if Authorization header is present and valid
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        try {
//            // Extract JWT token
//            final String jwt = authHeader.substring(7);
//            final String userEmail = jwtUtil.extractUsername(jwt);
//
//            // If token contains username and no authentication exists
//            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
//
//                // Validate token
//                if (jwtUtil.isTokenValid(jwt, userDetails)) {
//                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                            userDetails,
//                            null,
//                            userDetails.getAuthorities()
//                    );
//                    authToken.setDetails(
//                            new WebAuthenticationDetailsSource().buildDetails(request)
//                    );
//                    SecurityContextHolder.getContext().setAuthentication(authToken);
//
//                    log.debug("User {} authenticated successfully", userEmail);
//                } else {
//                    log.debug("JWT token validation failed for user {}", userEmail);
//                }
//            }
//        } catch (Exception e) {
//            log.error("Cannot set user authentication: {}", e.getMessage());
//        }
//
//        filterChain.doFilter(request, response);
//    }
//
//    /**
//     * Determine if authentication should be skipped for this request
//     */
////    private boolean shouldSkipAuthentication(HttpServletRequest request) {
////        String path = request.getServletPath();
////
////        // Skip authentication for public endpoints
////        return path.contains("/api/auth/") ||
////                path.contains("/api/public/") ||
////                path.equals("/actuator/health") ||
////                path.equals("/actuator/info") ||
////                path.contains("/api/admissions/offer/respond/") ||
////                path.contains("/api/documents/") && path.endsWith("/view");
////    }
//    private boolean shouldSkipAuthentication(HttpServletRequest request) {
//        String path = request.getServletPath();
//
//        return
//                // ===== AUTH ENDPOINTS (PUBLIC) =====
//                path.startsWith("/api/erp/auth/") ||
//                        path.startsWith("/api/ad/auth/") ||
//                        path.startsWith("/api/eva/auth/") ||
//                        path.startsWith("/api/connect/auth/") ||
//                        path.startsWith("/api/attendance/auth/") ||
//                        // ===== PUBLIC APIs =====
//                        path.startsWith("/api/public/") ||
//
//                        // ===== ACTUATOR =====
//                        path.equals("/actuator/health") ||
//                        path.equals("/actuator/info") ||
//
//                        // ===== SPECIAL CASES =====
//                        path.startsWith("/api/ad/offer/respond/") ||
//                        (path.startsWith("/api/documents/") && path.endsWith("/view"));
//    }
//
//
//
//}
//
//


package com.college.erp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Unified JWT Authentication Filter for all modules
 * Handles JWT token validation and authentication
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UnifiedJwtAuthenticationFilter extends OncePerRequestFilter {

    private final UnifiedJwtUtil jwtUtil;
    private final UnifiedUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Skip JWT validation for public endpoints
        if (shouldSkipAuthentication(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // If no Authorization header, continue without setting auth
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtUtil.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("User {} authenticated successfully", userEmail);
                } else {
                    log.debug("JWT token validation failed for user {}", userEmail);
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Determines if authentication should be skipped for this request.
     * Matches the correct API path prefixes used across all modules.
     */
    private boolean shouldSkipAuthentication(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();

        // Always skip OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        return
                // ===== AUTH ENDPOINTS (PUBLIC) =====
                path.startsWith("/api/erp/auth/") ||
                        path.startsWith("/api/ad/auth/") ||
                        path.startsWith("/api/eva/") ||
                        path.startsWith("/api/connect/auth/") ||
                        path.startsWith("/api/auth/") ||

                        // ===== PUBLIC APIs =====
                        path.startsWith("/api/ad/public/") ||
                        path.startsWith("/api/erp/public/") ||
                        path.startsWith("/api/public/") ||

                        // ===== ACTUATOR =====
                        path.equals("/actuator/health") ||
                        path.equals("/actuator/info") ||
                        path.startsWith("/actuator/") ||

                        // ===== SPECIAL CASES =====
                        path.startsWith("/api/ad/offer/respond") ||
                        (path.startsWith("/api/ad/documents/") && path.endsWith("/view")) ||
                        (path.startsWith("/api/documents/") && path.endsWith("/view"));
    }
}