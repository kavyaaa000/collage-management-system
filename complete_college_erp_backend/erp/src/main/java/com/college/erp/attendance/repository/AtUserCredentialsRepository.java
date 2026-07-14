package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AtUserCredentialsRepository extends JpaRepository<UserCredentials, Integer> {

    Optional<UserCredentials> findByUsername(String username);

    Optional<UserCredentials> findByUserTypeAndReferenceId(
            UserCredentials.UserType userType, Integer referenceId);

    boolean existsByUsername(String username);
}