package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "timetableslot")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Integer slotId;

    @Column(name = "timetable_id", nullable = false)
    private Integer timetableId;

    @Column(name = "class_id", nullable = false)
    private String classId;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "period_number", nullable = false)
    private Integer periodNumber;

    // CHANGED: String instead of Integer to handle "123_B1" format
    @Column(name = "subject_id")
    private String subjectId;

    @Column(name = "staff_id")
    private Integer staffId;

    @Column(name = "room_id")
    private Integer roomId;

    @Column(name = "is_lab")
    private Boolean isLab = false;

    @Column(name = "lab_batch")
    private String labBatch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timetable_id", insertable = false, updatable = false)
    private GeneratedTimetable generatedTimetable;

    // REMOVED: Subject relationship (since subject_id is now String)
    // Use custom query to fetch subject if needed

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", insertable = false, updatable = false)
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", insertable = false, updatable = false)
    private Room room;
}
