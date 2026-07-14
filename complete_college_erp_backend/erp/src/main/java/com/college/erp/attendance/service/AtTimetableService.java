package com.college.erp.attendance.service;

import com.college.erp.attendance.entity.Timetable;
import com.college.erp.attendance.repository.AtTimetableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtTimetableService {

    private final AtTimetableRepository atTimetableRepository;

    public List<Timetable> getWeeklyTimetable(Integer semesterId, Integer sectionId) {
        log.info("Fetching weekly timetable for semester: {}, section: {}", semesterId, sectionId);
        return atTimetableRepository.findBySemesterIdAndSectionIdOrderByDayOfWeekAscPeriodNumberAsc(
                semesterId, sectionId);
    }

    public List<Timetable> getTodaySchedule(Integer staffId) {
        String dayOfWeek = LocalDate.now().getDayOfWeek().name();
        log.info("Fetching today's schedule for staff: {}, day: {}", staffId, dayOfWeek);
        return atTimetableRepository.findByStaffIdAndDayOfWeek(staffId, dayOfWeek);
    }

    public List<Timetable> getTeachingPeriodsForDay(Integer semesterId, Integer sectionId, String dayOfWeek) {
        return atTimetableRepository.findTeachingPeriodsByDay(semesterId, sectionId, dayOfWeek);
    }
}