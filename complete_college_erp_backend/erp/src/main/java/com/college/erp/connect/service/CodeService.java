// src/main/java/com/collegeconnect/service/CodeService.java - COMPLETE COIN FIX
package com.college.erp.connect.service;

import com.college.erp.connect.dto.*;
import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeService {

    private final CodeProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeSubmissionRepository submissionRepository;
    private final ContestRepository contestRepository;
    private final CoUserRepository coUserRepository;
    private final Judge0Service judge0Service;
    private final CoinService coinService;

    @Transactional
    public CodeSubmissionResponse submitCode(Long contestId, CodeSubmissionRequest request, String userEmail) {
        log.info("=== SUBMIT CODE CALLED ===");
        log.info("Request: contestId={}, problemId={}, language={}",
                contestId, request.getProblemId(), request.getLanguage());
        log.info("Source code length: {}", request.getSourceCode() != null ? request.getSourceCode().length() : "NULL");

        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        CodeProblem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Validate
        if (request.getSourceCode() == null || request.getSourceCode().trim().isEmpty()) {
            throw new RuntimeException("Source code cannot be empty");
        }

        CodeSubmission submission = CodeSubmission.builder()
                .contest(contest)
                .user(user)
                .problem(problem)
                .sourceCode(request.getSourceCode())
                .language(request.getLanguage())
                .languageId(judge0Service.getLanguageId(request.getLanguage()))
                .status(SubmissionStatus.PENDING)
                .build();

        submission = submissionRepository.save(submission);

        log.info("✅ Submission saved: id={}", submission.getId());
        log.info("✅ Source code in entity: {} chars", submission.getSourceCode().length());

        // Pass ID only for async processing
        Long submissionId = submission.getId();
        processSubmissionById(submissionId);

        return mapToSubmissionResponse(submission);
    }

    @Async
    @Transactional
    public void processSubmissionById(Long submissionId) {
        log.info("🚀🚀🚀 ASYNC PROCESSING STARTED for submission {}", submissionId);

        try {
            // Fetch fresh from database
            CodeSubmission submission = submissionRepository.findById(submissionId)
                    .orElseThrow(() -> new RuntimeException("Submission not found: " + submissionId));

            log.info("📦 Loaded from DB:");
            log.info("  ID: {}", submission.getId());
            log.info("  Source code: {} chars", submission.getSourceCode() != null ? submission.getSourceCode().length() : "NULL");
            log.info("  Language: {}", submission.getLanguage());

            if (submission.getSourceCode() == null || submission.getSourceCode().trim().isEmpty()) {
                log.error("❌❌❌ SOURCE CODE IS NULL IN DATABASE!");
                throw new RuntimeException("Source code is null in database");
            }

            submission.setStatus(SubmissionStatus.PROCESSING);
            submissionRepository.save(submission);

            List<TestCase> testCases = testCaseRepository.findByProblemIdOrderByOrderIndex(
                    submission.getProblem().getId()
            );

            if (testCases.isEmpty()) {
                throw new RuntimeException("No test cases found");
            }

            int passed = 0;
            int total = testCases.size();
            long totalTime = 0;
            long maxMemory = 0;
            String lastStderr = null;
            StringBuilder debugInfo = new StringBuilder();

            log.info("🔍 Running {} test cases", total);

            for (int i = 0; i < testCases.size(); i++) {
                TestCase tc = testCases.get(i);
                log.info("--- Test Case {}/{} ---", i + 1, total);

                try {
                    String testInput = tc.getInput() != null ? tc.getInput() : "";
                    String expectedOutput = tc.getExpectedOutput() != null ? tc.getExpectedOutput() : "";

                    String token = judge0Service.submitCode(
                            submission.getSourceCode(),
                            submission.getLanguage(),
                            testInput
                    );

                    log.info("✅ Got token: {}", token);

                    Map<String, Object> result = judge0Service.getSubmissionResult(token);

                    String stdout = "";
                    if (result.get("stdout") != null) {
                        stdout = new String(
                                Base64.getDecoder().decode(result.get("stdout").toString()),
                                StandardCharsets.UTF_8
                        );
                    }

                    String stderr = "";
                    if (result.get("stderr") != null) {
                        stderr = new String(
                                Base64.getDecoder().decode(result.get("stderr").toString()),
                                StandardCharsets.UTF_8
                        );
                    }

                    lastStderr = stderr;

                    Map status = (Map) result.get("status");
                    String desc = status.get("description").toString();

                    String actualOutput = stdout.replaceAll("\\s+$", "");
                    String normalizedExpected = expectedOutput.replaceAll("\\s+$", "");

                    log.info("Status: {}", desc);
                    log.info("Expected: [{}]", normalizedExpected);
                    log.info("Actual:   [{}]", actualOutput);

                    debugInfo.append(String.format("\n--- Test Case %d ---\n", i + 1));
                    debugInfo.append(String.format("Status: %s\n", desc));
                    debugInfo.append(String.format("Expected: '%s'\n", normalizedExpected));
                    debugInfo.append(String.format("Actual:   '%s'\n", actualOutput));

                    boolean testPassed = desc.equals("Accepted") && actualOutput.equals(normalizedExpected);

                    if (testPassed) {
                        passed++;
                        log.info("✅ PASSED");
                        debugInfo.append("Result: PASSED ✅\n");
                    } else {
                        log.warn("❌ FAILED");
                        debugInfo.append("Result: FAILED ❌\n");
                    }

                    if (result.get("time") != null) {
                        totalTime += (long)(Double.parseDouble(result.get("time").toString()) * 1000);
                    }

                    if (result.get("memory") != null) {
                        maxMemory = Math.max(maxMemory, Long.parseLong(result.get("memory").toString()));
                    }

                } catch (Exception tcError) {
                    log.error("❌ Test case {} error: {}", i + 1, tcError.getMessage(), tcError);
                    debugInfo.append(String.format("\n--- Test Case %d ERROR ---\n", i + 1));
                    debugInfo.append(tcError.getMessage()).append("\n");
                }
            }

            submission.setPassedTestCases(passed);
            submission.setTotalTestCases(total);
            submission.setExecutionTime((int) totalTime);
            submission.setMemoryUsed((int) maxMemory);

            // Calculate points earned
            int earnedThisTime = (int) Math.round(((double) passed / total) * submission.getProblem().getPoints());
            submission.setPointsEarned(earnedThisTime);

            submission.setStatus(passed == total ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER);

            if (lastStderr != null && !lastStderr.isEmpty()) {
                submission.setStderr(lastStderr);
            } else if (passed < total) {
                submission.setStderr(debugInfo.toString());
            }

            submissionRepository.save(submission);
            log.info("✅ Submission {} completed: {}/{} passed, {} points",
                    submission.getId(), passed, total, earnedThisTime);

            // Award coins ONLY if this submission earned more than previous best
            if (earnedThisTime > 0) {
                try {
                    // Get user's previous best score for this problem
                    Integer previousBest = submissionRepository.getMaxPointsByProblemAndUser(
                            submission.getProblem().getId(),
                            submission.getUser().getId()
                    );

                    // If no previous submission, previousBest will be null
                    int previousBestPoints = (previousBest != null) ? previousBest : 0;

                    // Only award coins for improvement
                    int coinsToAward = earnedThisTime - previousBestPoints;

                    if (coinsToAward > 0) {
                        log.info("🪙 Awarding {} coins (earned {} - previous best {}) to user {}",
                                coinsToAward, earnedThisTime, previousBestPoints, submission.getUser().getEmail());

                        coinService.addCoins(
                                submission.getUser(),
                                coinsToAward,
                                TransactionType.CODE_REWARD,
                                String.format("Scored %d points in %s", earnedThisTime, submission.getProblem().getTitle()),
                                submission.getContest(),
                                null,
                                submission
                        );
                        log.info("✅ Coins awarded successfully!");
                    } else {
                        log.info("ℹ️ No new coins awarded - current score ({}) not better than previous ({})",
                                earnedThisTime, previousBestPoints);
                    }
                } catch (Exception e) {
                    log.error("❌ Failed to award coins: {}", e.getMessage(), e);
                    // Don't throw - submission is still valid
                }
            } else {
                log.info("ℹ️ No coins awarded (0 points earned)");
            }

        } catch (Exception e) {
            log.error("❌❌❌ ASYNC PROCESSING FAILED: {}", e.getMessage(), e);

            try {
                CodeSubmission submission = submissionRepository.findById(submissionId).orElse(null);
                if (submission != null) {
                    submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
                    submission.setStderr("Execution failed: " + e.getMessage());
                    submissionRepository.save(submission);
                }
            } catch (Exception saveError) {
                log.error("Failed to save error: {}", saveError.getMessage());
            }
        }
    }

    public List<CodeSubmissionResponse> getUserSubmissions(Long contestId, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CodeSubmission> submissions = submissionRepository
                .findByContestIdAndUserIdOrderBySubmittedAtDesc(contestId, user.getId());

        return submissions.stream()
                .map(this::mapToSubmissionResponse)
                .collect(Collectors.toList());
    }

    private CodeProblemResponse mapToProblemResponse(CodeProblem problem, User user) {
        Integer bestScore = submissionRepository.getMaxPointsByProblemAndUser(
                problem.getId(), user.getId()
        );

        return CodeProblemResponse.builder()
                .id(problem.getId())
                .contestId(problem.getContest().getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .inputFormat(problem.getInputFormat())
                .outputFormat(problem.getOutputFormat())
                .constraints(problem.getConstraints())
                .sampleInput(problem.getSampleInput())
                .sampleOutput(problem.getSampleOutput())
                .points(problem.getPoints())
                .timeLimit(problem.getTimeLimit())
                .memoryLimit(problem.getMemoryLimit())
                .orderIndex(problem.getOrderIndex())
                .totalTestCases(problem.getTestCases() != null ? problem.getTestCases().size() : 0)
                .userBestScore(bestScore != null ? bestScore : 0)
                .isSolved(bestScore != null && bestScore.equals(problem.getPoints()))
                .build();
    }

    private CodeSubmissionResponse mapToSubmissionResponse(CodeSubmission submission) {
        return CodeSubmissionResponse.builder()
                .id(submission.getId())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .status(submission.getStatus())
                .passedTestCases(submission.getPassedTestCases())
                .totalTestCases(submission.getTotalTestCases())
                .executionTime(submission.getExecutionTime())
                .memoryUsed(submission.getMemoryUsed())
                .compilerOutput(submission.getCompilerOutput())
                .stderr(submission.getStderr())
                .pointsEarned(submission.getPointsEarned())
                .submittedAt(submission.getSubmittedAt())
                .language(submission.getLanguage())
                .build();
    }

    @Transactional
    public CodeProblemResponse addProblem(Long contestId, CodeProblemRequest request, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        if (!contest.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        CodeProblem problem = CodeProblem.builder()
                .contest(contest)
                .title(request.getTitle())
                .description(request.getDescription())
                .inputFormat(request.getInputFormat())
                .outputFormat(request.getOutputFormat())
                .constraints(request.getConstraints())
                .sampleInput(request.getSampleInput())
                .sampleOutput(request.getSampleOutput())
                .points(request.getPoints())
                .timeLimit(request.getTimeLimit())
                .memoryLimit(request.getMemoryLimit())
                .orderIndex(request.getOrderIndex())
                .build();

        problem = problemRepository.save(problem);

        List<TestCase> testCases = new ArrayList<>();
        int index = 0;
        for (CodeProblemRequest.TestCaseRequest tcRequest : request.getTestCases()) {
            TestCase testCase = TestCase.builder()
                    .problem(problem)
                    .input(tcRequest.getInput())
                    .expectedOutput(tcRequest.getExpectedOutput())
                    .isSample(tcRequest.getIsSample())
                    .orderIndex(index++)
                    .build();
            testCases.add(testCaseRepository.save(testCase));
        }

        problem.setTestCases(testCases);
        contest.setCodeCount(problemRepository.countByContestId(contestId).intValue());
        contestRepository.save(contest);

        return mapToProblemResponse(problem, user);
    }

    public List<CodeProblemResponse> getProblemsByContest(Long contestId, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CodeProblem> problems = problemRepository.findByContestIdOrderByOrderIndex(contestId);

        return problems.stream()
                .map(p -> mapToProblemResponse(p, user))
                .collect(Collectors.toList());
    }

    public CodeProblemResponse getProblemById(Long problemId, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CodeProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        return mapToProblemResponse(problem, user);
    }
}