package com.college.erp.evaluation.controller;

import com.college.erp.evaluation.dto.StatsDTO;
import com.college.erp.evaluation.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eva/stats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<StatsDTO> getStats(
            @RequestParam Integer examId,
            @RequestParam Integer subjectId) {

        log.info("GET /api/stats - Fetching stats for exam: {}, subject: {}", examId, subjectId);
        StatsDTO stats = statsService.getStats(examId, subjectId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshStats(
            @RequestParam Integer examId,
            @RequestParam Integer subjectId) {

        log.info("POST /api/stats/refresh - Refreshing stats");
        statsService.updateStats(examId, subjectId);
        return ResponseEntity.ok().build();
    }
}