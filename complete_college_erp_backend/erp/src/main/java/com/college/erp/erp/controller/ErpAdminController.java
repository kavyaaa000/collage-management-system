package com.college.erp.erp.controller;

import com.college.erp.erp.entity.*;
import com.college.erp.erp.service.ErpAdminService;
import com.college.erp.erp.service.MarksAnalysisService;
import com.college.erp.erp.service.StudentAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Super Admin Controller - God Mode Access to All Entities
 */
@RestController
@RequestMapping("/api/erp/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class ErpAdminController {


    @Autowired
    private MarksAnalysisService marksAnalysisService;

    @Autowired
    private ErpAdminService erpAdminService;

    @Autowired
    private StudentAnalyticsService analyticsService;


    @GetMapping("/marks/student/{studentId}/semester/{semesterId}/session/{sessionId}")
    public ResponseEntity<?> getStudentMarksDetail(
            @PathVariable Integer studentId,
            @PathVariable Integer semesterId,
            @PathVariable Integer sessionId) {
        return ResponseEntity.ok(marksAnalysisService.getStudentMarksDetail(studentId, semesterId, sessionId));
    }

    /**
     * Get all marks for a student (all semesters)
     */


    /**
     * Get all marks for a specific exam
     */
    @GetMapping("/marks/exam/{examId}")
    public ResponseEntity<List<StudentExamMark>> getMarksByExam(@PathVariable Integer examId) {
        return ResponseEntity.ok(erpAdminService.getMarksByExam(examId));
    }

    /**
     * Get mark for a specific student and exam
     */
    @GetMapping("/marks/student/{studentId}/exam/{examId}")
    public ResponseEntity<StudentExamMark> getMarkByStudentAndExam(
            @PathVariable Integer studentId,
            @PathVariable Integer examId) {
        StudentExamMark mark = erpAdminService.getMarkByStudentAndExam(studentId, examId);
        return mark != null ? ResponseEntity.ok(mark) : ResponseEntity.notFound().build();
    }

    /**
     * Bulk update marks
     */
    @PutMapping("/marks/bulk")
    public ResponseEntity<List<StudentExamMark>> bulkUpdateMarks(@RequestBody List<StudentExamMark> marks) {
        return ResponseEntity.ok(erpAdminService.bulkUpdateMarks(marks));
    }


    // ==================== COLLEGE ENDPOINTS ====================

    @GetMapping("/colleges")
    public ResponseEntity<List<College>> getAllColleges() {
        return ResponseEntity.ok(erpAdminService.getAllColleges());
    }

    @GetMapping("/colleges/{id}")
    public ResponseEntity<College> getCollegeById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getCollegeById(id));
    }

    @PostMapping("/colleges")
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createCollege(college));
    }

    @PutMapping("/colleges/{id}")
    public ResponseEntity<College> updateCollege(
            @PathVariable Integer id,
            @RequestBody College college) {
        return ResponseEntity.ok(erpAdminService.updateCollege(id, college));
    }

    @DeleteMapping("/colleges/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Integer id) {
        erpAdminService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== DEPARTMENT ENDPOINTS ====================

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(erpAdminService.getAllDepartments());
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getDepartmentById(id));
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department dept) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createDepartment(dept));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Integer id,
            @RequestBody Department dept) {
        return ResponseEntity.ok(erpAdminService.updateDepartment(id, dept));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Integer id) {
        erpAdminService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== STUDENT ENDPOINTS ====================

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(erpAdminService.getAllStudents());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getStudentById(id));
    }

    @GetMapping("/students/department/{deptId}")
    public ResponseEntity<List<Student>> getStudentsByDepartment(@PathVariable Integer deptId) {
        return ResponseEntity.ok(erpAdminService.getStudentsByDepartment(deptId));
    }

    @GetMapping("/students/batch/{year}")
    public ResponseEntity<List<Student>> getStudentsByBatch(@PathVariable Integer year) {
        return ResponseEntity.ok(erpAdminService.getStudentsByBatch(year));
    }

    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createStudent(student));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Integer id,
            @RequestBody Student student) {
        return ResponseEntity.ok(erpAdminService.updateStudent(id, student));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer id) {
        erpAdminService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/students/{id}/journey")
    public ResponseEntity<?> getStudentJourney(@PathVariable Integer id) {
        return ResponseEntity.ok(analyticsService.getStudentJourney(id));
    }

    // ==================== STAFF ENDPOINTS ====================

    @GetMapping("/staff")
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(erpAdminService.getAllStaff());
    }

    @GetMapping("/staff/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getStaffById(id));
    }

    @PostMapping("/staff")
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createStaff(staff));
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Integer id,
            @RequestBody Staff staff) {
        return ResponseEntity.ok(erpAdminService.updateStaff(id, staff));
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        erpAdminService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== SUBJECT ENDPOINTS ====================

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(erpAdminService.getAllSubjects());
    }

    @GetMapping("/subjects/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getSubjectById(id));
    }

    @GetMapping("/subjects/department/{deptId}")
    public ResponseEntity<List<Subject>> getSubjectsByDepartment(@PathVariable Integer deptId) {
        return ResponseEntity.ok(erpAdminService.getSubjectsByDepartment(deptId));
    }

    @PostMapping("/subjects")
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createSubject(subject));
    }

    @PutMapping("/subjects/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Integer id,
            @RequestBody Subject subject) {
        return ResponseEntity.ok(erpAdminService.updateSubject(id, subject));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Integer id) {
        erpAdminService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ACADEMIC SESSION ENDPOINTS ====================

    @GetMapping("/sessions")
    public ResponseEntity<List<AcademicSession>> getAllSessions() {
        return ResponseEntity.ok(erpAdminService.getAllSessions());
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<AcademicSession> getSessionById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getSessionById(id));
    }

    @PostMapping("/sessions")
    public ResponseEntity<AcademicSession> createSession(@RequestBody AcademicSession session) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createSession(session));
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<AcademicSession> updateSession(
            @PathVariable Integer id,
            @RequestBody AcademicSession session) {
        return ResponseEntity.ok(erpAdminService.updateSession(id, session));
    }

    @PutMapping("/sessions/{id}/lock")
    public ResponseEntity<AcademicSession> lockSession(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.lockSession(id));
    }

    @PutMapping("/sessions/{id}/unlock")
    public ResponseEntity<AcademicSession> unlockSession(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.unlockSession(id));
    }

    // ==================== EXAM ENDPOINTS ====================

    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(erpAdminService.getAllExams());
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getExamById(id));
    }

    @PostMapping("/exams")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createExam(exam));
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<Exam> updateExam(
            @PathVariable Integer id,
            @RequestBody Exam exam) {
        return ResponseEntity.ok(erpAdminService.updateExam(id, exam));
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Integer id) {
        erpAdminService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ATTENDANCE ENDPOINTS ====================

    @GetMapping("/attendance")
    public ResponseEntity<List<StudentSemesterAttendance>> getAllAttendance() {
        return ResponseEntity.ok(erpAdminService.getAllAttendance());
    }

    @GetMapping("/attendance/{id}")
    public ResponseEntity<StudentSemesterAttendance> getAttendanceById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getAttendanceById(id));
    }

    @PostMapping("/attendance")
    public ResponseEntity<StudentSemesterAttendance> createAttendance(
            @RequestBody StudentSemesterAttendance attendance) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createAttendance(attendance));
    }

    @PutMapping("/attendance/{id}")
    public ResponseEntity<StudentSemesterAttendance> updateAttendance(
            @PathVariable Integer id,
            @RequestBody StudentSemesterAttendance attendance) {
        return ResponseEntity.ok(erpAdminService.updateAttendance(id, attendance));
    }

    @DeleteMapping("/attendance/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Integer id) {
        erpAdminService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== EXAM MARKS ENDPOINTS ====================

    @GetMapping("/marks")
    public ResponseEntity<List<StudentExamMark>> getAllMarks() {
        return ResponseEntity.ok(erpAdminService.getAllMarks());
    }

    @GetMapping("/marks/{id}")
    public ResponseEntity<StudentExamMark> getMarkById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getMarkById(id));
    }

    @PostMapping("/marks")
    public ResponseEntity<StudentExamMark> createMark(@RequestBody StudentExamMark mark) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createMark(mark));
    }

    @PutMapping("/marks/{id}")
    public ResponseEntity<StudentExamMark> updateMark(
            @PathVariable Integer id,
            @RequestBody StudentExamMark mark) {
        return ResponseEntity.ok(erpAdminService.updateMark(id, mark));
    }

    @DeleteMapping("/marks/{id}")
    public ResponseEntity<Void> deleteMark(@PathVariable Integer id) {
        erpAdminService.deleteMark(id);
        return ResponseEntity.noContent().build();
    }



















    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getAllPrograms() {
        return ResponseEntity.ok(erpAdminService.getAllPrograms());
    }

    @GetMapping("/programs/{id}")
    public ResponseEntity<Program> getProgramById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getProgramById(id));
    }

    @PostMapping("/programs")
    public ResponseEntity<Program> createProgram(@RequestBody Program program) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createProgram(program));
    }

    @PutMapping("/programs/{id}")
    public ResponseEntity<Program> updateProgram(
            @PathVariable Integer id,
            @RequestBody Program program) {
        return ResponseEntity.ok(erpAdminService.updateProgram(id, program));
    }

    @DeleteMapping("/programs/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Integer id) {
        erpAdminService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== REGULATION ENDPOINTS ====================

    @GetMapping("/regulations")
    public ResponseEntity<List<Regulation>> getAllRegulations() {
        return ResponseEntity.ok(erpAdminService.getAllRegulations());
    }

    @GetMapping("/regulations/{id}")
    public ResponseEntity<Regulation> getRegulationById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getRegulationById(id));
    }

    @GetMapping("/regulations/active")
    public ResponseEntity<List<Regulation>> getActiveRegulations() {
        return ResponseEntity.ok(erpAdminService.getActiveRegulations());
    }

    @PostMapping("/regulations")
    public ResponseEntity<Regulation> createRegulation(@RequestBody Regulation regulation) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createRegulation(regulation));
    }

    @PutMapping("/regulations/{id}")
    public ResponseEntity<Regulation> updateRegulation(
            @PathVariable Integer id,
            @RequestBody Regulation regulation) {
        return ResponseEntity.ok(erpAdminService.updateRegulation(id, regulation));
    }

    @DeleteMapping("/regulations/{id}")
    public ResponseEntity<Void> deleteRegulation(@PathVariable Integer id) {
        erpAdminService.deleteRegulation(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== SEMESTER ENDPOINTS ====================

    @GetMapping("/semesters")
    public ResponseEntity<List<Semester>> getAllSemesters() {
        return ResponseEntity.ok(erpAdminService.getAllSemesters());
    }

    @GetMapping("/semesters/{id}")
    public ResponseEntity<Semester> getSemesterById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getSemesterById(id));
    }

    @PostMapping("/semesters")
    public ResponseEntity<Semester> createSemester(@RequestBody Semester semester) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createSemester(semester));
    }

    @PutMapping("/semesters/{id}")
    public ResponseEntity<Semester> updateSemester(
            @PathVariable Integer id,
            @RequestBody Semester semester) {
        return ResponseEntity.ok(erpAdminService.updateSemester(id, semester));
    }

    @DeleteMapping("/semesters/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Integer id) {
        erpAdminService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== SECTION ENDPOINTS ====================

    @GetMapping("/sections")
    public ResponseEntity<List<Section>> getAllSections() {
        return ResponseEntity.ok(erpAdminService.getAllSections());
    }

    @GetMapping("/sections/{id}")
    public ResponseEntity<Section> getSectionById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getSectionById(id));
    }

    @PostMapping("/sections")
    public ResponseEntity<Section> createSection(@RequestBody Section section) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createSection(section));
    }

    @PutMapping("/sections/{id}")
    public ResponseEntity<Section> updateSection(
            @PathVariable Integer id,
            @RequestBody Section section) {
        return ResponseEntity.ok(erpAdminService.updateSection(id, section));
    }

    @DeleteMapping("/sections/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Integer id) {
        erpAdminService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BLOCK ENDPOINTS ====================

    @GetMapping("/blocks")
    public ResponseEntity<List<Block>> getAllBlocks() {
        return ResponseEntity.ok(erpAdminService.getAllBlocks());
    }

    @GetMapping("/blocks/{id}")
    public ResponseEntity<Block> getBlockById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getBlockById(id));
    }

    @GetMapping("/blocks/college/{collegeId}")
    public ResponseEntity<List<Block>> getBlocksByCollege(@PathVariable Integer collegeId) {
        return ResponseEntity.ok(erpAdminService.getBlocksByCollege(collegeId));
    }

    @PostMapping("/blocks")
    public ResponseEntity<Block> createBlock(@RequestBody Block block) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createBlock(block));
    }

    @PutMapping("/blocks/{id}")
    public ResponseEntity<Block> updateBlock(
            @PathVariable Integer id,
            @RequestBody Block block) {
        return ResponseEntity.ok(erpAdminService.updateBlock(id, block));
    }

    @DeleteMapping("/blocks/{id}")
    public ResponseEntity<Void> deleteBlock(@PathVariable Integer id) {
        erpAdminService.deleteBlock(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== FLOOR ENDPOINTS ====================

    @GetMapping("/floors")
    public ResponseEntity<List<Floor>> getAllFloors() {
        return ResponseEntity.ok(erpAdminService.getAllFloors());
    }

    @GetMapping("/floors/{id}")
    public ResponseEntity<Floor> getFloorById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getFloorById(id));
    }

    @GetMapping("/floors/block/{blockId}")
    public ResponseEntity<List<Floor>> getFloorsByBlock(@PathVariable Integer blockId) {
        return ResponseEntity.ok(erpAdminService.getFloorsByBlock(blockId));
    }

    @PostMapping("/floors")
    public ResponseEntity<Floor> createFloor(@RequestBody Floor floor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createFloor(floor));
    }

    @PutMapping("/floors/{id}")
    public ResponseEntity<Floor> updateFloor(
            @PathVariable Integer id,
            @RequestBody Floor floor) {
        return ResponseEntity.ok(erpAdminService.updateFloor(id, floor));
    }

    @DeleteMapping("/floors/{id}")
    public ResponseEntity<Void> deleteFloor(@PathVariable Integer id) {
        erpAdminService.deleteFloor(id);
        return ResponseEntity.noContent().build();
    }
