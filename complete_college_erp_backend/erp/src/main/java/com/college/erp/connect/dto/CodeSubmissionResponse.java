package com.college.erp.connect.dto;

import com.college.erp.connect.entity.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmissionResponse {

    private Long id;
    private Long problemId;
    private String problemTitle;
    private SubmissionStatus status;
    private Integer passedTestCases;
    private Integer totalTestCases;
    private Integer executionTime;
    private Integer memoryUsed;
    private String compilerOutput;
    private String stderr;
    private Integer pointsEarned;
    private LocalDateTime submittedAt;
    private String language;
}