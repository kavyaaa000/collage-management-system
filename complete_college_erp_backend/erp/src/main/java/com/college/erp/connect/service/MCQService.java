// src/main/java/com/collegeconnect/service/MCQService.java - FIXED VERSION
package com.college.erp.connect.service;

import com.college.erp.connect.dto.MCQQuestionRequest;
import com.college.erp.connect.dto.MCQQuestionResponse;
import com.college.erp.connect.dto.MCQSubmissionRequest;
import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MCQService {

    private final MCQQuestionRepository questionRepository;
    private final MCQOptionRepository optionRepository;
    private final MCQSubmissionRepository submissionRepository;
    private final ContestRepository contestRepository;
    private final CoUserRepository coUserRepository;
    private final CoinService coinService;

    @Transactional
    public MCQQuestionResponse addQuestion(Long contestId, MCQQuestionRequest request, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        if (!contest.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        MCQQuestion question = MCQQuestion.builder()
                .contest(contest)
                .questionText(request.getQuestionText())
                .correctOptionIndex(request.getCorrectOptionIndex())
                .points(request.getPoints())
                .orderIndex(request.getOrderIndex())
                .build();

        question = questionRepository.save(question);

        List<MCQOption> options = new ArrayList<>();

        for (int i = 0; i < request.getOptions().size(); i++) {
            MCQOption option = MCQOption.builder()
                    .question(question)
                    .optionText(request.getOptions().get(i))
                    .optionIndex(i)
                    .build();
            options.add(optionRepository.save(option));
        }

        question.setOptions(options);

        // Update contest MCQ count
        contest.setMcqCount(questionRepository.countByContestId(contestId).intValue());
        contestRepository.save(contest);

        return mapToResponse(question, user, null);
    }

    public List<MCQQuestionResponse> getQuestionsByContest(Long contestId, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        List<MCQQuestion> questions = questionRepository.findByContestIdOrderByOrderIndex(contestId);
        List<MCQSubmission> userSubmissions = submissionRepository.findByContestIdAndUserId(contestId, user.getId());

        boolean isCreator = contest.getCreatedBy().getId().equals(user.getId());

        return questions.stream()
                .map(q -> {
                    MCQSubmission submission = userSubmissions.stream()
                            .filter(s -> s.getQuestion().getId().equals(q.getId()))
                            .findFirst()
                            .orElse(null);
                    return mapToResponse(q, user, submission);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public MCQQuestionResponse submitAnswer(Long contestId, MCQSubmissionRequest request, String userEmail) {
        log.info("=== MCQ SUBMISSION STARTED ===");
        log.info("Contest: {}, Question: {}, User: {}", contestId, request.getQuestionId(), userEmail);

        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        if (contest.getStatus() != ContestStatus.ACTIVE) {
            throw new RuntimeException("Contest is not active");
        }

        MCQQuestion question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Check if already submitted
        submissionRepository.findByContestIdAndUserIdAndQuestionId(contestId, user.getId(), question.getId())
                .ifPresent(s -> {
                    throw new RuntimeException("Already submitted this question");
                });

        boolean isCorrect = question.getCorrectOptionIndex().equals(request.getSelectedOptionIndex());
        int pointsEarned = isCorrect ? question.getPoints() : 0;

        log.info("Answer check: Selected={}, Correct={}, Is Correct={}, Points={}",
                request.getSelectedOptionIndex(), question.getCorrectOptionIndex(), isCorrect, pointsEarned);

        MCQSubmission submission = MCQSubmission.builder()
                .contest(contest)
                .user(user)
                .question(question)
                .selectedOptionIndex(request.getSelectedOptionIndex())
                .isCorrect(isCorrect)
                .pointsEarned(pointsEarned)
                .build();

        submission = submissionRepository.save(submission);
        log.info("✅ MCQ submission saved: ID={}", submission.getId());

        // Award coins immediately for correct answers
        if (isCorrect && pointsEarned > 0) {
            try {
                log.info("🪙 Awarding {} coins to user {}", pointsEarned, user.getEmail());
                coinService.addCoins(
                        user,
                        pointsEarned,
                        TransactionType.MCQ_REWARD,
                        "Correct answer for MCQ in " + contest.getTitle(),
                        contest,
                        submission,
                        null
                );
                log.info("✅ Coins awarded successfully!");
            } catch (Exception e) {
                log.error("❌ Failed to award coins: {}", e.getMessage(), e);
                // Don't throw exception - submission is still valid
            }
        } else {
            log.info("ℹ️ No coins awarded (incorrect answer or 0 points)");
        }

        return mapToResponse(question, user, submission);
    }

    private MCQQuestionResponse mapToResponse(MCQQuestion question, User currentUser, MCQSubmission submission) {
        boolean isCreator = question.getContest().getCreatedBy().getId().equals(currentUser.getId());

        List<String> options = question.getOptions().stream()
                .sorted((a, b) -> a.getOptionIndex().compareTo(b.getOptionIndex()))
                .map(MCQOption::getOptionText)
                .collect(Collectors.toList());

        return MCQQuestionResponse.builder()
                .id(question.getId())
                .contestId(question.getContest().getId())
                .questionText(question.getQuestionText())
                .options(options)
                .points(question.getPoints())
                .orderIndex(question.getOrderIndex())
                .correctOptionIndex(isCreator ? question.getCorrectOptionIndex() : null)
                .userSelectedIndex(submission != null ? submission.getSelectedOptionIndex() : null)
                .isCorrect(submission != null ? submission.getIsCorrect() : null)
                .build();
    }
}