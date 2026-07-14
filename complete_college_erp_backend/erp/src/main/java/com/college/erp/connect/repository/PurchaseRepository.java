package com.college.erp.connect.repository;

import com.college.erp.connect.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserIdOrderByPurchasedAtDesc(Long userId);
    List<Purchase> findByStatusOrderByPurchasedAtDesc(PurchaseStatus status);
    List<Purchase> findByUserIdAndStatusIn(Long userId, List<PurchaseStatus> statuses);
    @Query("SELECT p FROM Purchase p " +
            "LEFT JOIN FETCH p.user " +
            "LEFT JOIN FETCH p.item " +
            "LEFT JOIN FETCH p.approvedBy")
    List<Purchase> findAllWithDetails();

    @Query("SELECT p FROM Purchase p " +
            "LEFT JOIN FETCH p.user " +
            "LEFT JOIN FETCH p.item " +
            "LEFT JOIN FETCH p.approvedBy " +
            "WHERE p.status = :status " +
            "ORDER BY p.purchasedAt DESC")
    List<Purchase> findByStatusWithDetails(@Param("status") PurchaseStatus status);
}