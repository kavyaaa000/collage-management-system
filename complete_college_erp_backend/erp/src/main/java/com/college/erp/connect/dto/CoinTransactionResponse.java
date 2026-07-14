package com.college.erp.connect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoinTransactionResponse {
    private Long id;
    private String type;
    private Integer amount;
    private Integer balanceAfter;
    private String description;
    private String contestTitle;
    private LocalDateTime createdAt;
}