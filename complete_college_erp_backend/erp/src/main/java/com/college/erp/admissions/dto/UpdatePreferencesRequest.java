package com.college.erp.admissions.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePreferencesRequest {
    @NotNull(message = "Preferences list is required")
    @Size(min = 1, max = 10, message = "Must select 1-10 preferences")
    private List<PreferenceItem> preferences;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PreferenceItem {
        @NotNull(message = "Department ID is required")
        private Long departmentId;

        @NotNull(message = "Preference order is required")
        @Min(value = 1, message = "Preference order must start from 1")
        private Integer preferenceOrder;
    }
}