// ==================== ROOM ENDPOINTS ====================

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(erpAdminService.getAllRooms());
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getRoomById(id));
    }

    @GetMapping("/rooms/floor/{floorId}")
    public ResponseEntity<List<Room>> getRoomsByFloor(@PathVariable Integer floorId) {
        return ResponseEntity.ok(erpAdminService.getRoomsByFloor(floorId));
    }

    @GetMapping("/rooms/type/{roomTypeId}")
    public ResponseEntity<List<Room>> getRoomsByType(@PathVariable Integer roomTypeId) {
        return ResponseEntity.ok(erpAdminService.getRoomsByType(roomTypeId));
    }

    @PostMapping("/rooms")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createRoom(room));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Integer id,
            @RequestBody Room room) {
        return ResponseEntity.ok(erpAdminService.updateRoom(id, room));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer id) {
        erpAdminService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

// ==================== ROOM TYPE ENDPOINTS ====================

    @GetMapping("/roomtypes")
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(erpAdminService.getAllRoomTypes());
    }

    @GetMapping("/roomtypes/{id}")
    public ResponseEntity<RoomType> getRoomTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getRoomTypeById(id));
    }

    @PostMapping("/roomtypes")
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createRoomType(roomType));
    }

    @PutMapping("/roomtypes/{id}")
    public ResponseEntity<RoomType> updateRoomType(
            @PathVariable Integer id,
            @RequestBody RoomType roomType) {
        return ResponseEntity.ok(erpAdminService.updateRoomType(id, roomType));
    }

    @DeleteMapping("/roomtypes/{id}")
    public ResponseEntity<Void> deleteRoomType(@PathVariable Integer id) {
        erpAdminService.deleteRoomType(id);
        return ResponseEntity.noContent().build();
    }

