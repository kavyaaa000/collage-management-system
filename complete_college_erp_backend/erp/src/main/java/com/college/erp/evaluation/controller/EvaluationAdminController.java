package com.college.erp.evaluation.controller;

import com.college.erp.evaluation.entity.ExamControl;
import com.college.erp.exception.ResourceNotFoundException;
import com.college.erp.evaluation.repository.ExamControlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/eva/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EvaluationAdminController {

    private final ExamControlRepository examControlRepository;

    @PostMapping("/exam-control")
    public ResponseEntity<ExamControl> createOrUpdateExamControl(
            @RequestParam Integer examId,
            @RequestParam Integer subjectId,
            @RequestParam Integer sessionId,
            @RequestParam Boolean marksEntryEnabled,
            @RequestParam Boolean aiEvaluationEnabled,
            @RequestParam Integer adminId) {

        log.info("POST /api/admin/exam-control - Creating/updating exam control");

        ExamControl control = examControlRepository.findByExamIdAndSubjectIdAndSessionId(examId, subjectId, sessionId)
                .orElse(ExamControl.builder()
                        .examId(examId)
                        .subjectId(subjectId)
                        .sessionId(sessionId)
                        .build());

        control.setMarksEntryEnabled(marksEntryEnabled);
        control.setAiEvaluationEnabled(aiEvaluationEnabled);
        control.setEnabledBy(adminId);
        control.setEnabledAt(LocalDateTime.now());

        ExamControl saved = examControlRepository.save(control);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/exam-control")
    public ResponseEntity<ExamControl> getExamControl(
            @RequestParam Integer examId,
            @RequestParam Integer subjectId,
            @RequestParam Integer sessionId) {

        log.info("GET /api/admin/exam-control - Fetching exam control");

        ExamControl control = examControlRepository.findByExamIdAndSubjectIdAndSessionId(examId, subjectId, sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam control not found"));

        return ResponseEntity.ok(control);
    }

    @GetMapping("/exam-controls/{examId}")
    public ResponseEntity<List<ExamControl>> getExamControls(@PathVariable Integer examId) {
        log.info("GET /api/admin/exam-controls/{} - Fetching all controls for exam", examId);
        List<ExamControl> controls = examControlRepository.findByExamId(examId);
        return ResponseEntity.ok(controls);
    }
}