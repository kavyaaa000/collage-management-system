package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.response.*;
import com.college.erp.attendance.entity.*;
import com.college.erp.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtAnalyticsService {

    private final AtAttendanceSessionRepository sessionRepository;
    private final AtAttendanceCacheRepository cacheRepository;
    private final AtInternalMarksRepository marksRepository;
    private final AtStudentRepository atStudentRepository;
    private final AtTimetableRepository atTimetableRepository;

    public DashboardStatsResponse getStaffDashboard(Integer staffId, LocalDate date) {
        log.info("Generating staff dashboard for staff: {}, date: {}", staffId, date);

        List<AttendanceSession> todaySessions = sessionRepository.findByStaffIdAndAttendanceDate(staffId, date);

        int totalClasses = todaySessions.size();
        int completedClasses = (int) todaySessions.stream()
                .filter(s -> "SUBMITTED".equals(s.getStatus()) || "LOCKED".equals(s.getStatus()))
                .count();
        int pendingClasses = totalClasses - completedClasses;

        BigDecimal avgAttendance = todaySessions.stream()
                .filter(s -> s.getTotalStudents() > 0)
                .map(s -> BigDecimal.valueOf(s.getPresentCount() * 100.0 / s.getTotalStudents()))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(todaySessions.size(), 1)), 2, RoundingMode.HALF_UP);

        DashboardStatsResponse.StaffStats staffStats = DashboardStatsResponse.StaffStats.builder()
                .totalClasses(totalClasses)
                .completedClasses(completedClasses)
                .pendingClasses(pendingClasses)
                .averageAttendance(avgAttendance)
                .build();

        return DashboardStatsResponse.builder()
                .staffStats(staffStats)
                .build();
    }

    public DashboardStatsResponse getStudentDashboard(Integer studentId, Integer semesterId, Integer academicSessionId) {
        log.info("Generating student dashboard for student: {}", studentId);

        List<AttendanceCalculationCache> caches = cacheRepository
                .findByStudentIdAndSemesterIdAndAcademicSessionIdAndIsValidTrue(
                        studentId, semesterId, academicSessionId);

        BigDecimal overallAttendance = caches.stream()
                .filter(c -> c.getSubjectId() != null)
                .map(AttendanceCalculationCache::getAttendancePercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(caches.size(), 1)), 2, RoundingMode.HALF_UP);

        BigDecimal averageMarks = marksRepository.findAverageMarksByStudent(studentId, academicSessionId);
        if (averageMarks == null) averageMarks = BigDecimal.ZERO;

        int totalSubjects = caches.size();
        int subjectsAtRisk = (int) caches.stream()
                .filter(c -> "AT_RISK".equals(c.getEligibilityStatus()) ||
                        "INELIGIBLE".equals(c.getEligibilityStatus()))
                .count();

        String performanceCategory = averageMarks.compareTo(BigDecimal.valueOf(75)) >= 0 ? "EXCELLENT" :
                averageMarks.compareTo(BigDecimal.valueOf(60)) >= 0 ? "GOOD" :
                        averageMarks.compareTo(BigDecimal.valueOf(50)) >= 0 ? "AVERAGE" : "AT_RISK";

        DashboardStatsResponse.StudentStats studentStats = DashboardStatsResponse.StudentStats.builder()
                .overallAttendance(overallAttendance)
                .averageMarks(averageMarks)
                .totalSubjects(totalSubjects)
                .subjectsAtRisk(subjectsAtRisk)
                .performanceCategory(performanceCategory)
                .build();

        return DashboardStatsResponse.builder()
                .studentStats(studentStats)
                .build();
    }

    public List<AtRiskStudentResponse> getAtRiskStudents(Integer semesterId, Integer academicSessionId) {
        log.info("Fetching at-risk students for semester: {}", semesterId);

        List<Student> students = atStudentRepository.findActiveStudentsBySemester(semesterId);
        List<AtRiskStudentResponse> atRiskStudents = new ArrayList<>();

        for (Student student : students) {
            List<AttendanceCalculationCache> caches = cacheRepository
                    .findByStudentIdAndSemesterIdAndAcademicSessionIdAndIsValidTrue(
                            student.getStudentId(), semesterId, academicSessionId);

            if (caches.isEmpty()) continue;

            BigDecimal avgAttendance = caches.stream()
                    .map(AttendanceCalculationCache::getAttendancePercentage)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(caches.size()), 2, RoundingMode.HALF_UP);

            BigDecimal avgMarks = marksRepository.findAverageMarksByStudent(
                    student.getStudentId(), academicSessionId);
            if (avgMarks == null) avgMarks = BigDecimal.ZERO;

            String riskLevel = calculateRiskLevel(avgAttendance, avgMarks);

            if (!"LOW".equals(riskLevel)) {
                atRiskStudents.add(AtRiskStudentResponse.builder()
                        .studentId(student.getStudentId())
                        .registerNumber(student.getRegisterNumber())
                        .studentName(student.getStudentName())
                        .avgAttendance(avgAttendance)
                        .avgMarks(avgMarks)
                        .riskLevel(riskLevel)
                        .recommendations(generateRecommendations(avgAttendance, avgMarks))
                        .build());
            }
        }

        return atRiskStudents.stream()
                .sorted(Comparator.comparing(AtRiskStudentResponse::getRiskLevel))
                .collect(Collectors.toList());
    }

    private String calculateRiskLevel(BigDecimal attendance, BigDecimal marks) {
        if (attendance.compareTo(BigDecimal.valueOf(65)) < 0 &&
                marks.compareTo(BigDecimal.valueOf(50)) < 0) {
            return "CRITICAL";
        } else if (attendance.compareTo(BigDecimal.valueOf(75)) < 0 &&
                marks.compareTo(BigDecimal.valueOf(60)) < 0) {
            return "HIGH";
        } else if (attendance.compareTo(BigDecimal.valueOf(75)) < 0 ||
                marks.compareTo(BigDecimal.valueOf(60)) < 0) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private List<String> generateRecommendations(BigDecimal attendance, BigDecimal marks) {
        List<String> recommendations = new ArrayList<>();

        if (attendance.compareTo(BigDecimal.valueOf(75)) < 0) {
            recommendations.add("Improve attendance - currently below 75%");
        }
        if (marks.compareTo(BigDecimal.valueOf(50)) < 0) {
            recommendations.add("Seek academic counseling - marks critically low");
        }
        if (marks.compareTo(BigDecimal.valueOf(60)) < 0) {
            recommendations.add("Additional tutoring recommended");
        }

        return recommendations;
    }
}