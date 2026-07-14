package com.college.erp.connect.service;

import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.CoDepartmentRepository;
import com.college.erp.connect.repository.RoleRepository;
import com.college.erp.connect.repository.CoUserRepository;

import com.college.erp.security.UnifiedJwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service("connectAuthService")
@RequiredArgsConstructor
public class ConnectAuthService {

    private final CoUserRepository coUserRepository;
    private final CoDepartmentRepository coDepartmentRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UnifiedJwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (coUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Department department = coDepartmentRepository.findByCode(request.getDepartmentCode())
                .orElseThrow(() -> new RuntimeException("Department not found: " + request.getDepartmentCode()));

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .department(department)
                .roles(roles)
                .build();

        user = coUserRepository.save(user);

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), roleNames);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .role(role.getName().name())
                .department(department.getCode())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = coUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), roleNames);

        String primaryRole = user.getRoles().isEmpty() ? "UNKNOWN" :
                user.getRoles().iterator().next().getName().name();

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .role(primaryRole)
                .department(user.getDepartment().getCode())
                .build();
    }

    public AuthResponse getCurrentUser(String email) {
        User user = coUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), roleNames);

        String primaryRole = user.getRoles().isEmpty() ? "UNKNOWN" :
                user.getRoles().iterator().next().getName().name();

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .role(primaryRole)
                .department(user.getDepartment().getCode())
                .build();
    }
}