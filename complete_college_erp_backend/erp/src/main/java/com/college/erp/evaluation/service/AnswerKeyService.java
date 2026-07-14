package com.college.erp.evaluation.service;

import com.college.erp.evaluation.dto.AnswerKeyDTO;
import com.college.erp.evaluation.dto.KeywordDTO;
import com.college.erp.evaluation.entity.AnswerKey;
import com.college.erp.evaluation.entity.AnswerKeyKeyword;
import com.college.erp.evaluation.entity.EvaluationAuditLog;
import com.college.erp.exception.ResourceNotFoundException;
import com.college.erp.exception.ValidationException;
import com.college.erp.evaluation.repository.AnswerKeyKeywordRepository;
import com.college.erp.evaluation.repository.AnswerKeyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerKeyService {

    private final AnswerKeyRepository answerKeyRepository;
    private final AnswerKeyKeywordRepository keywordRepository;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Transactional
    public AnswerKeyDTO createAnswerKey(AnswerKeyDTO dto) {
        log.info("Creating answer key for exam: {}, subject: {}, question: {}",
                dto.getExamId(), dto.getSubjectId(), dto.getQuestionNumber());

        // Validate uniqueness
        if (answerKeyRepository.existsByExamIdAndSubjectIdAndQuestionNumber(
                dto.getExamId(), dto.getSubjectId(), dto.getQuestionNumber())) {
            throw new ValidationException("Answer key already exists for this question");
        }

        // Create entity
        AnswerKey answerKey = AnswerKey.builder()
                .examId(dto.getExamId())
                .subjectId(dto.getSubjectId())
                .questionNumber(dto.getQuestionNumber())
                .questionText(dto.getQuestionText())
                .maxMarks(dto.getMaxMarks())
                .markingScheme(dto.getMarkingScheme())
                .createdBy(dto.getCreatedBy())
                .build();

        // Add keywords
        for (KeywordDTO keywordDTO : dto.getKeywords()) {
            AnswerKeyKeyword keyword = AnswerKeyKeyword.builder()
                    .keyword(keywordDTO.getKeyword())
                    .keywordType(AnswerKeyKeyword.KeywordType.valueOf(keywordDTO.getKeywordType()))
                    .weight(keywordDTO.getWeight())
                    .synonyms(keywordDTO.getSynonyms())
                    .isMandatory(keywordDTO.getIsMandatory())
                    .build();
            answerKey.addKeyword(keyword);
        }

        // Save
        AnswerKey savedKey = answerKeyRepository.save(answerKey);

        // Audit log (trigger will handle this, but we can add custom log)
        auditService.logAction(
                EvaluationAuditLog.ActionType.UPLOAD,
                EvaluationAuditLog.EntityType.ANSWER_KEY,
                savedKey.getKeyId(),
                dto.getCreatedBy(),
                EvaluationAuditLog.UserRole.STAFF,
                null,
                "Answer key created with " + dto.getKeywords().size() + " keywords"
        );

        log.info("Answer key created successfully with ID: {}", savedKey.getKeyId());
        return convertToDTO(savedKey);
    }

    @Transactional(readOnly = true)
    public List<AnswerKeyDTO> getAnswerKeysByExamAndSubject(Integer examId, Integer subjectId) {
        log.info("Fetching answer keys for exam: {}, subject: {}", examId, subjectId);

        List<AnswerKey> answerKeys = answerKeyRepository.findByExamIdAndSubjectIdWithKeywords(examId, subjectId);

        return answerKeys.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnswerKeyDTO getAnswerKeyById(Integer keyId) {
        log.info("Fetching answer key with ID: {}", keyId);

        AnswerKey answerKey = answerKeyRepository.findByIdWithKeywords(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer key not found with ID: " + keyId));

        return convertToDTO(answerKey);
    }

    @Transactional
    public AnswerKeyDTO updateAnswerKey(Integer keyId, AnswerKeyDTO dto) {
        log.info("Updating answer key with ID: {}", keyId);

        AnswerKey answerKey = answerKeyRepository.findByIdWithKeywords(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer key not found with ID: " + keyId));

        // Store old value for audit
        String oldValue = convertToJson(answerKey);

        // Update fields
        answerKey.setQuestionText(dto.getQuestionText());
        answerKey.setMaxMarks(dto.getMaxMarks());
        answerKey.setMarkingScheme(dto.getMarkingScheme());

        // Remove old keywords
        answerKey.getKeywords().clear();

        // Add new keywords
        for (KeywordDTO keywordDTO : dto.getKeywords()) {
            AnswerKeyKeyword keyword = AnswerKeyKeyword.builder()
                    .keyword(keywordDTO.getKeyword())
                    .keywordType(AnswerKeyKeyword.KeywordType.valueOf(keywordDTO.getKeywordType()))
                    .weight(keywordDTO.getWeight())
                    .synonyms(keywordDTO.getSynonyms())
                    .isMandatory(keywordDTO.getIsMandatory())
                    .build();
            answerKey.addKeyword(keyword);
        }

        AnswerKey updatedKey = answerKeyRepository.save(answerKey);

        // Audit log
        auditService.logAction(
                EvaluationAuditLog.ActionType.STAFF_REVIEW,
                EvaluationAuditLog.EntityType.ANSWER_KEY,
                keyId,
                dto.getCreatedBy(),
                EvaluationAuditLog.UserRole.STAFF,
                oldValue,
                "Answer key updated"
        );

        log.info("Answer key updated successfully");
        return convertToDTO(updatedKey);
    }

    @Transactional
    public void deleteAnswerKey(Integer keyId, Integer staffId) {
        log.info("Deleting answer key with ID: {}", keyId);

        AnswerKey answerKey = answerKeyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer key not found with ID: " + keyId));

        // Audit log before deletion
        auditService.logAction(
                EvaluationAuditLog.ActionType.DELETE,
                EvaluationAuditLog.EntityType.ANSWER_KEY,
                keyId,
                staffId,
                EvaluationAuditLog.UserRole.STAFF,
                convertToJson(answerKey),
                "Answer key deleted"
        );

        answerKeyRepository.delete(answerKey);
        log.info("Answer key deleted successfully");
    }

    private AnswerKeyDTO convertToDTO(AnswerKey answerKey) {
        List<KeywordDTO> keywordDTOs = answerKey.getKeywords().stream()
                .map(keyword -> KeywordDTO.builder()
                        .keywordId(keyword.getKeywordId())
                        .keyword(keyword.getKeyword())
                        .keywordType(keyword.getKeywordType().name())
                        .weight(keyword.getWeight())
                        .synonyms(keyword.getSynonyms())
                        .isMandatory(keyword.getIsMandatory())
                        .build())
                .collect(Collectors.toList());

        return AnswerKeyDTO.builder()
                .keyId(answerKey.getKeyId())
                .examId(answerKey.getExamId())
                .subjectId(answerKey.getSubjectId())
                .questionNumber(answerKey.getQuestionNumber())
                .questionText(answerKey.getQuestionText())
                .maxMarks(answerKey.getMaxMarks())
                .markingScheme(answerKey.getMarkingScheme())
                .createdBy(answerKey.getCreatedBy())
                .keywords(keywordDTOs)
                .build();
    }

    private String convertToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("Error converting to JSON", e);
            return null;
        }
    }
}