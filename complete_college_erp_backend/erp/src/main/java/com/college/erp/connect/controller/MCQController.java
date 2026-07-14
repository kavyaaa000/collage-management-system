package com.college.erp.connect.controller;

import com.college.erp.connect.dto.MCQQuestionRequest;
import com.college.erp.connect.dto.MCQQuestionResponse;
import com.college.erp.connect.dto.MCQSubmissionRequest;
import com.college.erp.connect.service.MCQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connect/contests/{contestId}/mcq")
@RequiredArgsConstructor
public class MCQController {

    private final MCQService mcqService;

    @PostMapping("/questions")
    public ResponseEntity addQuestion(@PathVariable Long contestId,
                                      @Valid @RequestBody MCQQuestionRequest request,
                                      Authentication authentication) {
        try {
            MCQQuestionResponse response = mcqService.addQuestion(contestId, request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/questions")
    public ResponseEntity getQuestions(@PathVariable Long contestId,
                                       Authentication authentication) {
        try {
            List questions = mcqService.getQuestionsByContest(contestId, authentication.getName());
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/submit")
    public ResponseEntity submitAnswer(@PathVariable Long contestId,
                                       @Valid @RequestBody MCQSubmissionRequest request,
                                       Authentication authentication) {
        try {
            MCQQuestionResponse response = mcqService.submitAnswer(contestId, request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}