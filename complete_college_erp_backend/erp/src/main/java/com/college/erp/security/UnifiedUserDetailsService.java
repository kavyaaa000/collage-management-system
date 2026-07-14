//package com.college.erp.security;
//
//import com.college.erp.admissions.repository.AdUserRepository;
//import com.college.erp.connect.repository.CoUserRepository;
//import com.college.erp.erp.repository.ErpUserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Collection;
//import java.util.Collections;
//import java.util.stream.Collectors;
//import lombok.extern.slf4j.Slf4j;
//
///**
// * Unified UserDetailsService that works with all module User entities
// * Supports:
// * - Module 1 (ERP): User with UserRole enum
// * - Module 2 (Admissions): User with Role enum
// * - Module 3 (College Connect): User with Set<Role> entities
// */
//
//@Slf4j
//@Service
//public class UnifiedUserDetailsService implements UserDetailsService {
//
//    // Inject all user repositories (will be auto-wired by Spring)
//    @Autowired(required = false)
//    private ErpUserRepository erpUserRepository;
//
//    @Autowired(required = false)
//    private AdUserRepository admissionsAdUserRepository;
//
//    @Autowired(required = false)
//    private CoUserRepository connectCoUserRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        // Try to find user from any module
//
//        // Try ERP module first (Module 1)
//        // Try ERP module first (Module 1)
//        if (erpUserRepository != null) {
//            try {
//                com.college.erp.erp.entity.User erpUser = null;
//
//                // Try to find by email first
//                erpUser = erpUserRepository.findByEmail(email).orElse(null);
//
//                // If not found by email, try by username (for backward compatibility)
//                if (erpUser == null) {
//                    erpUser = erpUserRepository.findByUsername(email).orElse(null);
//                }
//
//                if (erpUser != null) {
//                    return buildUserDetailsFromErpUser(erpUser);
//                }
//            } catch (Exception e) {
//                // Repository might not be configured yet, continue
//                log.debug("Could not load user from ERP repository", e);
//            }
//        }
//        // Try Admissions module (Module 2)
//        if (admissionsAdUserRepository != null) {
//            try {
//                com.college.erp.admissions.entity.User admissionsUser = admissionsAdUserRepository.findByEmail(email)
//                        .orElse(null);
//                if (admissionsUser != null) {
//                    return buildUserDetailsFromAdmissionsUser(admissionsUser);
//                }
//            } catch (Exception e) {
//                // Repository might not be configured yet, continue
//            }
//        }
//
//        // Try College Connect module (Module 3)
//        if (connectCoUserRepository != null) {
//            try {
//                com.college.erp.connect.entity.User connectUser = connectCoUserRepository.findByEmail(email)
//                        .orElse(null);
//                if (connectUser != null) {
//                    return buildUserDetailsFromConnectUser(connectUser);
//                }
//            } catch (Exception e) {
//                // Repository might not be configured yet, continue
//            }
//        }
//
//        throw new UsernameNotFoundException("User not found with email: " + email);
//    }
//
//    /**
//     * Build UserDetails from ERP module User (Module 1)
//     */
//    private UserDetails buildUserDetailsFromErpUser(com.college.erp.erp.entity.User user) {
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),  // ← Use email as the UserDetails username
//                user.getPassword(),
//                user.getIsActive(),
//                true,
//                true,
//                true,
//                getAuthoritiesFromErpUser(user)
//        );
//    }
//
//    /**
//     * Build UserDetails from Admissions module User (Module 2)
//     */
//    private UserDetails buildUserDetailsFromAdmissionsUser(com.college.erp.admissions.entity.User user) {
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPasswordHash(),
//                Boolean.TRUE.equals(user.getIsActive()),
//
//        true,
//                true,
//                true,
//                getAuthoritiesFromAdmissionsUser(user)
//        );
//    }
//
//    /**
//     * Build UserDetails from College Connect module User (Module 3)
//     */
//    private UserDetails buildUserDetailsFromConnectUser(com.college.erp.connect.entity.User user) {
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPassword(),
//                true, // enabled
//                true, // accountNonExpired
//                true, // credentialsNonExpired
//                true, // accountNonLocked
//                getAuthoritiesFromConnectUser(user)
//        );
//    }
//
//    /**
//     * Get authorities from ERP User (single UserRole enum)
//     */
//    private Collection<? extends GrantedAuthority> getAuthoritiesFromErpUser(
//            com.college.erp.erp.entity.User user) {
//        return Collections.singletonList(
//                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
//        );
//    }
//
//    /**
//     * Get authorities from Admissions User (single Role enum)
//     */
//    private Collection<? extends GrantedAuthority> getAuthoritiesFromAdmissionsUser(
//            com.college.erp.admissions.entity.User user) {
//        return Collections.singletonList(
//                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
//        );
//    }
//
//    /**
//     * Get authorities from College Connect User (Set<Role> entities)
//     */
//    private Collection<? extends GrantedAuthority> getAuthoritiesFromConnectUser(
//            com.college.erp.connect.entity.User user) {
//        if (user.getRoles() == null || user.getRoles().isEmpty()) {
//            return Collections.emptyList();
//        }
//        return user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().name()))
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Helper method to get user from any module by email
//     * Returns a generic object that can be cast to appropriate type
//     */
//    public Object findUserByEmail(String email) {
//        // Try ERP module
//        if (erpUserRepository != null) {
//            try {
//                var user = erpUserRepository.findByEmail(email).orElse(null);
//                if (user != null) return user;
//            } catch (Exception ignored) {}
//        }
//
//        // Try Admissions module
//        if (admissionsAdUserRepository != null) {
//            try {
//                var user = admissionsAdUserRepository.findByEmail(email).orElse(null);
//                if (user != null) return user;
//            } catch (Exception ignored) {}
//        }
//
//        // Try Connect module
//        if (connectCoUserRepository != null) {
//            try {
//                var user = connectCoUserRepository.findByEmail(email).orElse(null);
//                if (user != null) return user;
//            } catch (Exception ignored) {}
//        }
//
//        return null;
//    }
//}