// ==================== EXAM TYPE ENDPOINTS ====================

    @GetMapping("/examtypes")
    public ResponseEntity<List<ExamType>> getAllExamTypes() {
        return ResponseEntity.ok(erpAdminService.getAllExamTypes());
    }

    @GetMapping("/examtypes/{id}")
    public ResponseEntity<ExamType> getExamTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getExamTypeById(id));
    }

    @PostMapping("/examtypes")
    public ResponseEntity<ExamType> createExamType(@RequestBody ExamType examType) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createExamType(examType));
    }

    @PutMapping("/examtypes/{id}")
    public ResponseEntity<ExamType> updateExamType(
            @PathVariable Integer id,
            @RequestBody ExamType examType) {
        return ResponseEntity.ok(erpAdminService.updateExamType(id, examType));
    }

    @DeleteMapping("/examtypes/{id}")
    public ResponseEntity<Void> deleteExamType(@PathVariable Integer id) {
        erpAdminService.deleteExamType(id);
        return ResponseEntity.noContent().build();
    }

// ==================== STUDENT SEMESTER HISTORY ENDPOINTS ====================

    @GetMapping("/history")
    public ResponseEntity<List<StudentSemesterHistory>> getAllHistory() {
        return ResponseEntity.ok(erpAdminService.getAllHistory());
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<StudentSemesterHistory> getHistoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(erpAdminService.getHistoryById(id));
    }

    @GetMapping("/history/student/{studentId}")
    public ResponseEntity<List<StudentSemesterHistory>> getHistoryByStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(erpAdminService.getHistoryByStudent(studentId));
    }

    @PostMapping("/history")
    public ResponseEntity<StudentSemesterHistory> createHistory(@RequestBody StudentSemesterHistory history) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(erpAdminService.createHistory(history));
    }

    @PutMapping("/history/{id}")
    public ResponseEntity<StudentSemesterHistory> updateHistory(
            @PathVariable Integer id,
            @RequestBody StudentSemesterHistory history) {
        return ResponseEntity.ok(erpAdminService.updateHistory(id, history));
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Integer id) {
        erpAdminService.deleteHistory(id);
        return ResponseEntity.noContent().build();
    }






    /**
     * Get student marks by semester (latest session or all sessions)
     */
    @GetMapping("/marks/student/{studentId}/semester/{semesterId}")
    public ResponseEntity<?> getStudentMarksBySemester(
            @PathVariable Integer studentId,
            @PathVariable Integer semesterId,
            @RequestParam(required = false) Integer sessionId) {

        if (sessionId != null) {
            // If session specified, use existing method
            return ResponseEntity.ok(
                    marksAnalysisService.getStudentMarksDetail(studentId, semesterId, sessionId)
            );
        } else {
            // Get latest session or all sessions
            return ResponseEntity.ok(
                    marksAnalysisService.getStudentMarksBySemester(studentId, semesterId)
            );
        }
    }



