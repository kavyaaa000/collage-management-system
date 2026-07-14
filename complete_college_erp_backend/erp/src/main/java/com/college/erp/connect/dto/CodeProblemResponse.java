package com.college.erp.connect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeProblemResponse {

    private Long id;
    private Long contestId;
    private String title;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;
    private Integer points;
    private Integer timeLimit;
    private Integer memoryLimit;
    private Integer orderIndex;
    private Integer totalTestCases;
    private Integer userBestScore;
    private Boolean isSolved;
}