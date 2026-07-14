package com.college.erp.connect.controller;

import com.college.erp.connect.dto.ApprovalRequest;
import com.college.erp.connect.dto.ContestRequest;
import com.college.erp.connect.dto.ContestResponse;
import com.college.erp.connect.service.ContestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connect/contests")
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;

    @PostMapping
    public ResponseEntity<?> createContest(@Valid @RequestBody ContestRequest request,
                                           Authentication authentication) {
        try {
            ContestResponse response = contestService.createContest(request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/visible")
    public ResponseEntity<?> getVisibleContests(Authentication authentication) {
        try {
            List<ContestResponse> contests = contestService.getVisibleContests(authentication.getName());
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingApprovals(Authentication authentication) {
        try {
            List<ContestResponse> contests = contestService.getPendingApprovals(authentication.getName());
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContestById(@PathVariable Long id, Authentication authentication) {
        try {
            ContestResponse response = contestService.getContestById(id, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveContest(@PathVariable Long id,
                                            @Valid @RequestBody ApprovalRequest request,
                                            Authentication authentication) {
        try {
            ContestResponse response = contestService.approveContest(id, request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}