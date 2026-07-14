package com.college.erp.connect.dto;

import com.college.erp.connect.entity.ContestScope;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Scope is required")
    private ContestScope scope;

    private String departmentCode;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotNull(message = "Remove time is required")
    private LocalDateTime removeTime;

    @Builder.Default
    private Integer mcqCount = 0;

    @Builder.Default
    private Integer codeCount = 0;

    private List<String> allowedLanguages;
}