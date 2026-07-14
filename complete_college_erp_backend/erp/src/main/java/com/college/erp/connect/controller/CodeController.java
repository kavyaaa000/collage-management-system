package com.college.erp.connect.controller;

import com.college.erp.connect.dto.*;
import com.college.erp.connect.service.CodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connect/contests/{contestId}/code")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @PostMapping("/problems")
    public ResponseEntity addProblem(@PathVariable Long contestId,
                                     @Valid @RequestBody CodeProblemRequest request,
                                     Authentication authentication) {
        try {
            CodeProblemResponse response = codeService.addProblem(contestId, request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/problems")
    public ResponseEntity getProblems(@PathVariable Long contestId,
                                      Authentication authentication) {
        try {
            List problems = codeService.getProblemsByContest(contestId, authentication.getName());
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/problems/{problemId}")
    public ResponseEntity getProblemById(@PathVariable Long contestId,
                                         @PathVariable Long problemId,
                                         Authentication authentication) {
        try {
            CodeProblemResponse problem = codeService.getProblemById(problemId, authentication.getName());
            return ResponseEntity.ok(problem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity submitCode(@PathVariable Long contestId,
                                     @Valid @RequestBody CodeSubmissionRequest request,
                                     Authentication authentication) {
        try {
            CodeSubmissionResponse response = codeService.submitCode(contestId, request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/submissions")
    public ResponseEntity getUserSubmissions(@PathVariable Long contestId,
                                             Authentication authentication) {
        try {
            List submissions = codeService.getUserSubmissions(contestId, authentication.getName());
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