//    // In AdminController.java - UPDATE this endpoint
//    @GetMapping("/marks/student/{studentId}")
//    public ResponseEntity<?> getMarksByStudent(@PathVariable Integer studentId) {
//        try {
//            List<StudentExamMark> marks = adminService.getMarksByStudent(studentId);
//
//            // Group by semester for better frontend handling
//            Map<String, List<StudentExamMark>> groupedMarks = marks.stream()
//                    .collect(Collectors.groupingBy(mark ->
//                            "Sem" + mark.getExam().getSemesterId() + "_Sess" + mark.getExam().getSessionId()
//                    ));
//
//            return ResponseEntity.ok(groupedMarks);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
//        }
//    }





    @GetMapping("/marks/student/{studentId}")
    public ResponseEntity<?> getMarksByStudent(@PathVariable Integer studentId) {
        try {
            List<StudentExamMark> marks = erpAdminService.getMarksByStudent(studentId);

            if (marks.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>()); // Return empty list instead of error
            }

            // Group by semester and session
            Map<String, List<Map<String, Object>>> groupedMarks = new HashMap<>();

            for (StudentExamMark mark : marks) {
                String key = "Sem" + mark.getExam().getSemesterId() +
                        "_Sess" + mark.getExam().getSessionId();

                if (!groupedMarks.containsKey(key)) {
                    groupedMarks.put(key, new ArrayList<>());
                }

                Map<String, Object> markData = new HashMap<>();
                markData.put("markId", mark.getMarkId());
                markData.put("marksObtained", mark.getMarksObtained());
                markData.put("isAbsent", mark.getIsAbsent());

                // Add exam details
                Map<String, Object> examData = new HashMap<>();
                examData.put("examId", mark.getExam().getExamId());
                examData.put("semesterId", mark.getExam().getSemesterId());
                examData.put("sessionId", mark.getExam().getSessionId());
                examData.put("examDate", mark.getExam().getExamDate());

                // Add subject details if available
                if (mark.getExam().getSubject() != null) {
                    Map<String, Object> subjectData = new HashMap<>();
                    subjectData.put("subjectId", mark.getExam().getSubject().getSubjectId());
                    subjectData.put("subjectName", mark.getExam().getSubject().getSubjectName());
                    subjectData.put("subjectCode", mark.getExam().getSubject().getSubjectCode());
                    examData.put("subject", subjectData);
                }

                // Add exam type details if available
                if (mark.getExam().getExamType() != null) {
                    Map<String, Object> examTypeData = new HashMap<>();
                    examTypeData.put("examTypeId", mark.getExam().getExamType().getExamTypeId());
                    examTypeData.put("examTypeName", mark.getExam().getExamType().getExamTypeName());
                    examData.put("examType", examTypeData);
                }

                markData.put("exam", examData);
                groupedMarks.get(key).add(markData);
            }

            return ResponseEntity.ok(groupedMarks);

        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to load marks: " + e.getMessage()));
        }
    }

}