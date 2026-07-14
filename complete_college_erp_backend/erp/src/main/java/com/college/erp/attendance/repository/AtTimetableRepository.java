package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.Timetable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtTimetableRepository extends JpaRepository<Timetable, Integer> {


    @Query("SELECT t.timetableId FROM Timetable t ORDER BY t.timetableId ASC")
    List<Integer> findAllIds(Pageable pageable);

    default Optional<Integer> findFirstId() {
        List<Integer> ids = findAllIds(PageRequest.of(0, 1));
        return ids.isEmpty() ? Optional.empty() : Optional.of(ids.get(0));
    }




    List<Timetable> findBySemesterIdAndSectionIdOrderByDayOfWeekAscPeriodNumberAsc(
            Integer semesterId, Integer sectionId);

    List<Timetable> findByStaffIdAndDayOfWeek(Integer staffId, String dayOfWeek);

    @Query("SELECT t FROM Timetable t WHERE t.semesterId = :semesterId AND t.sectionId = :sectionId " +
            "AND t.dayOfWeek = :dayOfWeek AND t.subjectId IS NOT NULL ORDER BY t.periodNumber")
    List<Timetable> findTeachingPeriodsByDay(Integer semesterId, Integer sectionId, String dayOfWeek);

    Optional<Timetable> findBySemesterIdAndSectionIdAndDayOfWeekAndPeriodNumber(
            Integer semesterId, Integer sectionId, String dayOfWeek, Integer periodNumber);
}