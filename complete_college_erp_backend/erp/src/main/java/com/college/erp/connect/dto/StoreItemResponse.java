package com.college.erp.connect.dto;

import com.college.erp.connect.entity.ItemCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreItemResponse {
    private Long id;
    private String name;
    private String description;
    private ItemCategory category;
    private Integer price;
    private Integer stock;
    private String imageUrl;
    private Boolean isActive;
    private Boolean requiresApproval;
    private Integer cooldownHours;
    private String metadata;
}