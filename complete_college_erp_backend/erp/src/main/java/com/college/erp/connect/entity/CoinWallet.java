// src/main/java/com/collegeconnect/model/CoinWallet.java
package com.college.erp.connect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "coin_wallets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoinWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer balance = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalEarned = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalSpent = 0;

    @UpdateTimestamp
    @Column(nullable = true)
    private LocalDateTime updatedAt;
}