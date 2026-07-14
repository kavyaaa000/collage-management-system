package com.college.erp.attendance.controller;

import com.college.erp.attendance.entity.Timetable;
import com.college.erp.attendance.service.AtTimetableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("at/timetable")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Timetable", description = "APIs for timetable management")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtTimetableController {

    private final AtTimetableService atTimetableService;

    @GetMapping("/week")
    @Operation(summary = "Get weekly timetable", description = "Get complete weekly timetable for a class")
    public ResponseEntity<List<Timetable>> getWeeklyTimetable(
            @RequestParam Integer semesterId,
            @RequestParam Integer sectionId) {
        log.info("REST request to get weekly timetable for semester: {}, section: {}",
                semesterId, sectionId);
        List<Timetable> timetable = atTimetableService.getWeeklyTimetable(semesterId, sectionId);
        return ResponseEntity.ok(timetable);
    }

    @GetMapping("/today/{staffId}")
    @Operation(summary = "Get today's schedule", description = "Get today's schedule for a staff member")
    public ResponseEntity<List<Timetable>> getTodaySchedule(@PathVariable Integer staffId) {
        log.info("REST request to get today's schedule for staff: {}", staffId);
        List<Timetable> schedule = atTimetableService.getTodaySchedule(staffId);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/day")
    @Operation(summary = "Get day schedule", description = "Get teaching periods for a specific day")
    public ResponseEntity<List<Timetable>> getDaySchedule(
            @RequestParam Integer semesterId,
            @RequestParam Integer sectionId,
            @RequestParam String dayOfWeek) {
        log.info("REST request to get schedule for day: {}", dayOfWeek);
        List<Timetable> schedule = atTimetableService.getTeachingPeriodsForDay(
                semesterId, sectionId, dayOfWeek);
        return ResponseEntity.ok(schedule);
    }
}