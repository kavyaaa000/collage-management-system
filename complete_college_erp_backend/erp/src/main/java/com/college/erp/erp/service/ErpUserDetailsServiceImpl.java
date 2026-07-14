//package com.college.erp.erp.service;
//
//import com.college.erp.erp.entity.User;
//import com.college.erp.erp.repository.ErpUserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//
//@Service
//@RequiredArgsConstructor
//public class ErpUserDetailsServiceImpl implements UserDetailsService {
//
//    private final ErpUserRepository erpUserRepository;  // FIXED: Changed "the" to "final"
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = erpUserRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//
//        // CRITICAL: Create authority with the role name exactly as it appears in the enum
//        // Spring Security expects "ADMIN" not "ROLE_ADMIN" when using hasAuthority()
//        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());
//
//        return org.springframework.security.core.userdetails.User.builder()
//                .username(user.getUsername())
//                .password(user.getPassword())
//                .authorities(Collections.singletonList(authority))
//                .accountExpired(false)
//                .accountLocked(false)
//                .credentialsExpired(false)
//                .disabled(!user.getIsActive())
//                .build();
//    }
//}