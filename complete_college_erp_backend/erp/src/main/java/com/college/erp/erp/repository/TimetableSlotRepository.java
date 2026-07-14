package com.college.erp.erp.repository;

import com.college.erp.erp.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Integer> {

    List<TimetableSlot> findByTimetableId(Integer timetableId);

    List<TimetableSlot> findByTimetableIdAndClassId(Integer timetableId, String classId);

    @Query("SELECT ts FROM TimetableSlot ts WHERE ts.timetableId = :timetableId " +
            "AND ts.staffId = :staffId ORDER BY ts.dayNumber, ts.periodNumber")
    List<TimetableSlot> findByTimetableIdAndStaffId(
            @Param("timetableId") Integer timetableId,
            @Param("staffId") Integer staffId);

    void deleteByTimetableId(Integer timetableId);
}
