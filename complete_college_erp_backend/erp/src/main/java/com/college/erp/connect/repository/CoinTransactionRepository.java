// src/main/java/com/collegeconnect/repository/CoinTransactionRepository.java
package com.college.erp.connect.repository;

import com.college.erp.connect.entity.CoinTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoinTransactionRepository extends JpaRepository<CoinTransaction, Long> {
    List<CoinTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
    List<CoinTransaction> findByWalletUserIdOrderByCreatedAtDesc(Long userId);
}