////package com.college.erp.config;
////
////
////import com.college.erp.security.UnifiedJwtAuthenticationFilter;
////import lombok.RequiredArgsConstructor;
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.security.authentication.AuthenticationManager;
////import org.springframework.security.authentication.AuthenticationProvider;
////import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
////import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
////import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
////import org.springframework.security.config.http.SessionCreationPolicy;
////import org.springframework.security.core.userdetails.UserDetailsService;
////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.security.web.SecurityFilterChain;
////import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
////
/////**
//// * Unified Security Configuration for all modules
//// * Handles authentication and authorization for:
//// * - Main ERP Module
//// * - Admissions Module
//// * - AI Evaluation Module
//// * - College Connect Module
//// */
////@Configuration
////@EnableWebSecurity
////@EnableMethodSecurity
////@RequiredArgsConstructor
////public class UnifiedSecurityConfig {
////
////    private final UnifiedJwtAuthenticationFilter jwtAuthFilter;
////    private final UserDetailsService userDetailsService;
////
//////    @Bean
//////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//////        http
//////                .csrf(AbstractHttpConfigurer::disable)
//////                .cors(cors -> cors.configure(http))
//////                .authorizeHttpRequests(auth -> auth
//////                        // ===== PUBLIC ENDPOINTS =====
//////                        .requestMatchers("/api/auth/**", "/api/health/**").permitAll()
//////                        .requestMatchers("/api/departments/**").permitAll()
//////
//////                        // ===== ACTUATOR ENDPOINTS =====
//////                        .requestMatchers("/actuator/**").permitAll()
//////
//////                        // ===== ADMIN ENDPOINTS (All Modules) =====
//////                        .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
//////
//////                        // ===== HOD ENDPOINTS =====
//////                        .requestMatchers("/api/hod/**").hasAnyAuthority("HOD", "ADMIN", "ROLE_HOD", "ROLE_ADMIN")
//////
//////                        // ===== STAFF ENDPOINTS =====
//////                        .requestMatchers("/api/staff/**").hasAnyAuthority("STAFF", "HOD", "ADMIN", "ROLE_STAFF", "ROLE_HOD", "ROLE_ADMIN")
//////
//////                        // ===== STUDENT ENDPOINTS =====
//////                        .requestMatchers("/api/student/**").hasAnyAuthority("STUDENT", "STAFF", "HOD", "COE", "ADMIN", "ROLE_STUDENT", "ROLE_STAFF", "ROLE_HOD", "ROLE_COE", "ROLE_ADMIN")
//////
//////                        // ===== AI EVALUATION MODULE =====
//////                        .requestMatchers("/api/evaluation/**").authenticated()
//////
//////                        // ===== COLLEGE CONNECT MODULE =====
//////                        .requestMatchers("/api/contests/**").authenticated()
//////                        .requestMatchers("/api/store/items/**").authenticated()
//////                        .requestMatchers("/api/store/purchase").authenticated()
//////                        .requestMatchers("/api/store/purchases/**").authenticated()
//////
//////                        // ===== ADMISSIONS MODULE =====
//////                        .requestMatchers("/api/admissions/**").authenticated()
//////
//////                        // ===== DEFAULT =====
//////                        .anyRequest().authenticated()
//////                )
//////                .sessionManagement(session -> session
//////                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//////                )
//////                .authenticationProvider(authenticationProvider())
//////                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//////
//////        return http.build();
//////    }
////
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////
////        http
////                .csrf(csrf -> csrf.disable())
////
////                // ✅ THIS LINE IS MANDATORY
////                .cors(cors -> {})
////
////                .authorizeHttpRequests(auth -> auth
////
////                        // 🔓 ALLOW PREFLIGHT REQUESTS
////                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
////
////                        // ===== PUBLIC AUTH =====
////                        .requestMatchers(
////                                "/api/erp/auth/**",
////                                "/api/ad/auth/**",
////                                "/api/eva/auth/**",
////                                "/api/connect/auth/**"
////                        ).permitAll()
////
////                        // ===== PUBLIC =====
////                        .requestMatchers(
////                                "/api/public/**",
////                                "/actuator/**"
////                        ).permitAll()
////
////                        // ===== EVERYTHING ELSE =====
////                        .anyRequest().authenticated()
////                )
////                .sessionManagement(session ->
////                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
////                )
////                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
////
////        return http.build();
////    }
////
////
////    @Bean
////    public PasswordEncoder passwordEncoder() {
////        return new BCryptPasswordEncoder();
////    }
////
////    @Bean
////    public AuthenticationProvider authenticationProvider() {
////        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
////        authProvider.setUserDetailsService(userDetailsService);
////        authProvider.setPasswordEncoder(passwordEncoder());
////        return authProvider;
////    }
////
////    @Bean
////    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
////            throws Exception {
////        return config.getAuthenticationManager();
////    }
////}
//
//
//
//
//
//package com.college.erp.config;
//
//
//import com.college.erp.security.UnifiedJwtAuthenticationFilter;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
///**
// * Unified Security Configuration for all modules
// * Handles authentication and authorization for:
// * - Main ERP Module
// * - Admissions Module
// * - AI Evaluation Module
// * - College Connect Module
// */
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class UnifiedSecurityConfig {
//
//    private final UnifiedJwtAuthenticationFilter jwtAuthFilter;
//    private final UserDetailsService userDetailsService;
//
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http
////                .csrf(AbstractHttpConfigurer::disable)
////                .cors(cors -> cors.configure(http))
////                .authorizeHttpRequests(auth -> auth
////                        // ===== PUBLIC ENDPOINTS =====
////                        .requestMatchers("/api/auth/**", "/api/health/**").permitAll()
////                        .requestMatchers("/api/departments/**").permitAll()
////
////                        // ===== ACTUATOR ENDPOINTS =====
////                        .requestMatchers("/actuator/**").permitAll()
////
////                        // ===== ADMIN ENDPOINTS (All Modules) =====
////                        .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
////
////                        // ===== HOD ENDPOINTS =====
////                        .requestMatchers("/api/hod/**").hasAnyAuthority("HOD", "ADMIN", "ROLE_HOD", "ROLE_ADMIN")
////
////                        // ===== STAFF ENDPOINTS =====
////                        .requestMatchers("/api/staff/**").hasAnyAuthority("STAFF", "HOD", "ADMIN", "ROLE_STAFF", "ROLE_HOD", "ROLE_ADMIN")
////
////                        // ===== STUDENT ENDPOINTS =====
////                        .requestMatchers("/api/student/**").hasAnyAuthority("STUDENT", "STAFF", "HOD", "COE", "ADMIN", "ROLE_STUDENT", "ROLE_STAFF", "ROLE_HOD", "ROLE_COE", "ROLE_ADMIN")
////
////                        // ===== AI EVALUATION MODULE =====
////                        .requestMatchers("/api/evaluation/**").authenticated()
////
////                        // ===== COLLEGE CONNECT MODULE =====
////                        .requestMatchers("/api/contests/**").authenticated()
////                        .requestMatchers("/api/store/items/**").authenticated()
////                        .requestMatchers("/api/store/purchase").authenticated()
////                        .requestMatchers("/api/store/purchases/**").authenticated()
////
////                        // ===== ADMISSIONS MODULE =====
////                        .requestMatchers("/api/admissions/**").authenticated()
////
////                        // ===== DEFAULT =====
////                        .anyRequest().authenticated()
////                )
////                .sessionManagement(session -> session
////                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
////                )
////                .authenticationProvider(authenticationProvider())
////                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
////
////        return http.build();
////    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                .csrf(csrf -> csrf.disable())
//
//                // ✅ THIS LINE IS MANDATORY
//                .cors(cors -> {})
//
//                .authorizeHttpRequests(auth -> auth
//
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//
//                        .requestMatchers(
//                                "/api/erp/auth/**",
//                                "/api/ad/auth/**",
//                                "/api/eva/auth/**",
//                                "/api/connect/auth/**"
//                        ).permitAll()
//
//
//                                .requestMatchers(
//                                        "/api/erp/auth/**",
//                                        "/api/ad/auth/**",
//                                        "/api/eva/auth/**",
//                                        "/api/connect/auth/**",
//                                        "/at/auth/**"  // Add this line
//                                ).permitAll()
//
//// Add this line for public access during development
//                                .requestMatchers("/at/**").permitAll()
//
//                        // 🔥 ADD THIS LINE
//                        .requestMatchers("/api/eva/**").permitAll()
//
//                        .requestMatchers(
//                                "/api/public/**",
//                                "/actuator/**"
//                        ).permitAll()
//
//                        .anyRequest().authenticated()
//                )
//
//
//
//                .sessionManagement(session ->
//                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userDetailsService);
//        authProvider.setPasswordEncoder(passwordEncoder());
//        return authProvider;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
//            throws Exception {
//        return config.getAuthenticationManager();
//    }
//}















package com.college.erp.config;

import com.college.erp.security.UnifiedJwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Unified Security Configuration for all modules
 * Handles authentication and authorization for:
 * - Main ERP Module
 * - Admissions Module
 * - AI Evaluation Module
 * - College Connect Module
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class UnifiedSecurityConfig {

    private final UnifiedJwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // Uses CorsConfigurationSource bean from UnifiedCorsConfig

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ===== PUBLIC AUTH ENDPOINTS (all modules) =====
                        .requestMatchers(
                                "/api/erp/auth/**",
                                "/api/ad/auth/**",
                                "/api/eva/auth/**",
                                "/api/connect/auth/**",
                                "/api/auth/**",
                                "/at/**"// standalone auth (if used)
                        ).permitAll()
                        .requestMatchers("/api/eva/**").permitAll()
                        // ===== PUBLIC ENDPOINTS =====
                        .requestMatchers(
                                "/api/ad/public/**",
                                "/api/erp/public/**",
                                "/api/public/**",
                                "/actuator/**"
                        ).permitAll()

                        // ===== EVERYTHING ELSE requires auth =====
                        .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}