package com.college.erp.erp.service;

import com.college.erp.erp.dto.SemesterPerformanceDTO;
import com.college.erp.erp.dto.StudentJourneyDTO;
import com.college.erp.erp.entity.*;
import com.college.erp.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for advanced student analytics and journey tracking
 */
@Service
public class StudentAnalyticsService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private StudentSemesterHistoryRepository historyRepo;
    @Autowired private StudentExamMarkRepository markRepo;
    @Autowired private StudentSemesterAttendanceRepository attendanceRepo;
    @Autowired private SemesterRepository semesterRepo;
    @Autowired private SubjectRepository subjectRepo;

    /**
     * Get complete academic journey of a student
     */
    public StudentJourneyDTO getStudentJourney(Integer studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<StudentSemesterHistory> history = historyRepo.findByStudentIdOrderBySemesterId(studentId);

        List<SemesterPerformanceDTO> performances = new ArrayList<>();

        for (StudentSemesterHistory semHistory : history) {
            SemesterPerformanceDTO perf = new SemesterPerformanceDTO();
            perf.setSemesterNo(semHistory.getSemesterId());
            perf.setSessionId(semHistory.getSessionId());
            perf.setResultStatus(semHistory.getResultStatus());
            perf.setPromotedOn(semHistory.getPromotedOn());

            // Get attendance for this semester
            StudentSemesterAttendance attendance = attendanceRepo
                    .findByStudentIdAndSemesterIdAndSessionId(
                            studentId,
                            semHistory.getSemesterId(),
                            semHistory.getSessionId()
                    );

            if (attendance != null) {
                perf.setAttendancePercentage(attendance.getAttendancePercentage());
                perf.setAttendanceStatus(attendance.getAttendanceStatus());
            }

            performances.add(perf);
        }

        StudentJourneyDTO journey = new StudentJourneyDTO();
        journey.setStudent(student);
        journey.setSemesterPerformances(performances);

        return journey;
    }

    /**
     * Get subject-wise marks for a student in a semester
     */
    public Map<Integer, List<StudentExamMark>> getSubjectMarks(Integer studentId, Integer semesterId) {
        List<StudentExamMark> marks = markRepo.findByStudentId(studentId);

        // Group by subject (via exam)
        return marks.stream()
                .collect(Collectors.groupingBy(mark -> mark.getExamId()));
    }
}