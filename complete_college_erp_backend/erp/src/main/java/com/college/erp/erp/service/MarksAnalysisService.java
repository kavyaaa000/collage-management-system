package com.college.erp.erp.service;

import com.college.erp.erp.dto.StudentMarksDetailDTO;
import com.college.erp.erp.dto.SubjectMarksDTO;
import com.college.erp.erp.entity.*;
import com.college.erp.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MarksAnalysisService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private StudentExamMarkRepository markRepo;
    @Autowired private ExamRepository examRepo;
    @Autowired private SubjectRepository subjectRepo;
    @Autowired private ExamTypeRepository examTypeRepo;
    @Autowired private StudentSemesterHistoryRepository historyRepo;

    /**
     * Get student marks for a semester (latest session by default)
     */
    public StudentMarksDetailDTO getStudentMarksBySemester(Integer studentId, Integer semesterId) {

        // Find the most recent session for this semester that has exams
        List<Exam> exams = examRepo.findBySemesterId(semesterId);

        if (exams.isEmpty()) {
            throw new RuntimeException("No exams found for semester " + semesterId);
        }

        // Get the latest session ID
        Integer latestSessionId = exams.stream()
                .map(Exam::getSessionId)
                .max(Integer::compareTo)
                .orElseThrow(() -> new RuntimeException("No sessions found"));

        // Use existing method with latest session
        return getStudentMarksDetail(studentId, semesterId, latestSessionId);
    }

    /**
     * Get complete marks details for a student in a semester
     */
    public StudentMarksDetailDTO getStudentMarksDetail(Integer studentId, Integer semesterId, Integer sessionId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Get all subjects for this semester
        List<Subject> subjects = subjectRepo.findBySemesterId(semesterId);

        if (subjects.isEmpty()) {
            throw new RuntimeException("No subjects found for semester " + semesterId);
        }

        // Get all exams for this semester and session
        List<Exam> exams = examRepo.findBySemesterIdAndSessionId(semesterId, sessionId);

        if (exams.isEmpty()) {
            // No exams for this specific session, return empty marks
            StudentMarksDetailDTO response = new StudentMarksDetailDTO();
            response.setStudent(student);
            response.setSemesterId(semesterId);
            response.setSessionId(sessionId);
            response.setSubjectMarks(new ArrayList<>());
            response.setTotalSubjects((long) subjects.size());
            response.setCompletedSubjects(0L);
            response.setPassedSubjects(0L);
            response.setAverageMarks(BigDecimal.ZERO);
            return response;
        }

        // Get all marks for this student
        List<Integer> examIds = exams.stream().map(Exam::getExamId).collect(Collectors.toList());
        List<StudentExamMark> allMarks = markRepo.findByStudentIdAndExamIdIn(studentId, examIds);

        // Map exam IDs to marks
        Map<Integer, StudentExamMark> marksMap = allMarks.stream()
                .collect(Collectors.toMap(StudentExamMark::getExamId, mark -> mark));

        // Build subject-wise marks
        List<SubjectMarksDTO> subjectMarksList = new ArrayList<>();

        for (Subject subject : subjects) {
            SubjectMarksDTO subjectMarks = new SubjectMarksDTO();
            subjectMarks.setSubjectId(subject.getSubjectId());
            subjectMarks.setSubjectCode(subject.getSubjectCode());
            subjectMarks.setSubjectName(subject.getSubjectName());
            subjectMarks.setSubjectType(subject.getSubjectType());
            subjectMarks.setCredits(subject.getCredits());

            // Find exams for this subject
            List<Exam> subjectExams = exams.stream()
                    .filter(e -> e.getSubjectId().equals(subject.getSubjectId()))
                    .collect(Collectors.toList());

            BigDecimal ia1Marks = null;
            BigDecimal ia2Marks = null;
            BigDecimal endSemMarks = null;
            boolean ia1Absent = false;
            boolean ia2Absent = false;
            boolean endSemAbsent = false;

            for (Exam exam : subjectExams) {
                StudentExamMark mark = marksMap.get(exam.getExamId());

                if (mark != null) {
                    // Exam Type: 1=IA-1, 2=IA-2, 3=END-SEM
                    switch (exam.getExamTypeId()) {
                        case 1: // IA-1
                            ia1Marks = mark.getMarksObtained();
                            ia1Absent = mark.getIsAbsent();
                            break;
                        case 2: // IA-2
                            ia2Marks = mark.getMarksObtained();
                            ia2Absent = mark.getIsAbsent();
                            break;
                        case 3: // END-SEM
                            endSemMarks = mark.getMarksObtained();
                            endSemAbsent = mark.getIsAbsent();
                            break;
                    }
                }
            }

            subjectMarks.setIa1Marks(ia1Marks);
            subjectMarks.setIa2Marks(ia2Marks);
            subjectMarks.setEndSemMarks(endSemMarks);
            subjectMarks.setIa1Absent(ia1Absent);
            subjectMarks.setIa2Absent(ia2Absent);
            subjectMarks.setEndSemAbsent(endSemAbsent);

            // Calculate total only if all marks are present
            if (ia1Marks != null && ia2Marks != null && endSemMarks != null) {
                BigDecimal total = ia1Marks.multiply(new BigDecimal("0.15"))
                        .add(ia2Marks.multiply(new BigDecimal("0.15")))
                        .add(endSemMarks.multiply(new BigDecimal("0.70")));
                subjectMarks.setTotalMarks(total);
                subjectMarks.setGrade(calculateGrade(total));
            }

            subjectMarksList.add(subjectMarks);
        }

        // Build response
        StudentMarksDetailDTO response = new StudentMarksDetailDTO();
        response.setStudent(student);
        response.setSemesterId(semesterId);
        response.setSessionId(sessionId);
        response.setSubjectMarks(subjectMarksList);

        // Calculate semester statistics
        calculateSemesterStats(response, subjectMarksList);

        return response;
    }

    private String calculateGrade(BigDecimal total) {
        double marks = total.doubleValue();
        if (marks >= 90) return "O";
        if (marks >= 80) return "A+";
        if (marks >= 70) return "A";
        if (marks >= 60) return "B+";
        if (marks >= 50) return "B";
        if (marks >= 40) return "C";
        return "F";
    }

    private void calculateSemesterStats(StudentMarksDetailDTO response, List<SubjectMarksDTO> subjectMarks) {
        long totalSubjects = subjectMarks.size();
        long completedSubjects = subjectMarks.stream()
                .filter(s -> s.getTotalMarks() != null)
                .count();

        long passedSubjects = subjectMarks.stream()
                .filter(s -> s.getTotalMarks() != null && s.getTotalMarks().doubleValue() >= 40)
                .count();

        double avgMarks = subjectMarks.stream()
                .filter(s -> s.getTotalMarks() != null)
                .mapToDouble(s -> s.getTotalMarks().doubleValue())
                .average()
                .orElse(0.0);

        response.setTotalSubjects(totalSubjects);
        response.setCompletedSubjects(completedSubjects);
        response.setPassedSubjects(passedSubjects);
        response.setAverageMarks(BigDecimal.valueOf(avgMarks));
    }
}