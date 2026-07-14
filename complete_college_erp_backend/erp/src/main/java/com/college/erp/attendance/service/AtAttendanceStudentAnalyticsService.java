package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.response.SemesterAnalyticsResponse;
import com.college.erp.attendance.dto.response.StudentComprehensiveAnalytics;
import com.college.erp.attendance.entity.*;
import com.college.erp.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtAttendanceStudentAnalyticsService {

    private final AtStudentRepository atStudentRepository;
    private final AtSemesterPerformanceSummaryRepository semesterSummaryRepository;
    private final AtSubjectComparisonAnalyticsRepository subjectComparisonRepository;
    private final AtSubjectRepository atSubjectRepository;
    private final AtAttendanceCacheRepository atAttendanceCacheRepository;
    private final AtInternalMarksRepository atInternalMarksRepository;
    private final AtTopPerformerRepository atTopPerformerRepository;
    private final JdbcTemplate jdbcTemplate;

    public StudentComprehensiveAnalytics getComprehensiveAnalytics(Integer studentId) {
        log.info("Generating comprehensive analytics for student: {}", studentId);

        Student student = atStudentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Get all semester summaries
        List<SemesterPerformanceSummary> semesterSummaries =
                semesterSummaryRepository.findByStudentIdOrderBySemesterIdAsc(studentId);

        // Calculate overall metrics
        BigDecimal overallAttendance = semesterSummaries.stream()
                .map(SemesterPerformanceSummary::getOverallAttendancePercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(semesterSummaries.size(), 1)), 2, RoundingMode.HALF_UP);

        BigDecimal overallMarks = semesterSummaries.stream()
                .map(SemesterPerformanceSummary::getAverageMarks)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(semesterSummaries.size(), 1)), 2, RoundingMode.HALF_UP);

        // Semester-wise analytics
        List<StudentComprehensiveAnalytics.SemesterAnalytics> semesterAnalytics =
                buildSemesterAnalytics(studentId, semesterSummaries);

        // Subject comparisons
        List<StudentComprehensiveAnalytics.SubjectComparison> subjectComparisons =
                buildSubjectComparisons(studentId);

        // Trend analysis
        StudentComprehensiveAnalytics.TrendAnalysis trendAnalysis =
                buildTrendAnalysis(semesterSummaries);

        // Achievements
        List<StudentComprehensiveAnalytics.Achievement> achievements =
                buildAchievements(studentId);

        // Recommendations
        List<String> recommendations = generateRecommendations(studentId, overallAttendance, overallMarks);

        return StudentComprehensiveAnalytics.builder()
                .studentId(studentId)
                .registerNumber(student.getRegisterNumber())
                .studentName(student.getStudentName())
                .email(student.getEmail())
                .classId(student.getClassId())
                .overallAttendance(overallAttendance)
                .overallAverageMarks(overallMarks)
                .currentSgpa(student.getCurrentCgpa())
                .cgpa(student.getCurrentCgpa())
                .semesterAnalytics(semesterAnalytics)
                .subjectComparisons(subjectComparisons)
                .trendAnalysis(trendAnalysis)
                .achievements(achievements)
                .recommendations(recommendations)
                .build();
    }

    public List<SemesterAnalyticsResponse> getSemesterWiseAnalytics(Integer studentId) {
        List<SemesterPerformanceSummary> summaries =
                semesterSummaryRepository.findByStudentIdOrderBySemesterIdAsc(studentId);

        return summaries.stream()
                .map(this::mapToSemesterAnalyticsResponse)
                .collect(Collectors.toList());
    }

    private List<StudentComprehensiveAnalytics.SemesterAnalytics> buildSemesterAnalytics(
            Integer studentId, List<SemesterPerformanceSummary> summaries) {

        return summaries.stream()
                .map(summary -> {
                    // Get subject-wise performance for this semester
                    List<StudentComprehensiveAnalytics.SubjectPerformance> subjects =
                            getSubjectPerformanceForSemester(studentId, summary.getSemesterId(), summary.getAcademicSessionId());

                    return StudentComprehensiveAnalytics.SemesterAnalytics.builder()
                            .semesterId(summary.getSemesterId())
                            .semesterNo(summary.getSemesterId()) // Simplified
                            .attendancePercentage(summary.getOverallAttendancePercentage())
                            .averageMarks(summary.getAverageMarks())
                            .sgpa(summary.getSgpa())
                            .classRank(summary.getClassRank())
                            .totalStudents(summary.getSectionRank()) // Using as placeholder
                            .subjects(subjects)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<StudentComprehensiveAnalytics.SubjectPerformance> getSubjectPerformanceForSemester(
            Integer studentId, Integer semesterId, Integer academicSessionId) {

        List<Subject> subjects = atSubjectRepository.findBySemesterId(semesterId);
        List<StudentComprehensiveAnalytics.SubjectPerformance> performances = new ArrayList<>();

        for (Subject subject : subjects) {
            // Get attendance
            AttendanceCalculationCache attendance = atAttendanceCacheRepository
                    .findByStudentIdAndSubjectIdAndSemesterIdAndAcademicSessionId(
                            studentId, subject.getSubjectId(), semesterId, academicSessionId)
                    .orElse(null);

            // Get internal marks
            List<StudentInternalMarks> marks = atInternalMarksRepository
                    .findByStudentIdAndSubjectIdAndSessionId(studentId, subject.getSubjectId(), academicSessionId);

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

            performances.add(StudentComprehensiveAnalytics.SubjectPerformance.builder()
                    .subjectCode(subject.getSubjectCode())
                    .subjectName(subject.getSubjectName())
                    .attendance(attendance != null ? attendance.getAttendancePercentage() : BigDecimal.ZERO)
                    .internal1(internal1)
                    .internal2(internal2)
                    .internal3(internal3)
                    .average(average)
                    .rank(0) // Can be calculated from comparison analytics
                    .trend(trend)
                    .build());
        }

        return performances;
    }

    private List<StudentComprehensiveAnalytics.SubjectComparison> buildSubjectComparisons(Integer studentId) {
        // Get all subjects the student has studied
        String sql = "SELECT DISTINCT subject_id, semester_id, academic_session_id " +
                "FROM attendance_calculation_cache " +
                "WHERE student_id = ? AND subject_id IS NOT NULL";

        List<StudentComprehensiveAnalytics.SubjectComparison> comparisons = new ArrayList<>();

        jdbcTemplate.query(sql, (rs, rowNum) -> {
            int subjectId = rs.getInt("subject_id");
            int semesterId = rs.getInt("semester_id");
            int academicSessionId = rs.getInt("academic_session_id");

            SubjectComparisonAnalytics analytics = subjectComparisonRepository
                    .findByStudentIdAndSemesterIdAndAcademicSessionId(studentId, semesterId, academicSessionId)
                    .stream()
                    .filter(a -> a.getSubjectId().equals(subjectId))
                    .findFirst()
                    .orElse(null);

            if (analytics != null) {
                Subject subject = atSubjectRepository.findById(subjectId).orElse(null);

                comparisons.add(StudentComprehensiveAnalytics.SubjectComparison.builder()
                        .subjectId(subjectId)
                        .subjectCode(subject != null ? subject.getSubjectCode() : "")
                        .subjectName(subject != null ? subject.getSubjectName() : "")
                        .semesterId(semesterId)
                        .studentAttendance(analytics.getStudentAttendancePercentage())
                        .studentMarks(analytics.getStudentAverageMarks())
                        .studentRank(analytics.getStudentRankInSubject())
                        .classAvgAttendance(analytics.getClassAvgAttendance())
                        .classAvgMarks(analytics.getClassAvgMarks())
                        .classHighest(analytics.getClassHighestMarks())
                        .classLowest(analytics.getClassLowestMarks())
                        .aboveAverage(analytics.getAboveClassAverage())
                        .percentile(analytics.getPercentile())
                        .performanceCategory(getPerformanceCategory(analytics.getStudentAverageMarks()))
                        .build());
            }
            return null;
        }, studentId);

        return comparisons;
    }

    private StudentComprehensiveAnalytics.TrendAnalysis buildTrendAnalysis(
            List<SemesterPerformanceSummary> summaries) {

        if (summaries.size() < 2) {
            return StudentComprehensiveAnalytics.TrendAnalysis.builder()
                    .attendanceTrend("STABLE")
                    .performanceTrend("STABLE")
                    .semesterTrends(new ArrayList<>())
                    .build();
        }

        // Calculate trends
        List<BigDecimal> attendances = summaries.stream()
                .map(SemesterPerformanceSummary::getOverallAttendancePercentage)
                .collect(Collectors.toList());

        List<BigDecimal> marks = summaries.stream()
                .map(SemesterPerformanceSummary::getAverageMarks)
                .collect(Collectors.toList());

        String attendanceTrend = calculateOverallTrend(attendances);
        String performanceTrend = calculateOverallTrend(marks);

        // Semester trends
        List<StudentComprehensiveAnalytics.SemesterTrend> semesterTrends = summaries.stream()
                .map(summary -> StudentComprehensiveAnalytics.SemesterTrend.builder()
                        .semesterNo(summary.getSemesterId())
                        .attendance(summary.getOverallAttendancePercentage())
                        .marks(summary.getAverageMarks())
                        .sgpa(summary.getSgpa())
                        .build())
                .collect(Collectors.toList());

        return StudentComprehensiveAnalytics.TrendAnalysis.builder()
                .attendanceTrend(attendanceTrend)
                .performanceTrend(performanceTrend)
                .semesterTrends(semesterTrends)
                .build();
    }

    private List<StudentComprehensiveAnalytics.Achievement> buildAchievements(Integer studentId) {
        List<TopPerformer> topPerformers = atTopPerformerRepository
                .findByStudentIdAndIsVisibleToStudentsTrue(studentId);

        return topPerformers.stream()
                .map(tp -> StudentComprehensiveAnalytics.Achievement.builder()
                        .title(tp.getCategory().name().replace("_", " "))
                        .description(getAchievementDescription(tp))
                        .category(tp.getCategory().name())
                        .semesterId(tp.getSemesterId())
                        .rank(tp.getRankPosition())
                        .build())
                .collect(Collectors.toList());
    }

    private String getAchievementDescription(TopPerformer tp) {
        switch (tp.getCategory()) {
            case OVERALL_TOPPER:
                return String.format("Ranked #%d in class with %.2f%% overall performance",
                        tp.getRankPosition(), tp.getOverallPercentage());
            case ATTENDANCE_STAR:
                return String.format("Achieved %.2f%% attendance - among top performers",
                        tp.getAttendancePercentage());
            case MOST_IMPROVED:
                return "Showed significant improvement in performance";
            default:
                return "Outstanding performance";
        }
    }

    private List<String> generateRecommendations(Integer studentId, BigDecimal attendance, BigDecimal marks) {
        List<String> recommendations = new ArrayList<>();

        if (attendance.compareTo(BigDecimal.valueOf(75)) < 0) {
            recommendations.add("⚠️ Focus on improving attendance - currently below 75% requirement");
        }

        if (marks.compareTo(BigDecimal.valueOf(60)) < 0) {
            recommendations.add("📚 Strengthen your performance - consider additional study sessions");
        }

        if (attendance.compareTo(BigDecimal.valueOf(90)) >= 0) {
            recommendations.add("⭐ Excellent attendance! Keep up the good work!");
        }

        if (marks.compareTo(BigDecimal.valueOf(75)) >= 0) {
            recommendations.add("🎓 Outstanding academic performance! Aim for even higher!");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("✅ You're doing well! Stay consistent with your efforts.");
        }

        return recommendations;
    }

    private String calculateTrend(BigDecimal v1, BigDecimal v2, BigDecimal v3) {
        if (v3.compareTo(v2) > 0 && v2.compareTo(v1) > 0) {
            return "IMPROVING";
        } else if (v3.compareTo(v2) < 0 && v2.compareTo(v1) < 0) {
            return "DECLINING";
        }
        return "STABLE";
    }

    private String calculateOverallTrend(List<BigDecimal> values) {
        if (values.size() < 2) return "STABLE";

        int improving = 0;
        int declining = 0;

        for (int i = 1; i < values.size(); i++) {
            if (values.get(i).compareTo(values.get(i-1)) > 0) improving++;
            else if (values.get(i).compareTo(values.get(i-1)) < 0) declining++;
        }

        if (improving > declining) return "IMPROVING";
        if (declining > improving) return "DECLINING";
        return "STABLE";
    }

    private String getPerformanceCategory(BigDecimal marks) {
        if (marks.compareTo(BigDecimal.valueOf(75)) >= 0) return "EXCELLENT";
        if (marks.compareTo(BigDecimal.valueOf(60)) >= 0) return "GOOD";
        if (marks.compareTo(BigDecimal.valueOf(50)) >= 0) return "AVERAGE";
        return "POOR";
    }

    private SemesterAnalyticsResponse mapToSemesterAnalyticsResponse(SemesterPerformanceSummary summary) {
        return SemesterAnalyticsResponse.builder()
                .semesterId(summary.getSemesterId())
                .semesterNo(summary.getSemesterId())
                .totalClassesConducted(summary.getTotalClassesConducted())
                .totalClassesAttended(summary.getTotalClassesAttended())
                .overallAttendancePercentage(summary.getOverallAttendancePercentage())
                .totalSubjects(summary.getTotalSubjects())
                .averageMarks(summary.getAverageMarks())
                .subjectsPassed(summary.getSubjectsPassed())
                .subjectsFailed(summary.getSubjectsFailed())
                .sgpa(summary.getSgpa())
                .classRank(summary.getClassRank())
                .sectionRank(summary.getSectionRank())
                .subjects(new ArrayList<>()) // Can be populated if needed
                .build();
    }
}