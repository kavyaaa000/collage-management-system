package com.college.erp.connect.dto;

import com.college.erp.connect.entity.ItemCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreItemRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private ItemCategory category;

    @NotNull
    @Min(1)
    private Integer price;

    @NotNull
    @Min(0)
    private Integer stock;

    private String imageUrl;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean requiresApproval = false;

    private Integer cooldownHours;
    private String metadata;
}