package com.college.erp.evaluation.controller;

import com.college.erp.evaluation.dto.*;
import com.college.erp.evaluation.entity.StudentAnswerSheet;
import com.college.erp.evaluation.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/eva/evaluation")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EvaluationController {




    private final EvaluationService evaluationService;



    @GetMapping("/enrolled-students")
    public ResponseEntity<?> getEnrolledStudents(
            @RequestParam Integer examId,
            @RequestParam Integer subjectId) {

        log.info("GET /api/evaluation/enrolled-students - Fetching enrolled students for exam: {}, subject: {}", examId, subjectId);

        try {
            // You need to inject StudentEnrollmentRepository and StudentAnswerSheetRepository
            // Add these to your controller:
            // private final StudentEnrollmentRepository enrollmentRepository;
            // private final StudentAnswerSheetRepository sheetRepository;

            // Get all enrollments - you'll need to create this query in your repository
            List<Map<String, Object>> studentList = new ArrayList<>();

            // Query to get students enrolled in this exam/subject
            // This assumes you have a student_enrollment or exam_subject_students table
            // You need to create appropriate repository method

            // Example structure (adapt to your database):
            /*
            List<Object[]> enrollments = enrollmentRepository.findStudentsByExamAndSubject(examId, subjectId);

            for (Object[] enrollment : enrollments) {
                Integer studentId = (Integer) enrollment[0];
                String studentName = (String) enrollment[1];
                String rollNumber = (String) enrollment[2];

                Map<String, Object> studentInfo = new HashMap<>();
                studentInfo.put("studentId", studentId);
                studentInfo.put("studentName", studentName);
                studentInfo.put("rollNumber", rollNumber);

                // Check if sheet exists
                Optional<StudentAnswerSheet> sheet = sheetRepository
                    .findByExamIdAndStudentIdAndSubjectId(examId, studentId, subjectId);

                if (sheet.isPresent()) {
                    studentInfo.put("sheetId", sheet.get().getSheetId());
                    studentInfo.put("uploadStatus", sheet.get().getUploadStatus().name());
                    studentInfo.put("uploadedAt", sheet.get().getUploadedAt());
                } else {
                    studentInfo.put("sheetId", null);
                    studentInfo.put("uploadStatus", null);
                    studentInfo.put("uploadedAt", null);
                }

                studentList.add(studentInfo);
            }
            */

            log.info("Found {} enrolled students", studentList.size());
            return ResponseEntity.ok(studentList);

        } catch (Exception e) {
            log.error("Error fetching enrolled students", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch enrolled students: " + e.getMessage()));
        }
    }

    /**
     * NEW ENDPOINT: Get sheet status for a specific student
     */
    @GetMapping("/sheet-status")
    public ResponseEntity<?> getStudentSheetStatus(
            @RequestParam Integer examId,
            @RequestParam Integer studentId,
            @RequestParam Integer subjectId) {

        log.info("GET /api/evaluation/sheet-status - Checking sheet for exam: {}, student: {}, subject: {}",
                examId, studentId, subjectId);

        try {
            // Find sheet using your existing service or repository
            // You may need to add this method to your service/repository:
            // Optional<StudentAnswerSheet> sheet = sheetRepository
            //     .findByExamIdAndStudentIdAndSubjectId(examId, studentId, subjectId);

            // For now, using evaluationService (you may need to add this method):
            Optional<StudentAnswerSheet> sheetOpt = Optional.empty(); // Replace with actual query

            if (sheetOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of("exists", false));
            }

            StudentAnswerSheet sheet = sheetOpt.get();

            Map<String, Object> status = new HashMap<>();
            status.put("exists", true);
            status.put("sheetId", sheet.getSheetId());
            status.put("uploadStatus", sheet.getUploadStatus().name());
            status.put("uploadedAt", sheet.getUploadedAt());
            status.put("pdfOriginalName", sheet.getPdfOriginalName());

            return ResponseEntity.ok(status);

        } catch (Exception e) {
            log.error("Error getting sheet status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get sheet status: " + e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<AnswerSheetUploadDTO> uploadAnswerSheet(
            @RequestParam("file") MultipartFile file,
            @RequestParam("examId") Integer examId,
            @RequestParam("studentId") Integer studentId,
            @RequestParam("subjectId") Integer subjectId,
            @RequestParam("uploadedBy") Integer uploadedBy,
            @RequestParam("sessionId") Integer sessionId) {

        log.info("POST /api/evaluation/upload - Uploading answer sheet");
        AnswerSheetUploadDTO result = evaluationService.uploadAnswerSheet(
                file, examId, studentId, subjectId, uploadedBy, sessionId
        );
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/start-ai/{sheetId}")
    public ResponseEntity<EvaluationResponseDTO> startAIEvaluation(
            @PathVariable Integer sheetId,
            @RequestParam Integer sessionId) {

        log.info("POST /api/evaluation/start-ai/{} - Starting AI evaluation", sheetId);
        EvaluationResponseDTO result = evaluationService.startAIEvaluation(sheetId, sessionId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/details/{sheetId}")
    public ResponseEntity<List<QuestionEvaluationDTO>> getEvaluationDetails(@PathVariable Integer sheetId) {
        log.info("GET /api/evaluation/details/{} - Fetching evaluation details", sheetId);
        List<QuestionEvaluationDTO> details = evaluationService.getEvaluationDetails(sheetId);
        return ResponseEntity.ok(details);
    }

    @PostMapping("/staff-review")
    public ResponseEntity<Void> saveStaffReview(@Valid @RequestBody MarkOverrideDTO dto) {
        log.info("POST /api/evaluation/staff-review - Saving staff review for log_id: {}", dto.getLogId());
        evaluationService.saveStaffReview(dto.getLogId(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/lock/{sheetId}")
    public ResponseEntity<Void> lockAnswerSheet(
            @PathVariable Integer sheetId,
            @RequestParam Integer staffId) {

        log.info("POST /api/evaluation/lock/{} - Locking answer sheet", sheetId);
        evaluationService.lockAnswerSheet(sheetId, staffId);
        return ResponseEntity.ok().build();
    }
}