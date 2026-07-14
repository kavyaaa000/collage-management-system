package com.college.erp.evaluation.controller;

import com.college.erp.evaluation.dto.AnswerKeyDTO;
import com.college.erp.evaluation.service.AnswerKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eva/answer-keys")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AnswerKeyController {

    private final AnswerKeyService answerKeyService;

    @PostMapping
    public ResponseEntity<AnswerKeyDTO> createAnswerKey(@Valid @RequestBody AnswerKeyDTO dto) {
        log.info("POST /api/answer-keys - Creating answer key");
        AnswerKeyDTO created = answerKeyService.createAnswerKey(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{keyId}")
    public ResponseEntity<AnswerKeyDTO> getAnswerKey(@PathVariable Integer keyId) {
        log.info("GET /api/answer-keys/{} - Fetching answer key", keyId);
        AnswerKeyDTO answerKey = answerKeyService.getAnswerKeyById(keyId);
        return ResponseEntity.ok(answerKey);
    }

    @GetMapping
    public ResponseEntity<List<AnswerKeyDTO>> getAnswerKeys(
            @RequestParam Integer examId,
            @RequestParam Integer subjectId) {
        log.info("GET /api/answer-keys - Fetching answer keys for exam: {}, subject: {}", examId, subjectId);
        List<AnswerKeyDTO> answerKeys = answerKeyService.getAnswerKeysByExamAndSubject(examId, subjectId);
        return ResponseEntity.ok(answerKeys);
    }

    @PutMapping("/{keyId}")
    public ResponseEntity<AnswerKeyDTO> updateAnswerKey(
            @PathVariable Integer keyId,
            @Valid @RequestBody AnswerKeyDTO dto) {
        log.info("PUT /api/answer-keys/{} - Updating answer key", keyId);
        AnswerKeyDTO updated = answerKeyService.updateAnswerKey(keyId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> deleteAnswerKey(
            @PathVariable Integer keyId,
            @RequestParam Integer staffId) {
        log.info("DELETE /api/answer-keys/{} - Deleting answer key", keyId);
        answerKeyService.deleteAnswerKey(keyId, staffId);
        return ResponseEntity.noContent().build();
    }
}