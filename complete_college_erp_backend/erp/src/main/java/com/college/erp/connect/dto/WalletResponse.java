package com.college.erp.connect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponse {
    private Long userId;
    private String userName;
    private Integer balance;
    private Integer totalEarned;
    private Integer totalSpent;
}