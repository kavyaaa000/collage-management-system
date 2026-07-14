package com.college.erp.connect.dto;

import com.college.erp.connect.entity.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponse {
    private Long userId;           // Add this
    private String userName;
    private Long id;
    private Long itemId;
    private String itemName;
    private String itemCategory;
    private Integer quantity;
    private Integer totalPrice;
    private PurchaseStatus status;
    private LocalDateTime purchasedAt;
    private LocalDateTime approvedAt;
    private String approvedByName;
    private String rejectionReason;
    private String redemptionCode;
    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;
}