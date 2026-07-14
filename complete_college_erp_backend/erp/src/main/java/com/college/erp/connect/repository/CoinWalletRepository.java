// src/main/java/com/collegeconnect/repository/CoinWalletRepository.java
package com.college.erp.connect.repository;

import com.college.erp.connect.entity.CoinWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoinWalletRepository extends JpaRepository<CoinWallet, Long> {
    Optional<CoinWallet> findByUserId(Long userId);

    @Query("SELECT w FROM CoinWallet w ORDER BY w.totalEarned DESC")
    List<CoinWallet> findTopEarners();
}