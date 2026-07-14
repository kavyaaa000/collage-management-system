package com.college.erp.security;

import com.college.erp.admissions.repository.AdUserRepository;
import com.college.erp.connect.repository.CoUserRepository;
import com.college.erp.erp.repository.ErpUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Unified Security Utility for accessing current user information
 * Works with all module User entities
 */
@Component
@RequiredArgsConstructor
public class UnifiedSecurityUtil {

    @Autowired(required = false)
    private ErpUserRepository erpUserRepository;

    @Autowired(required = false)
    private AdUserRepository admissionsAdUserRepository;

    @Autowired(required = false)
    private CoUserRepository connectCoUserRepository;

    /**
     * Get current authenticated user's email
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser")) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * Get current user ID (works across all modules)
     */
    public Long getCurrentUserId() {
        String email = getCurrentUserEmail();
        if (email == null) return null;

        // Try ERP module
        if (erpUserRepository != null) {
            try {
                var user = erpUserRepository.findByEmail(email).orElse(null);
                if (user != null) return user.getUserId().longValue();

            } catch (Exception ignored) {}
        }

        // Try Admissions module
        if (admissionsAdUserRepository != null) {
            try {
                var user = admissionsAdUserRepository.findByEmail(email).orElse(null);
                if (user != null) return user.getId();
            } catch (Exception ignored) {}
        }

        // Try Connect module
        if (connectCoUserRepository != null) {
            try {
                var user = connectCoUserRepository.findByEmail(email).orElse(null);
                if (user != null) return user.getId();
            } catch (Exception ignored) {}
        }

        return null;
    }

    /**
     * Get current ERP user (Module 1)
     */
    public com.college.erp.erp.entity.User getCurrentErpUser() {
        String email = getCurrentUserEmail();
        if (email != null && erpUserRepository != null) {
            return erpUserRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    /**
     * Get current Admissions user (Module 2)
     */
    public com.college.erp.admissions.entity.User getCurrentAdmissionsUser() {
        String email = getCurrentUserEmail();
        if (email != null && admissionsAdUserRepository != null) {
            return admissionsAdUserRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    /**
     * Get current Connect user (Module 3)
     */
    public com.college.erp.connect.entity.User getCurrentConnectUser() {
        String email = getCurrentUserEmail();
        if (email != null && connectCoUserRepository != null) {
            return connectCoUserRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    /**
     * Check if current user is Admin (works across all modules)
     */
    public boolean isAdmin() {
        String email = getCurrentUserEmail();
        if (email == null) return false;

        // Check ERP module
        if (erpUserRepository != null) {
            try {
                var user = erpUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("ADMIN");
                }
            } catch (Exception ignored) {}
        }

        // Check Admissions module
        if (admissionsAdUserRepository != null) {
            try {
                var user = admissionsAdUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("ADMIN");
                }
            } catch (Exception ignored) {}
        }

        // Check Connect module
        if (connectCoUserRepository != null) {
            try {
                var user = connectCoUserRepository.findByEmail(email).orElse(null);
                if (user != null && user.getRoles() != null) {
                    return user.getRoles().stream()
                            .anyMatch(role -> role.getName().name().equals("ADMIN"));
                }
            } catch (Exception ignored) {}
        }

        return false;
    }

    /**
     * Check if current user is Staff
     */
    public boolean isStaff() {
        String email = getCurrentUserEmail();
        if (email == null) return false;

        // Check ERP module
        if (erpUserRepository != null) {
            try {
                var user = erpUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("STAFF");
                }
            } catch (Exception ignored) {}
        }

        // Check Admissions module
        if (admissionsAdUserRepository != null) {
            try {
                var user = admissionsAdUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("STAFF");
                }
            } catch (Exception ignored) {}
        }

        // Check Connect module
        if (connectCoUserRepository != null) {
            try {
                var user = connectCoUserRepository.findByEmail(email).orElse(null);
                if (user != null && user.getRoles() != null) {
                    return user.getRoles().stream()
                            .anyMatch(role -> role.getName().name().equals("STAFF"));
                }
            } catch (Exception ignored) {}
        }

        return false;
    }

    /**
     * Check if current user is Student
     */
    public boolean isStudent() {
        String email = getCurrentUserEmail();
        if (email == null) return false;

        // Check ERP module
        if (erpUserRepository != null) {
            try {
                var user = erpUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("STUDENT");
                }
            } catch (Exception ignored) {}
        }

        // Check Admissions module
        if (admissionsAdUserRepository != null) {
            try {
                var user = admissionsAdUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("STUDENT");
                }
            } catch (Exception ignored) {}
        }

        // Check Connect module
        if (connectCoUserRepository != null) {
            try {
                var user = connectCoUserRepository.findByEmail(email).orElse(null);
                if (user != null && user.getRoles() != null) {
                    return user.getRoles().stream()
                            .anyMatch(role -> role.getName().name().equals("STUDENT"));
                }
            } catch (Exception ignored) {}
        }

        return false;
    }

    /**
     * Check if current user is HOD
     */
    public boolean isHOD() {
        String email = getCurrentUserEmail();
        if (email == null) return false;

        // Check ERP module
        if (erpUserRepository != null) {
            try {
                var user = erpUserRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    return user.getRole().name().equals("HOD");
                }
            } catch (Exception ignored) {}
        }

        // Check Connect module
        if (connectCoUserRepository != null) {
            try {
                var user = connectCoUserRepository.findByEmail(email).orElse(null);
                if (user != null && user.getRoles() != null) {
                    return user.getRoles().stream()
                            .anyMatch(role -> role.getName().name().equals("HOD"));
                }
            } catch (Exception ignored) {}
        }

        return false;
    }

    /**
     * Get authentication object
     */
    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Check if user is authenticated
     */
    public boolean isAuthenticated() {
        Authentication authentication = getAuthentication();
        return authentication != null &&
                authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser");
    }
}