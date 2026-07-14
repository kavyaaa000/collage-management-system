package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdUserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByRole(User.UserRole role);

    List<User> findByRoleAndIsActive(User.UserRole role, Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.role = 'STAFF' AND u.isActive = true")
    List<User> findAllActiveStaff();
}
