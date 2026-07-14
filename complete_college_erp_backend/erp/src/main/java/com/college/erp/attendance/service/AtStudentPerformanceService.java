package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.response.StudentDetailedPerformanceResponse;
import com.college.erp.attendance.dto.response.StudentDetailedPerformanceResponse.*;
import com.college.erp.attendance.entity.*;
import com.college.erp.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtStudentPerformanceService {

    private final AtStudentRepository atStudentRepository;
    private final AtSubjectRepository atSubjectRepository;
    private final AtAttendanceCacheRepository atAttendanceCacheRepository;
    private final AtInternalMarksRepository atInternalMarksRepository;
    private final AtSmartAlertRepository atSmartAlertRepository;
    private final AtStudentPerformanceAnalysisRepository performanceAnalysisRepository;

    public StudentDetailedPerformanceResponse getDetailedPerformance(
            Integer studentId, Integer semesterId, Integer academicSessionId) {

        log.info("Fetching detailed performance for student: {}", studentId);

        Student student = atStudentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Get attendance details
        List<AttendanceCalculationCache> attendanceCaches = atAttendanceCacheRepository
                .findByStudentIdAndSemesterIdAndAcademicSessionIdAndIsValidTrue(
                        studentId, semesterId, academicSessionId);

        List<SubjectAttendanceDetail> attendanceDetails = attendanceCaches.stream()
                .filter(cache -> cache.getSubjectId() != null)
                .map(cache -> {
                    Subject subject = atSubjectRepository.findById(cache.getSubjectId()).orElse(null);
                    return SubjectAttendanceDetail.builder()
                            .subjectCode(subject != null ? subject.getSubjectCode() : "")
                            .subjectName(subject != null ? subject.getSubjectName() : "")
                            .totalClasses(cache.getTotalClasses())
                            .attendedClasses(cache.getAttendedClasses())
                            .percentage(cache.getAttendancePercentage())
                            .eligibilityStatus(cache.getEligibilityStatus())
                            .classesNeededFor75(cache.getClassesNeededFor75())
                            .build();
                })
                .collect(Collectors.toList());

        // Get performance details
        List<StudentInternalMarks> allMarks = atInternalMarksRepository
                .findByStudentIdAndSessionId(studentId, academicSessionId);

        List<SubjectPerformanceDetail> performanceDetails = allMarks.stream()
                .collect(Collectors.groupingBy(StudentInternalMarks::getSubjectId))
                .entrySet().stream()
                .map(entry -> {
                    Integer subjectId = entry.getKey();
                    List<StudentInternalMarks> marks = entry.getValue();
                    Subject subject = atSubjectRepository.findById(subjectId).orElse(null);

                    BigDecimal internal1 = marks.stream()
                            .filter(m -> m.getTestNumber() == 1)
                            .map(StudentInternalMarks::getMarksObtained)
                            .findFirst().orElse(BigDecimal.ZERO);

                    BigDecimal internal2 = marks.stream()
                            .filter(m -> m.getTestNumber() == 2)
                            .map(StudentInternalMarks::getMarksObtained)
                            .findFirst().orElse(BigDecimal.ZERO);

                    BigDecimal internal3 = marks.stream()
                            .filter(m -> m.getTestNumber() == 3)
                            .map(StudentInternalMarks::getMarksObtained)
                            .findFirst().orElse(BigDecimal.ZERO);

                    BigDecimal average = internal1.add(internal2).add(internal3)
                            .divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);

                    String trend = calculateTrend(internal1, internal2, internal3);

                    return SubjectPerformanceDetail.builder()
                            .subjectCode(subject != null ? subject.getSubjectCode() : "")
                            .subjectName(subject != null ? subject.getSubjectName() : "")
                            .internal1(internal1)
                            .internal2(internal2)
                            .internal3(internal3)
                            .average(average)
                            .trend(trend)
                            .build();
                })
                .collect(Collectors.toList());

        // Calculate overall metrics
        BigDecimal overallAttendance = attendanceDetails.stream()
                .map(SubjectAttendanceDetail::getPercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(attendanceDetails.size(), 1)), 2, RoundingMode.HALF_UP);

        BigDecimal overallMarks = performanceDetails.stream()
                .map(SubjectPerformanceDetail::getAverage)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(performanceDetails.size(), 1)), 2, RoundingMode.HALF_UP);

        // Get latest analysis
        StudentPerformanceAnalysis latestAnalysis = performanceAnalysisRepository
                .findTopByStudentIdOrderByAnalysisDateDesc(studentId)
                .orElse(null);

        // Get active alerts
        List<SmartAlert> alerts = atSmartAlertRepository.findByStudentIdAndIsNotifiedFalseOrderByCreatedAtDesc(studentId);
        List<AlertInfo> alertInfos = alerts.stream()
                .map(alert -> AlertInfo.builder()
                        .alertType(alert.getAlertType().name())
                        .severity(alert.getSeverity().name())
                        .message(alert.getMessage())
                        .createdAt(alert.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Build recommendations
        List<String> recommendations = generateRecommendations(overallAttendance, overallMarks, attendanceDetails, performanceDetails);

        return StudentDetailedPerformanceResponse.builder()
                .studentId(studentId)
                .registerNumber(student.getRegisterNumber())
                .studentName(student.getStudentName())
                .email(student.getEmail())
                .overallAttendance(overallAttendance)
                .attendanceTrend(latestAnalysis != null ? latestAnalysis.getAttendanceTrend().name() : "STABLE")
                .subjectWiseAttendance(attendanceDetails)
                .overallAverageMarks(overallMarks)
                .performanceTrend(latestAnalysis != null ? latestAnalysis.getPerformanceTrend().name() : "STABLE")
                .subjectWisePerformance(performanceDetails)
                .riskLevel(calculateRiskLevel(overallAttendance, overallMarks))
                .atRiskSubjects(calculateAtRiskSubjects(attendanceDetails, performanceDetails))
                .recommendations(recommendations)
                .actionRequired(overallAttendance.compareTo(BigDecimal.valueOf(75)) < 0 || overallMarks.compareTo(BigDecimal.valueOf(50)) < 0)
                .predictedFinalAttendance(predictFinalAttendance(overallAttendance))
                .predictedFinalMarks(predictFinalMarks(overallMarks))
                .activeAlerts(alertInfos)
                .build();
    }

    public List<StudentDetailedPerformanceResponse> getClassPerformance(Integer semesterId, Integer sectionId, Integer academicSessionId) {
        List<Student> students = atStudentRepository.findByCurrentSemesterIdAndSectionId(semesterId, sectionId);

        return students.stream()
                .map(student -> getDetailedPerformance(student.getStudentId(), semesterId, academicSessionId))
                .sorted((a, b) -> b.getOverallAverageMarks().compareTo(a.getOverallAverageMarks()))
                .collect(Collectors.toList());
    }

    private String calculateTrend(BigDecimal val1, BigDecimal val2, BigDecimal val3) {
        if (val3.compareTo(val2) > 0 && val2.compareTo(val1) > 0) {
            return "IMPROVING";
        } else if (val3.compareTo(val2) < 0 && val2.compareTo(val1) < 0) {
            return "DECLINING";
        }
        return "STABLE";
    }

    private String calculateRiskLevel(BigDecimal attendance, BigDecimal marks) {
        if (attendance.compareTo(BigDecimal.valueOf(65)) < 0 && marks.compareTo(BigDecimal.valueOf(50)) < 0) {
            return "CRITICAL";
        } else if (attendance.compareTo(BigDecimal.valueOf(75)) < 0 && marks.compareTo(BigDecimal.valueOf(60)) < 0) {
            return "HIGH";
        } else if (attendance.compareTo(BigDecimal.valueOf(75)) < 0 || marks.compareTo(BigDecimal.valueOf(60)) < 0) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private Integer calculateAtRiskSubjects(List<SubjectAttendanceDetail> attendance, List<SubjectPerformanceDetail> performance) {
        long attendanceRisk = attendance.stream()
                .filter(a -> a.getPercentage().compareTo(BigDecimal.valueOf(75)) < 0)
                .count();

        long performanceRisk = performance.stream()
                .filter(p -> p.getAverage().compareTo(BigDecimal.valueOf(50)) < 0)
                .count();

        return (int) Math.max(attendanceRisk, performanceRisk);
    }

    private List<String> generateRecommendations(BigDecimal attendance, BigDecimal marks,
                                                 List<SubjectAttendanceDetail> attendanceDetails,
                                                 List<SubjectPerformanceDetail> performanceDetails) {
        List<String> recommendations = new ArrayList<>();

        if (attendance.compareTo(BigDecimal.valueOf(75)) < 0) {
            recommendations.add("⚠️ Improve overall attendance - Currently below 75% requirement");
        }

        if (marks.compareTo(BigDecimal.valueOf(50)) < 0) {
            recommendations.add("🎓 Schedule counseling session - Marks critically low");
        }

        attendanceDetails.stream()
                .filter(a -> a.getPercentage().compareTo(BigDecimal.valueOf(65)) < 0)
                .forEach(a -> recommendations.add("📚 Critical: Improve attendance in " + a.getSubjectName()));

        performanceDetails.stream()
                .filter(p -> p.getAverage().compareTo(BigDecimal.valueOf(50)) < 0)
                .forEach(p -> recommendations.add("📖 Seek help in " + p.getSubjectName() + " - Below passing marks"));

        if (recommendations.isEmpty()) {
            recommendations.add("✅ Keep up the good work! You're on track.");
        }

        return recommendations;
    }

    private BigDecimal predictFinalAttendance(BigDecimal current) {
        // Simple prediction - can be enhanced with ML
        return current.multiply(BigDecimal.valueOf(0.95)).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal predictFinalMarks(BigDecimal current) {
        // Simple prediction - can be enhanced with ML
        return current.multiply(BigDecimal.valueOf(1.05)).setScale(2, RoundingMode.HALF_UP);
    }
}