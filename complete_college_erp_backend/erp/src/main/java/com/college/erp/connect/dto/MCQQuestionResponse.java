package com.college.erp.connect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MCQQuestionResponse {

    private Long id;
    private Long contestId;
    private String questionText;
    private List<String> options;
    private Integer points;
    private Integer orderIndex;
    private Integer correctOptionIndex; // Only for creators
    private Integer userSelectedIndex; // User's submission
    private Boolean isCorrect; // Result if submitted
}