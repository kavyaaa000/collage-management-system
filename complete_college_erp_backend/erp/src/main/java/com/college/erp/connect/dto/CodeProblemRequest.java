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
public class CodeProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;

    @NotNull(message = "Test cases are required")
    private List<TestCaseRequest> testCases;



    @Builder.Default
    private Integer points = 100;

    @Builder.Default
    private Integer timeLimit = 2000;

    @Builder.Default
    private Integer memoryLimit = 256000;

    @Builder.Default
    private Integer orderIndex = 0;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCaseRequest {
        private String input;
        private String expectedOutput;

        @Builder.Default
        private Boolean isSample = false;
    }
}