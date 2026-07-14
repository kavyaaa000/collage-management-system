package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.response.TopPerformerResponse;
import com.college.erp.attendance.entity.TopPerformer;
import com.college.erp.attendance.service.AtTopPerformerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("at/top-performers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Top Performers", description = "Top performers and leaderboard APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TopPerformerController {

    private final AtTopPerformerService atTopPerformerService;

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get top performers", description = "Get top performers for a class")
    public ResponseEntity<List<TopPerformerResponse>> getTopPerformers(
            @PathVariable Integer classId,
            @RequestParam Integer semesterId,
            @RequestParam(defaultValue = "25") Integer academicSessionId) {
        log.info("Fetching top performers for class: {}", classId);
        List<TopPerformerResponse> performers = atTopPerformerService.getTopPerformers(
                classId, semesterId, academicSessionId);
        return ResponseEntity.ok(performers);
    }

    @GetMapping("/class/{classId}/category/{category}")
    @Operation(summary = "Get top performers by category", description = "Get top performers filtered by category")
    public ResponseEntity<List<TopPerformerResponse>> getTopPerformersByCategory(
            @PathVariable Integer classId,
            @PathVariable String category) {
        log.info("Fetching top performers by category: {} for class: {}", category, classId);
        TopPerformer.Category performerCategory = TopPerformer.Category.valueOf(category);
        List<TopPerformerResponse> performers = atTopPerformerService.getTopPerformersByCategory(
                classId, performerCategory);
        return ResponseEntity.ok(performers);
    }
}