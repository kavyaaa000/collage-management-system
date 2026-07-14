package com.college.erp.connect.repository;

import com.college.erp.connect.entity.ActivePowerUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivePowerUpRepository extends JpaRepository<ActivePowerUp, Long> {
    List<ActivePowerUp> findByUserIdAndIsActiveTrueAndExpiresAtAfter(
            Long userId, LocalDateTime now);

    @Query("SELECT p FROM ActivePowerUp p WHERE p.isActive = true " +
            "AND p.expiresAt < :now")
    List<ActivePowerUp> findExpiredPowerUps(LocalDateTime now);
}