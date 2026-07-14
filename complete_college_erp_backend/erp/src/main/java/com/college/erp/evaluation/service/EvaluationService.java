package com.college.erp.evaluation.service;

import com.college.erp.evaluation.dto.*;
import com.college.erp.evaluation.entity.*;
import com.college.erp.exception.ResourceNotFoundException;
import com.college.erp.exception.ValidationException;
import com.college.erp.evaluation.repository.*;
import com.college.erp.evaluation.util.FileStorageUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final StudentAnswerSheetRepository answerSheetRepository;
    private final AnswerKeyRepository answerKeyRepository;
    private final AIEvaluationLogRepository evaluationLogRepository;
    private final StaffMarkOverrideRepository markOverrideRepository;
    private final ExamControlRepository examControlRepository;
    private final AIEngineService aiEngineService;
    private final AuditService auditService;
    private final StatsService statsService;
    private final FileStorageUtil fileStorageUtil;
    private final ObjectMapper objectMapper;

    @Transactional
    public AnswerSheetUploadDTO uploadAnswerSheet(MultipartFile file, Integer examId, Integer studentId,
                                                  Integer subjectId, Integer uploadedBy, Integer sessionId) {
        log.info("Uploading answer sheet for student: {}, exam: {}, subject: {}", studentId, examId, subjectId);

        // Check if control allows upload
        ExamControl control = examControlRepository.findByExamIdAndSubjectIdAndSessionId(examId, subjectId, sessionId)
                .orElseThrow(() -> new ValidationException("Exam control not configured for this exam and subject"));

        if (!control.getMarksEntryEnabled()) {
            throw new ValidationException("Marks entry is disabled for this exam");
        }

        // Check if already uploaded
        if (answerSheetRepository.existsByExamIdAndStudentIdAndSubjectId(examId, studentId, subjectId)) {
            throw new ValidationException("Answer sheet already uploaded for this student");
        }

        // Store file
        String filePath = fileStorageUtil.storeFile(file, examId, studentId, subjectId);

        // Create entity
        StudentAnswerSheet answerSheet = StudentAnswerSheet.builder()
                .examId(examId)
                .studentId(studentId)
                .subjectId(subjectId)
                .pdfFilePath(filePath)
                .pdfOriginalName(file.getOriginalFilename())
                .pdfFileSize(file.getSize())
                .uploadStatus(StudentAnswerSheet.UploadStatus.UPLOADED)
                .uploadedBy(uploadedBy)
                .build();

        StudentAnswerSheet savedSheet = answerSheetRepository.save(answerSheet);

        // Audit log
        auditService.logAction(
                EvaluationAuditLog.ActionType.UPLOAD,
                EvaluationAuditLog.EntityType.ANSWER_SHEET,
                savedSheet.getSheetId(),
                uploadedBy,
                EvaluationAuditLog.UserRole.STAFF,
                null,
                "Answer sheet uploaded"
        );

        // Update stats
        statsService.updateStats(examId, subjectId);

        log.info("Answer sheet uploaded successfully with ID: {}", savedSheet.getSheetId());

        return convertToUploadDTO(savedSheet);
    }

    @Transactional
    public EvaluationResponseDTO startAIEvaluation(Integer sheetId, Integer sessionId) {
        log.info("Starting AI evaluation for sheet_id: {}", sheetId);

        StudentAnswerSheet answerSheet = answerSheetRepository.findById(sheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer sheet not found with ID: " + sheetId));

        // Check if control allows AI evaluation
        ExamControl control = examControlRepository.findByExamIdAndSubjectIdAndSessionId(
                        answerSheet.getExamId(), answerSheet.getSubjectId(), sessionId)
                .orElseThrow(() -> new ValidationException("Exam control not configured"));

        if (!control.getAiEvaluationEnabled()) {
            throw new ValidationException("AI evaluation is disabled for this exam");
        }

        // Get answer keys
        List<AnswerKey> answerKeys = answerKeyRepository.findByExamIdAndSubjectIdWithKeywords(
                answerSheet.getExamId(), answerSheet.getSubjectId()
        );

        if (answerKeys.isEmpty()) {
            throw new ValidationException("No answer keys defined for this exam and subject");
        }

        // Update status to PROCESSING
        answerSheet.setUploadStatus(StudentAnswerSheet.UploadStatus.PROCESSING);
        answerSheetRepository.save(answerSheet);

        // Audit log
        auditService.logAction(
                EvaluationAuditLog.ActionType.OCR_START,
                EvaluationAuditLog.EntityType.ANSWER_SHEET,
                sheetId,
                null,
                EvaluationAuditLog.UserRole.SYSTEM,
                null,
                "AI evaluation started"
        );

        try {
            // Prepare request for AI engine
// Prepare request for AI engine (NO pdfFilePath)
            EvaluationRequestDTO aiRequest = EvaluationRequestDTO.builder()
                    .sheetId(sheetId)
                    .examId(answerSheet.getExamId())
                    .studentId(answerSheet.getStudentId())
                    .subjectId(answerSheet.getSubjectId())
                    .answerKeys(convertAnswerKeysToDTO(answerKeys))
                    .build();

// Create File object from stored path
            File pdfFile = new File(answerSheet.getPdfFilePath());

            if (!pdfFile.exists()) {
                throw new ValidationException(
                        "Answer sheet PDF file not found at path: " + answerSheet.getPdfFilePath()
                );
            }

// Call AI Engine (NEW SIGNATURE)
            EvaluationResponseDTO aiResponse =
                    aiEngineService.evaluateAnswerSheet(aiRequest, pdfFile);


            // Save AI evaluation results
            saveEvaluationResults(answerSheet, aiResponse);

            // Update status
            answerSheet.setUploadStatus(StudentAnswerSheet.UploadStatus.EVALUATION_COMPLETED);
            answerSheetRepository.save(answerSheet);

            // Audit log
            auditService.logAction(
                    EvaluationAuditLog.ActionType.AI_EVALUATE,
                    EvaluationAuditLog.EntityType.ANSWER_SHEET,
                    sheetId,
                    null,
                    EvaluationAuditLog.UserRole.SYSTEM,
                    null,
                    "AI evaluation completed successfully"
            );

            // Update stats
            statsService.updateStats(answerSheet.getExamId(), answerSheet.getSubjectId());

            log.info("AI evaluation completed for sheet_id: {}", sheetId);
            return aiResponse;

        } catch (Exception e) {
            // Update status to FAILED
            answerSheet.setUploadStatus(StudentAnswerSheet.UploadStatus.FAILED);
            answerSheetRepository.save(answerSheet);

            // Audit log
            auditService.logAction(
                    EvaluationAuditLog.ActionType.ERROR,
                    EvaluationAuditLog.EntityType.ANSWER_SHEET,
                    sheetId,
                    null,
                    EvaluationAuditLog.UserRole.SYSTEM,
                    null,
                    "AI evaluation failed: " + e.getMessage()
            );

            log.error("AI evaluation failed for sheet_id: {}", sheetId, e);
            throw new ValidationException("AI evaluation failed: " + e.getMessage());
        }
    }

    @Transactional
    public void saveStaffReview(Integer logId, MarkOverrideDTO dto) {
        log.info("Saving staff review for log_id: {}", logId);

        AIEvaluationLog evaluationLog = evaluationLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation log not found with ID: " + logId));

        // Check if already locked
        StaffMarkOverride existing = markOverrideRepository.findByEvaluationLog_LogId(logId).orElse(null);
        if (existing != null && existing.getIsLocked()) {
            throw new ValidationException("Marks are already locked and cannot be modified");
        }

        // Validate adjustment (±10% rule)
        BigDecimal aiMarks = evaluationLog.getAiSuggestedMarks();
        BigDecimal staffMarks = dto.getStaffFinalMarks();

        BigDecimal adjustmentPercent = calculateAdjustmentPercent(aiMarks, staffMarks);

        if (adjustmentPercent.abs().compareTo(BigDecimal.valueOf(10)) > 0) {
            if (dto.getStaffRemarks() == null || dto.getStaffRemarks().trim().isEmpty()) {
                throw new ValidationException("Remarks are mandatory for adjustments beyond ±10%");
            }
        }

        // Create or update override
        StaffMarkOverride override;
        if (existing != null) {
            override = existing;
            override.setStaffFinalMarks(staffMarks);
            override.setStaffRemarks(dto.getStaffRemarks());
        } else {
            override = StaffMarkOverride.builder()
                    .evaluationLog(evaluationLog)
                    .aiSuggestedMarks(aiMarks)
                    .staffFinalMarks(staffMarks)
                    .staffRemarks(dto.getStaffRemarks())
                    .reviewedBy(dto.getReviewedBy())
                    .isLocked(false)
                    .build();
        }

        markOverrideRepository.save(override);

        // Audit log (trigger will handle, but add custom entry)
        auditService.logAction(
                EvaluationAuditLog.ActionType.STAFF_REVIEW,
                EvaluationAuditLog.EntityType.MARK_OVERRIDE,
                override.getOverrideId(),
                dto.getReviewedBy(),
                EvaluationAuditLog.UserRole.STAFF,
                null,
                "Staff review completed. Adjustment: " + adjustmentPercent + "%"
        );

        log.info("Staff review saved successfully for log_id: {}", logId);
    }

    @Transactional
    public void lockAnswerSheet(Integer sheetId, Integer staffId) {
        log.info("Locking answer sheet: {}", sheetId);

        StudentAnswerSheet answerSheet = answerSheetRepository.findById(sheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer sheet not found with ID: " + sheetId));

        // Check if all questions are reviewed
        List<AIEvaluationLog> evaluationLogs = evaluationLogRepository.findByAnswerSheet_SheetId(sheetId);

        for (AIEvaluationLog log : evaluationLogs) {
            if (!markOverrideRepository.findByEvaluationLog_LogId(log.getLogId()).isPresent()) {
                throw new ValidationException("Not all questions have been reviewed. Cannot lock.");
            }
        }

        // Lock all overrides
        int lockedCount = markOverrideRepository.lockAllBySheetId(sheetId);

        // Update answer sheet status
        answerSheet.setUploadStatus(StudentAnswerSheet.UploadStatus.LOCKED);
        answerSheetRepository.save(answerSheet);

        // Audit log
        auditService.logAction(
                EvaluationAuditLog.ActionType.MARKS_LOCK,
                EvaluationAuditLog.EntityType.ANSWER_SHEET,
                sheetId,
                staffId,
                EvaluationAuditLog.UserRole.STAFF,
                null,
                "Answer sheet locked. Total questions: " + lockedCount
        );

        // Update stats
        statsService.updateStats(answerSheet.getExamId(), answerSheet.getSubjectId());

        log.info("Answer sheet locked successfully. Sheet ID: {}, Questions locked: {}", sheetId, lockedCount);
    }

    @Transactional(readOnly = true)
    public List<QuestionEvaluationDTO> getEvaluationDetails(Integer sheetId) {
        log.info("Fetching evaluation details for sheet_id: {}", sheetId);

        List<AIEvaluationLog> logs = evaluationLogRepository.findBySheetIdWithOverrides(sheetId);

        if (logs.isEmpty()) {
            throw new ResourceNotFoundException("No evaluation found for sheet ID: " + sheetId);
        }

        return logs.stream()
                .map(this::convertToQuestionEvaluationDTO)
                .collect(Collectors.toList());
    }

    private void saveEvaluationResults(StudentAnswerSheet answerSheet, EvaluationResponseDTO aiResponse) {
        for (QuestionEvaluationDTO questionEval : aiResponse.getEvaluations()) {
            AIEvaluationLog log = AIEvaluationLog.builder()
                    .answerSheet(answerSheet)
                    .questionNumber(questionEval.getQuestionNumber())
                    .extractedText(questionEval.getExtractedText())
                    .ocrConfidence(questionEval.getOcrConfidence())
                    .keywordsFound(convertListToJson(questionEval.getKeywordsFound()))
                    .keywordsMissing(convertListToJson(questionEval.getKeywordsMissing()))
                    .aiSuggestedMarks(questionEval.getAiSuggestedMarks())
                    .aiConfidenceScore(questionEval.getAiConfidenceScore())
                    .aiExplanation(questionEval.getAiExplanation())
                    .build();

            evaluationLogRepository.save(log);
        }
    }

    private BigDecimal calculateAdjustmentPercent(BigDecimal aiMarks, BigDecimal staffMarks) {
        if (aiMarks.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return staffMarks.subtract(aiMarks)
                .divide(aiMarks, 2, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private List<AnswerKeyDTO> convertAnswerKeysToDTO(List<AnswerKey> answerKeys) {
        return answerKeys.stream()
                .map(ak -> {
                    List<KeywordDTO> keywords = ak.getKeywords().stream()
                            .map(kw -> KeywordDTO.builder()
                                    .keyword(kw.getKeyword())
                                    .keywordType(kw.getKeywordType().name())
                                    .weight(kw.getWeight())
                                    .synonyms(kw.getSynonyms())
                                    .isMandatory(kw.getIsMandatory())
                                    .build())
                            .collect(Collectors.toList());

                    return AnswerKeyDTO.builder()
                            .questionNumber(ak.getQuestionNumber())
                            .maxMarks(ak.getMaxMarks())
                            .keywords(keywords)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private QuestionEvaluationDTO convertToQuestionEvaluationDTO(AIEvaluationLog log) {
        return QuestionEvaluationDTO.builder()
                .logId(log.getLogId())                          // ✅ IMPORTANT FIX
                .questionNumber(log.getQuestionNumber())
                .extractedText(log.getExtractedText())
                .ocrConfidence(log.getOcrConfidence())
                .keywordsFound(convertJsonToList(log.getKeywordsFound()))
                .keywordsMissing(convertJsonToList(log.getKeywordsMissing()))
                .aiSuggestedMarks(log.getAiSuggestedMarks())
                .aiConfidenceScore(log.getAiConfidenceScore())
                .aiExplanation(log.getAiExplanation())
                .build();
    }

    private AnswerSheetUploadDTO convertToUploadDTO(StudentAnswerSheet sheet) {
        return AnswerSheetUploadDTO.builder()
                .sheetId(sheet.getSheetId())
                .examId(sheet.getExamId())
                .studentId(sheet.getStudentId())
                .subjectId(sheet.getSubjectId())
                .pdfFilePath(sheet.getPdfFilePath())
                .pdfOriginalName(sheet.getPdfOriginalName())
                .pdfFileSize(sheet.getPdfFileSize())
                .uploadedBy(sheet.getUploadedBy())
                .uploadStatus(sheet.getUploadStatus().name())
                .build();
    }

    private String convertListToJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            log.error("Error converting list to JSON", e);
            return "[]";
        }
    }

    private List<String> convertJsonToList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.error("Error converting JSON to list", e);
            return new ArrayList<>();
        }
    }
}