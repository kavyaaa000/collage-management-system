package com.college.erp.admissions.config;

import com.college.erp.admissions.entity.SystemConfig;
import com.college.erp.admissions.entity.User;
import com.college.erp.admissions.repository.AdUserRepository;
import com.college.erp.admissions.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Admissions-module data initializer.
 * Creates default admin/staff accounts and the REGISTRATION_WINDOW_STATUS config
 * in the CollegeERPAdmissionFinal database on startup.
 */
@Configuration
@RequiredArgsConstructor
public class AdmissionsDataInitializer implements CommandLineRunner {

    private final AdUserRepository adUserRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ===== Default Admissions Admin =====
        createDefaultUser(
                "kaviadmin@college.edu",
                "System Admin",
                "kavi123",
                User.UserRole.ADMIN
        );

        // ===== Default Admissions Staff =====
        createDefaultUser(
                "staff23@college.edu",
                "Default Staff",
                "staff123",
                User.UserRole.STAFF
        );

        // ===== Ensure REGISTRATION_WINDOW_STATUS config exists =====
        systemConfigRepository.findByConfigKey("REGISTRATION_WINDOW_STATUS")
                .orElseGet(() -> {
                    SystemConfig config = SystemConfig.builder()
                            .configKey("REGISTRATION_WINDOW_STATUS")
                            .configValue("CLOSED")
                            .description("Controls whether students can register for admissions")
                            .build();
                    systemConfigRepository.save(config);
                    System.out.println("✅ Created REGISTRATION_WINDOW_STATUS = CLOSED");
                    return config;
                });

        System.out.println("✅ Admissions default accounts ensured.");
    }

    private void createDefaultUser(String email, String name, String rawPassword, User.UserRole role) {
        if (!adUserRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .fullName(name)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .isActive(true)
                    .build();
            adUserRepository.save(user);
            System.out.println("✅ Created Admissions " + role + ": " + email + " / " + rawPassword);
        } else {
            System.out.println("ℹ️ Admissions " + role + " user already exists: " + email);
        }
    }
}