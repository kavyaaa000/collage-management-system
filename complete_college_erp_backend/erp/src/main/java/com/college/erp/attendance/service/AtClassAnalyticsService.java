package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.response.ClassAnalyticsResponse;
import com.college.erp.attendance.dto.response.ClassInfoResponse;
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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtClassAnalyticsService {

    private final AtClassInfoRepository atClassInfoRepository;
    private final AtStaffClassMappingRepository atStaffClassMappingRepository;
    private final AtStudentRepository atStudentRepository;
    private final AtSubjectRepository atSubjectRepository;
    private final AtAttendanceCacheRepository atAttendanceCacheRepository;
    private final AtInternalMarksRepository atInternalMarksRepository;
    private final AtSemesterPerformanceSummaryRepository semesterSummaryRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<ClassInfoResponse> getStaffClasses(Integer staffId) {
        log.info("Fetching classes for staff: {}", staffId);

        List<Integer> classIds = atStaffClassMappingRepository.findClassIdsByStaffId(staffId);

        return classIds.stream()
                .map(classId -> atClassInfoRepository.findById(classId).orElse(null))
                .filter(classInfo -> classInfo != null && classInfo.getIsActive())
                .map(this::mapToClassInfoResponse)
                .collect(Collectors.toList());
    }

    public List<ClassInfoResponse> getAllActiveClasses() {
        log.info("Fetching all active classes");

        return atClassInfoRepository.findByIsActiveTrueOrderByClassNameAsc()
                .stream()
                .map(this::mapToClassInfoResponse)
                .collect(Collectors.toList());
    }

    public ClassAnalyticsResponse getClassAnalytics(Integer classId, Integer academicSessionId) {
        log.info("Generating analytics for class: {}", classId);

        ClassInfo classInfo = atClassInfoRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        List<Student> students = atStudentRepository.findByClassId(classId);

        // Overall metrics
        Map<String, Object> overallMetrics = calculateOverallMetrics(classId, academicSessionId);

        // Subject-wise analytics
        List<ClassAnalyticsResponse.SubjectAnalytics> subjectAnalytics =
                calculateSubjectAnalytics(classId, classInfo.getSemesterId(), academicSessionId);

        // Performance distribution
        List<ClassAnalyticsResponse.PerformanceDistribution> perfDistribution =
                calculatePerformanceDistribution(classId, academicSessionId);

        // Top performers
        List<ClassAnalyticsResponse.TopStudentSummary> topPerformers =
                getTopPerformers(classId, classInfo.getSemesterId(), academicSessionId);

        return ClassAnalyticsResponse.builder()
                .classId(classId)
                .className(classInfo.getClassName())
                .totalStudents(students.size())
                .avgClassAttendance((BigDecimal) overallMetrics.get("avgAttendance"))
                .avgClassMarks((BigDecimal) overallMetrics.get("avgMarks"))
                .minAttendance((BigDecimal) overallMetrics.get("minAttendance"))
                .maxAttendance((BigDecimal) overallMetrics.get("maxAttendance"))
                .studentsAbove75Attendance((Integer) overallMetrics.get("above75"))
                .studentsBelow75Attendance((Integer) overallMetrics.get("below75"))
                .studentsAbove60Marks((Integer) overallMetrics.get("above60Marks"))
                .studentsBelow50Marks((Integer) overallMetrics.get("below50Marks"))
                .subjectAnalytics(subjectAnalytics)
                .performanceDistribution(perfDistribution)
                .topPerformers(topPerformers)
                .build();
    }

    private ClassInfoResponse mapToClassInfoResponse(ClassInfo classInfo) {
        String sql = "SELECT " +
                "AVG(acc.attendance_percentage) as avg_attendance, " +
                "AVG(sim.marks_obtained) as avg_marks, " +
                "SUM(CASE WHEN acc.attendance_percentage >= 75 THEN 1 ELSE 0 END) as above_75, " +
                "SUM(CASE WHEN acc.attendance_percentage < 75 THEN 1 ELSE 0 END) as below_75 " +
                "FROM student s " +
                "LEFT JOIN attendance_calculation_cache acc ON s.student_id = acc.student_id AND acc.is_valid = TRUE " +
                "LEFT JOIN student_internal_marks sim ON s.student_id = sim.student_id " +
                "WHERE s.class_id = ?";

        Map<String, Object> stats = jdbcTemplate.queryForMap(sql, classInfo.getClassId());

        return ClassInfoResponse.builder()
                .classId(classInfo.getClassId())
                .className(classInfo.getClassName())
                .departmentId(classInfo.getDepartmentId())
                .semesterId(classInfo.getSemesterId())
                .sectionId(classInfo.getSectionId())
                .academicYear(classInfo.getAcademicYear())
                .classTeacherId(classInfo.getClassTeacherId())
                .totalStudents(classInfo.getTotalStudents())
                .averageAttendance(stats.get("avg_attendance") != null ?
                        new BigDecimal(stats.get("avg_attendance").toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                .averageMarks(stats.get("avg_marks") != null ?
                        new BigDecimal(stats.get("avg_marks").toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                .studentsAbove75Attendance(stats.get("above_75") != null ?
                        Integer.parseInt(stats.get("above_75").toString()) : 0)
                .studentsBelow75Attendance(stats.get("below_75") != null ?
                        Integer.parseInt(stats.get("below_75").toString()) : 0)
                .build();
    }

    private Map<String, Object> calculateOverallMetrics(Integer classId, Integer academicSessionId) {
        String sql = "SELECT " +
                "AVG(acc.attendance_percentage) as avg_attendance, " +
                "MIN(acc.attendance_percentage) as min_attendance, " +
                "MAX(acc.attendance_percentage) as max_attendance, " +
                "AVG(sim.marks_obtained) as avg_marks, " +
                "SUM(CASE WHEN acc.attendance_percentage >= 75 THEN 1 ELSE 0 END) as above_75, " +
                "SUM(CASE WHEN acc.attendance_percentage < 75 THEN 1 ELSE 0 END) as below_75, " +
                "COUNT(DISTINCT CASE WHEN sim.marks_obtained >= 60 THEN s.student_id END) as above_60_marks, " +
                "COUNT(DISTINCT CASE WHEN sim.marks_obtained < 50 THEN s.student_id END) as below_50_marks " +
                "FROM student s " +
                "LEFT JOIN attendance_calculation_cache acc ON s.student_id = acc.student_id AND acc.is_valid = TRUE " +
                "LEFT JOIN student_internal_marks sim ON s.student_id = sim.student_id AND sim.session_id = ? " +
                "WHERE s.class_id = ?";

        return jdbcTemplate.queryForMap(sql, academicSessionId, classId);
    }

    private List<ClassAnalyticsResponse.SubjectAnalytics> calculateSubjectAnalytics(
            Integer classId, Integer semesterId, Integer academicSessionId) {

        List<Subject> subjects = atSubjectRepository.findBySemesterId(semesterId);
        List<ClassAnalyticsResponse.SubjectAnalytics> analytics = new ArrayList<>();

        for (Subject subject : subjects) {
            String sql = "SELECT " +
                    "AVG(acc.attendance_percentage) as avg_attendance, " +
                    "AVG(sim.marks_obtained) as avg_marks, " +
                    "COUNT(DISTINCT s.student_id) as total_students, " +
                    "COUNT(DISTINCT CASE WHEN sim.marks_obtained >= 50 THEN s.student_id END) as passing, " +
                    "COUNT(DISTINCT CASE WHEN sim.marks_obtained < 50 THEN s.student_id END) as failing " +
                    "FROM student s " +
                    "LEFT JOIN attendance_calculation_cache acc ON s.student_id = acc.student_id " +
                    "  AND acc.subject_id = ? AND acc.is_valid = TRUE " +
                    "LEFT JOIN student_internal_marks sim ON s.student_id = sim.student_id " +
                    "  AND sim.subject_id = ? AND sim.session_id = ? " +
                    "WHERE s.class_id = ?";

            Map<String, Object> stats = jdbcTemplate.queryForMap(sql,
                    subject.getSubjectId(), subject.getSubjectId(), academicSessionId, classId);

            analytics.add(ClassAnalyticsResponse.SubjectAnalytics.builder()
                    .subjectId(subject.getSubjectId())
                    .subjectCode(subject.getSubjectCode())
                    .subjectName(subject.getSubjectName())
                    .avgAttendance(stats.get("avg_attendance") != null ?
                            new BigDecimal(stats.get("avg_attendance").toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                    .avgMarks(stats.get("avg_marks") != null ?
                            new BigDecimal(stats.get("avg_marks").toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                    .totalStudents(Integer.parseInt(stats.get("total_students").toString()))
                    .passingStudents(stats.get("passing") != null ? Integer.parseInt(stats.get("passing").toString()) : 0)
                    .failingStudents(stats.get("failing") != null ? Integer.parseInt(stats.get("failing").toString()) : 0)
                    .build());
        }

        return analytics;
    }

    private List<ClassAnalyticsResponse.PerformanceDistribution> calculatePerformanceDistribution(
            Integer classId, Integer academicSessionId) {

        String sql = "SELECT " +
                "SUM(CASE WHEN avg_marks >= 75 THEN 1 ELSE 0 END) as excellent, " +
                "SUM(CASE WHEN avg_marks >= 60 AND avg_marks < 75 THEN 1 ELSE 0 END) as good, " +
                "SUM(CASE WHEN avg_marks >= 50 AND avg_marks < 60 THEN 1 ELSE 0 END) as average, " +
                "SUM(CASE WHEN avg_marks < 50 THEN 1 ELSE 0 END) as poor, " +
                "COUNT(*) as total " +
                "FROM ( " +
                "  SELECT s.student_id, AVG(sim.marks_obtained) as avg_marks " +
                "  FROM student s " +
                "  LEFT JOIN student_internal_marks sim ON s.student_id = sim.student_id AND sim.session_id = ? " +
                "  WHERE s.class_id = ? " +
                "  GROUP BY s.student_id " +
                ") student_avgs";

        Map<String, Object> dist = jdbcTemplate.queryForMap(sql, academicSessionId, classId);

        int total = Integer.parseInt(dist.get("total").toString());

        List<ClassAnalyticsResponse.PerformanceDistribution> distribution = new ArrayList<>();

        distribution.add(ClassAnalyticsResponse.PerformanceDistribution.builder()
                .category("Excellent (≥75%)")
                .count(Integer.parseInt(dist.get("excellent").toString()))
                .percentage(BigDecimal.valueOf((Integer.parseInt(dist.get("excellent").toString()) * 100.0) / total)
                        .setScale(2, RoundingMode.HALF_UP))
                .build());

        distribution.add(ClassAnalyticsResponse.PerformanceDistribution.builder()
                .category("Good (60-75%)")
                .count(Integer.parseInt(dist.get("good").toString()))
                .percentage(BigDecimal.valueOf((Integer.parseInt(dist.get("good").toString()) * 100.0) / total)
                        .setScale(2, RoundingMode.HALF_UP))
                .build());

        distribution.add(ClassAnalyticsResponse.PerformanceDistribution.builder()
                .category("Average (50-60%)")
                .count(Integer.parseInt(dist.get("average").toString()))
                .percentage(BigDecimal.valueOf((Integer.parseInt(dist.get("average").toString()) * 100.0) / total)
                        .setScale(2, RoundingMode.HALF_UP))
                .build());

        distribution.add(ClassAnalyticsResponse.PerformanceDistribution.builder()
                .category("Poor (<50%)")
                .count(Integer.parseInt(dist.get("poor").toString()))
                .percentage(BigDecimal.valueOf((Integer.parseInt(dist.get("poor").toString()) * 100.0) / total)
                        .setScale(2, RoundingMode.HALF_UP))
                .build());

        return distribution;
    }

    private List<ClassAnalyticsResponse.TopStudentSummary> getTopPerformers(
            Integer classId, Integer semesterId, Integer academicSessionId) {

        List<SemesterPerformanceSummary> summaries = semesterSummaryRepository
                .findByClassIdOrderByAverageMarksDesc(classId, semesterId, academicSessionId);

        return summaries.stream()
                .limit(10)
                .map(summary -> {
                    Student student = atStudentRepository.findById(summary.getStudentId()).orElse(null);
                    return ClassAnalyticsResponse.TopStudentSummary.builder()
                            .studentId(summary.getStudentId())
                            .studentName(student != null ? student.getStudentName() : "")
                            .registerNumber(student != null ? student.getRegisterNumber() : "")
                            .rank(summary.getClassRank())
                            .overallPercentage(summary.getAverageMarks())
                            .attendancePercentage(summary.getOverallAttendancePercentage())
                            .build();
                })
                .collect(Collectors.toList());
    }
}