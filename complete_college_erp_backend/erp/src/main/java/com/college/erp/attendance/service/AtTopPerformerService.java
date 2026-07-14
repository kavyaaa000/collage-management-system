package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.response.TopPerformerResponse;
import com.college.erp.attendance.entity.Student;
import com.college.erp.attendance.entity.Subject;
import com.college.erp.attendance.entity.TopPerformer;
import com.college.erp.attendance.repository.AtStudentRepository;
import com.college.erp.attendance.repository.AtSubjectRepository;
import com.college.erp.attendance.repository.AtTopPerformerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtTopPerformerService {

    private final AtTopPerformerRepository atTopPerformerRepository;
    private final AtStudentRepository atStudentRepository;
    private final AtSubjectRepository atSubjectRepository;

    public List<TopPerformerResponse> getTopPerformers(Integer classId, Integer semesterId, Integer academicSessionId) {
        log.info("Fetching top performers for class: {}", classId);

        List<TopPerformer> performers = atTopPerformerRepository
                .findByClassIdAndSemesterIdAndAcademicSessionIdAndIsVisibleToStudentsTrueOrderByRankPositionAsc(
                        classId, semesterId, academicSessionId);

        return performers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TopPerformerResponse> getTopPerformersByCategory(Integer classId, TopPerformer.Category category) {
        log.info("Fetching top performers by category: {} for class: {}", category, classId);

        List<TopPerformer> performers = atTopPerformerRepository
                .findByClassIdAndCategoryAndIsVisibleToStudentsTrueOrderByRankPositionAsc(classId, category);

        return performers.stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TopPerformerResponse mapToResponse(TopPerformer performer) {
        Student student = atStudentRepository.findById(performer.getStudentId()).orElse(null);
        Subject subject = performer.getSubjectId() != null ?
                atSubjectRepository.findById(performer.getSubjectId()).orElse(null) : null;

        return TopPerformerResponse.builder()
                .performerId(performer.getPerformerId())
                .studentId(performer.getStudentId())
                .studentName(student != null ? student.getStudentName() : "")
                .registerNumber(student != null ? student.getRegisterNumber() : "")
                .rankPosition(performer.getRankPosition())
                .overallPercentage(performer.getOverallPercentage())
                .attendancePercentage(performer.getAttendancePercentage())
                .category(performer.getCategory().name())
                .subjectName(subject != null ? subject.getSubjectName() : null)
                .canViewProfile(true)
                .build();
    }
}