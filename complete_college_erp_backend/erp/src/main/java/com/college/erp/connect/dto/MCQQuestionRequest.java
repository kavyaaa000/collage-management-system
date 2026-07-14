package com.college.erp.connect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MCQQuestionRequest {

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Options are required")
    private List<String> options;


    @NotNull(message = "Correct option index is required")
    private Integer correctOptionIndex;

    @Builder.Default
    private Integer points = 10;

    @Builder.Default
    private Integer orderIndex = 0;
}