package com.college.erp.evaluation.service;

import com.college.erp.evaluation.dto.StatsDTO;
import com.college.erp.evaluation.entity.AIEvaluationStats;
import com.college.erp.evaluation.entity.StudentAnswerSheet;
import com.college.erp.evaluation.repository.AIEvaluationLogRepository;
import com.college.erp.evaluation.repository.AIEvaluationStatsRepository;
import com.college.erp.evaluation.repository.StaffMarkOverrideRepository;
import com.college.erp.evaluation.repository.StudentAnswerSheetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final AIEvaluationStatsRepository statsRepository;
    private final StudentAnswerSheetRepository answerSheetRepository;
    private final AIEvaluationLogRepository evaluationLogRepository;
    private final StaffMarkOverrideRepository markOverrideRepository;

    @Transactional
    public void updateStats(Integer examId, Integer subjectId) {
        log.info("Updating stats for exam: {}, subject: {}", examId, subjectId);

        Long totalUploaded = answerSheetRepository.countByExamIdAndSubjectId(examId, subjectId);
        Long totalEvaluated = answerSheetRepository.countByExamIdAndSubjectIdAndStatus(
                examId, subjectId, StudentAnswerSheet.UploadStatus.EVALUATION_COMPLETED
        ) + answerSheetRepository.countByExamIdAndSubjectIdAndStatus(
                examId, subjectId, StudentAnswerSheet.UploadStatus.LOCKED
        );
        Long totalLocked = answerSheetRepository.countByExamIdAndSubjectIdAndStatus(
                examId, subjectId, StudentAnswerSheet.UploadStatus.LOCKED
        );

        BigDecimal avgAiConfidence = evaluationLogRepository.getAverageConfidenceByExamAndSubject(examId, subjectId);
        BigDecimal avgAdjustment = markOverrideRepository.getAverageAdjustmentPercentByExamAndSubject(examId, subjectId);

        // Calculate high/low confidence counts (would need additional queries)
        Integer highConfidence = 0;  // TODO: Implement query
        Integer lowConfidence = 0;   // TODO: Implement query

        AIEvaluationStats stats = statsRepository.findByExamIdAndSubjectId(examId, subjectId)
                .orElse(AIEvaluationStats.builder()
                        .examId(examId)
                        .subjectId(subjectId)
                        .build());

        stats.setTotalSheetsUploaded(totalUploaded.intValue());
        stats.setTotalSheetsEvaluated(totalEvaluated.intValue());
        stats.setTotalSheetsLocked(totalLocked.intValue());
        stats.setAvgAiConfidence(avgAiConfidence);
        stats.setAvgStaffAdjustmentPercent(avgAdjustment);
        stats.setHighConfidenceCount(highConfidence);
        stats.setLowConfidenceCount(lowConfidence);

        statsRepository.save(stats);
        log.info("Stats updated successfully");
    }

    @Transactional(readOnly = true)
    public StatsDTO getStats(Integer examId, Integer subjectId) {
        AIEvaluationStats stats = statsRepository.findByExamIdAndSubjectId(examId, subjectId)
                .orElse(new AIEvaluationStats());

        BigDecimal completionPercentage = BigDecimal.ZERO;
        if (stats.getTotalSheetsUploaded() != null && stats.getTotalSheetsUploaded() > 0) {
            completionPercentage = BigDecimal.valueOf(stats.getTotalSheetsLocked())
                    .divide(BigDecimal.valueOf(stats.getTotalSheetsUploaded()), 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        return StatsDTO.builder()
                .examId(examId)
                .subjectId(subjectId)
                .totalSheetsUploaded(stats.getTotalSheetsUploaded())
                .totalSheetsEvaluated(stats.getTotalSheetsEvaluated())
                .totalSheetsLocked(stats.getTotalSheetsLocked())
                .avgAiConfidence(stats.getAvgAiConfidence())
                .avgStaffAdjustmentPercent(stats.getAvgStaffAdjustmentPercent())
                .highConfidenceCount(stats.getHighConfidenceCount())
                .lowConfidenceCount(stats.getLowConfidenceCount())
                .completionPercentage(completionPercentage)
                .build();
    }
}