package com.college.erp.security;

import com.college.erp.admissions.repository.AdUserRepository;
import com.college.erp.connect.repository.CoUserRepository;
import com.college.erp.erp.repository.ErpUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

/**
 * Unified UserDetailsService — searches all module user tables in order:
 *  1. ERP (com.college.erp.erp.entity.User)
 *  2. Admissions (com.college.erp.admissions.entity.User)
 *  3. Connect (com.college.erp.connect.entity.User)
 *
 * Key fix: Admissions User stores the password in `passwordHash`, NOT `password`.
 */
@Slf4j
@Service
public class UnifiedUserDetailsService implements UserDetailsService {

    @Autowired(required = false)
    private ErpUserRepository erpUserRepository;

    @Autowired(required = false)
    private AdUserRepository admissionsAdUserRepository;

    @Autowired(required = false)
    private CoUserRepository connectCoUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // ── 1. Try ERP module ──────────────────────────────────────────
        if (erpUserRepository != null) {
            try {
                com.college.erp.erp.entity.User erpUser =
                        erpUserRepository.findByEmail(email).orElse(null);

                // Fallback: some ERP setups store username separately
                if (erpUser == null) {
                    erpUser = erpUserRepository.findByUsername(email).orElse(null);
                }

                if (erpUser != null) {
                    return buildUserDetailsFromErpUser(erpUser);
                }
            } catch (Exception e) {
                log.debug("Could not load user from ERP repository: {}", e.getMessage());
            }
        }

        // ── 2. Try Admissions module ───────────────────────────────────
        if (admissionsAdUserRepository != null) {
            try {
                com.college.erp.admissions.entity.User admUser =
                        admissionsAdUserRepository.findByEmail(email).orElse(null);
                if (admUser != null) {
                    return buildUserDetailsFromAdmissionsUser(admUser);
                }
            } catch (Exception e) {
                log.debug("Could not load user from Admissions repository: {}", e.getMessage());
            }
        }

        // ── 3. Try Connect module ──────────────────────────────────────
        if (connectCoUserRepository != null) {
            try {
                com.college.erp.connect.entity.User connectUser =
                        connectCoUserRepository.findByEmail(email).orElse(null);
                if (connectUser != null) {
                    return buildUserDetailsFromConnectUser(connectUser);
                }
            } catch (Exception e) {
                log.debug("Could not load user from Connect repository: {}", e.getMessage());
            }
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ERP User  (single UserRole enum, password field named "password")
    // ─────────────────────────────────────────────────────────────────────────
    private UserDetails buildUserDetailsFromErpUser(com.college.erp.erp.entity.User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),           // ERP uses getPassword()
                user.getIsActive(),
                true, true, true,
                getAuthoritiesFromErpUser(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthoritiesFromErpUser(
            com.college.erp.erp.entity.User user) {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admissions User  (single UserRole enum, password field named "passwordHash")
    // ─────────────────────────────────────────────────────────────────────────
    private UserDetails buildUserDetailsFromAdmissionsUser(
            com.college.erp.admissions.entity.User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),       // ← CRITICAL: Admissions entity uses passwordHash
                Boolean.TRUE.equals(user.getIsActive()),
                true, true, true,
                getAuthoritiesFromAdmissionsUser(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthoritiesFromAdmissionsUser(
            com.college.erp.admissions.entity.User user) {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Connect User  (Set<Role> entities, password field named "password")
    // ─────────────────────────────────────────────────────────────────────────
    private UserDetails buildUserDetailsFromConnectUser(
            com.college.erp.connect.entity.User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                true, true, true, true,
                getAuthoritiesFromConnectUser(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthoritiesFromConnectUser(
            com.college.erp.connect.entity.User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return Collections.emptyList();
        }
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().name()))
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Utility helpers used by UnifiedSecurityUtil
    // ─────────────────────────────────────────────────────────────────────────
    public Object findUserByEmail(String email) {
        if (erpUserRepository != null) {
            try {
                var u = erpUserRepository.findByEmail(email).orElse(null);
                if (u != null) return u;
            } catch (Exception ignored) {}
        }
        if (admissionsAdUserRepository != null) {
            try {
                var u = admissionsAdUserRepository.findByEmail(email).orElse(null);
                if (u != null) return u;
            } catch (Exception ignored) {}
        }
        if (connectCoUserRepository != null) {
            try {
                var u = connectCoUserRepository.findByEmail(email).orElse(null);
                if (u != null) return u;
            } catch (Exception ignored) {}
        }
        return null;
    }
}