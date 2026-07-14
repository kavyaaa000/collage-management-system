package com.college.erp.erp.service;

import com.college.erp.erp.entity.*;
import com.college.erp.exception.BusinessException;
import com.college.erp.exception.ResourceNotFoundException;
import com.college.erp.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Generic Admin Service for CRUD operations on all master data
 * This service provides God Mode access to all entities
 */
@Service
@Transactional
public class ErpAdminService {

    @Autowired private CollegeRepository collegeRepo;
    @Autowired private DepartmentRepository deptRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private StaffRepository staffRepo;
    @Autowired private SubjectRepository subjectRepo;
    @Autowired private AcademicSessionRepository sessionRepo;
    @Autowired private ExamRepository examRepo;
    @Autowired private StudentExamMarkRepository markRepo;
    @Autowired private StudentSemesterAttendanceRepository attendanceRepo;



    @Autowired private ProgramRepository programRepo;
    @Autowired private RegulationRepository regulationRepo;
    @Autowired private SectionRepository sectionRepo;
    @Autowired private BlockRepository blockRepo;
    @Autowired private FloorRepository floorRepo;
    @Autowired private ErpRoomRepository roomRepo;
    @Autowired private RoomTypeRepository roomTypeRepo;
    @Autowired private ExamTypeRepository examTypeRepo;
    @Autowired private StudentSemesterHistoryRepository historyRepo;
    @Autowired private SemesterRepository semesterRepo;



    // ==================== PROGRAM OPERATIONS ====================

    public List<Program> getAllPrograms() {
        return programRepo.findAll();
    }

    public Program getProgramById(Integer id) {
        return programRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", "id", id));
    }

    public Program createProgram(Program program) {
        if (programRepo.existsByProgramCode(program.getProgramCode())) {
            throw new BusinessException("DUPLICATE_CODE",
                    "Program with code " + program.getProgramCode() + " already exists");
        }
        return programRepo.save(program);
    }

    public Program updateProgram(Integer id, Program program) {
        getProgramById(id);
        program.setProgramId(id);
        return programRepo.save(program);
    }

    public void deleteProgram(Integer id) {
        programRepo.deleteById(id);
    }

    // ==================== REGULATION OPERATIONS ====================

    public List<Regulation> getAllRegulations() {
        return regulationRepo.findAll();
    }

    public Regulation getRegulationById(Integer id) {
        return regulationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Regulation", "id", id));
    }

    public List<Regulation> getActiveRegulations() {
        return regulationRepo.findByIsActive(true);
    }

    public Regulation createRegulation(Regulation regulation) {
        if (regulationRepo.existsByRegulationCode(regulation.getRegulationCode())) {
            throw new BusinessException("DUPLICATE_CODE",
                    "Regulation with code " + regulation.getRegulationCode() + " already exists");
        }
        return regulationRepo.save(regulation);
    }

    public Regulation updateRegulation(Integer id, Regulation regulation) {
        getRegulationById(id);
        regulation.setRegulationId(id);
        return regulationRepo.save(regulation);
    }

    public void deleteRegulation(Integer id) {
        regulationRepo.deleteById(id);
    }

    // ==================== SEMESTER OPERATIONS ====================

    public List<Semester> getAllSemesters() {
        return semesterRepo.findAll();
    }

    public Semester getSemesterById(Integer id) {
        return semesterRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester", "id", id));
    }

    public Semester createSemester(Semester semester) {
        return semesterRepo.save(semester);
    }

    public Semester updateSemester(Integer id, Semester semester) {
        getSemesterById(id);
        semester.setSemesterId(id);
        return semesterRepo.save(semester);
    }

    public void deleteSemester(Integer id) {
        semesterRepo.deleteById(id);
    }

    // ==================== SECTION OPERATIONS ====================

    public List<Section> getAllSections() {
        return sectionRepo.findAll();
    }

    public Section getSectionById(Integer id) {
        return sectionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", id));
    }

    public Section createSection(Section section) {
        if (sectionRepo.existsBySectionName(section.getSectionName())) {
            throw new BusinessException("DUPLICATE_NAME",
                    "Section with name " + section.getSectionName() + " already exists");
        }
        return sectionRepo.save(section);
    }

    public Section updateSection(Integer id, Section section) {
        getSectionById(id);
        section.setSectionId(id);
        return sectionRepo.save(section);
    }

    public void deleteSection(Integer id) {
        sectionRepo.deleteById(id);
    }

    // ==================== BLOCK OPERATIONS ====================

    public List<Block> getAllBlocks() {
        return blockRepo.findAll();
    }

    public Block getBlockById(Integer id) {
        return blockRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Block", "id", id));
    }

    public List<Block> getBlocksByCollege(Integer collegeId) {
        return blockRepo.findByCollegeId(collegeId);
    }

    public Block createBlock(Block block) {
        return blockRepo.save(block);
    }

    public Block updateBlock(Integer id, Block block) {
        getBlockById(id);
        block.setBlockId(id);
        return blockRepo.save(block);
    }

    public void deleteBlock(Integer id) {
        blockRepo.deleteById(id);
    }

    // ==================== FLOOR OPERATIONS ====================

    public List<Floor> getAllFloors() {
        return floorRepo.findAll();
    }

    public Floor getFloorById(Integer id) {
        return floorRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor", "id", id));
    }

    public List<Floor> getFloorsByBlock(Integer blockId) {
        return floorRepo.findByBlockId(blockId);
    }

    public Floor createFloor(Floor floor) {
        return floorRepo.save(floor);
    }

    public Floor updateFloor(Integer id, Floor floor) {
        getFloorById(id);
        floor.setFloorId(id);
        return floorRepo.save(floor);
    }

    public void deleteFloor(Integer id) {
        floorRepo.deleteById(id);
    }

    // ==================== ROOM OPERATIONS ====================

    public List<Room> getAllRooms() {
        return roomRepo.findAll();
    }

    public Room getRoomById(Integer id) {
        return roomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    public List<Room> getRoomsByFloor(Integer floorId) {
        return roomRepo.findByFloorId(floorId);
    }

    public List<Room> getRoomsByType(Integer roomTypeId) {
        return roomRepo.findByRoomTypeId(roomTypeId);
    }

    public Room createRoom(Room room) {
        if (roomRepo.existsByRoomCode(room.getRoomCode())) {
            throw new BusinessException("DUPLICATE_CODE",
                    "Room with code " + room.getRoomCode() + " already exists");
        }
        return roomRepo.save(room);
    }

    public Room updateRoom(Integer id, Room room) {
        getRoomById(id);
        room.setRoomId(id);
        return roomRepo.save(room);
    }

    public void deleteRoom(Integer id) {
        roomRepo.deleteById(id);
    }

    // ==================== ROOM TYPE OPERATIONS ====================

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepo.findAll();
    }

    public RoomType getRoomTypeById(Integer id) {
        return roomTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType", "id", id));
    }

    public RoomType createRoomType(RoomType roomType) {
        if (roomTypeRepo.existsByRoomTypeName(roomType.getRoomTypeName())) {
            throw new BusinessException("DUPLICATE_NAME",
                    "Room type " + roomType.getRoomTypeName() + " already exists");
        }
        return roomTypeRepo.save(roomType);
    }

    public RoomType updateRoomType(Integer id, RoomType roomType) {
        getRoomTypeById(id);
        roomType.setRoomTypeId(id);
        return roomTypeRepo.save(roomType);
    }

    public void deleteRoomType(Integer id) {
        roomTypeRepo.deleteById(id);
    }

    // ==================== EXAM TYPE OPERATIONS ====================

    public List<ExamType> getAllExamTypes() {
        return examTypeRepo.findAll();
    }

    public ExamType getExamTypeById(Integer id) {
        return examTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamType", "id", id));
    }

    public ExamType createExamType(ExamType examType) {
        if (examTypeRepo.existsByExamTypeName(examType.getExamTypeName())) {
            throw new BusinessException("DUPLICATE_NAME",
                    "Exam type " + examType.getExamTypeName() + " already exists");
        }
        return examTypeRepo.save(examType);
    }

    public ExamType updateExamType(Integer id, ExamType examType) {
        getExamTypeById(id);
        examType.setExamTypeId(id);
        return examTypeRepo.save(examType);
    }

    public void deleteExamType(Integer id) {
        examTypeRepo.deleteById(id);
    }

    // ==================== STUDENT SEMESTER HISTORY OPERATIONS ====================

    public List<StudentSemesterHistory> getAllHistory() {
        return historyRepo.findAll();
    }

    public StudentSemesterHistory getHistoryById(Integer id) {
        return historyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudentSemesterHistory", "id", id));
    }

    public List<StudentSemesterHistory> getHistoryByStudent(Integer studentId) {
        return historyRepo.findByStudentIdOrderBySemesterId(studentId);
    }

    public StudentSemesterHistory createHistory(StudentSemesterHistory history) {
        return historyRepo.save(history);
    }

    public StudentSemesterHistory updateHistory(Integer id, StudentSemesterHistory history) {
        getHistoryById(id);
        history.setHistoryId(id);
        return historyRepo.save(history);
    }

    public void deleteHistory(Integer id) {
        historyRepo.deleteById(id);
    }





    // ==================== COLLEGE OPERATIONS ====================

    public List<College> getAllColleges() {
        return collegeRepo.findAll();
    }

    public College getCollegeById(Integer id) {
        return collegeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", id));
    }

    public College createCollege(College college) {
        if (collegeRepo.existsByCollegeCode(college.getCollegeCode())) {
            throw new BusinessException("DUPLICATE_CODE",
                    "College with code " + college.getCollegeCode() + " already exists");
        }
        return collegeRepo.save(college);
    }

    public College updateCollege(Integer id, College college) {
        College existing = getCollegeById(id);
        college.setCollegeId(id);
        return collegeRepo.save(college);
    }

    public void deleteCollege(Integer id) {
        // Check if departments exist
        List<Department> depts = deptRepo.findByCollegeId(id);
        if (!depts.isEmpty()) {
            throw new BusinessException("DELETE_FORBIDDEN",
                    "Cannot delete college: " + depts.size() + " department(s) exist");
        }
        collegeRepo.deleteById(id);
    }

    // ==================== DEPARTMENT OPERATIONS ====================

    public List<Department> getAllDepartments() {
        return deptRepo.findAll();
    }

    public Department getDepartmentById(Integer id) {
        return deptRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
    }

    public Department createDepartment(Department dept) {
        if (deptRepo.existsByDeptCode(dept.getDeptCode())) {
            throw new BusinessException("DUPLICATE_CODE",
                    "Department with code " + dept.getDeptCode() + " already exists");
        }
        return deptRepo.save(dept);
    }

    public Department updateDepartment(Integer id, Department dept) {
        getDepartmentById(id); // Validate exists
        dept.setDeptId(id);
        return deptRepo.save(dept);
    }

    public void deleteDepartment(Integer id) {
        // Check if students exist
        long studentCount = studentRepo.countByDeptId(id);
        if (studentCount > 0) {
            throw new BusinessException("DELETE_FORBIDDEN",
                    "Cannot delete department: " + studentCount + " student(s) enrolled");
        }

        // Check if staff exist
        List<Staff> staff = staffRepo.findByDeptId(id);
        if (!staff.isEmpty()) {
            throw new BusinessException("DELETE_FORBIDDEN",
                    "Cannot delete department: " + staff.size() + " staff member(s) assigned");
        }

        deptRepo.deleteById(id);
    }

    // ==================== STUDENT OPERATIONS ====================

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }

    public List<Student> getStudentsByDepartment(Integer deptId) {
        return studentRepo.findByDeptId(deptId);
    }

    public List<Student> getStudentsByBatch(Integer year) {
        return studentRepo.findByAdmissionYear(year);
    }

    public Student createStudent(Student student) {
        if (studentRepo.existsByRegisterNumber(student.getRegisterNumber())) {
            throw new BusinessException("DUPLICATE_REGISTER",
                    "Student with register number " + student.getRegisterNumber() + " already exists");
        }
        if (studentRepo.existsByBatchNumber(student.getBatchNumber())) {
            throw new BusinessException("DUPLICATE_BATCH",
                    "Student with batch number " + student.getBatchNumber() + " already exists");
        }
        return studentRepo.save(student);
    }

    public Student updateStudent(Integer id, Student student) {
        getStudentById(id); // Validate exists
        student.setStudentId(id);
        return studentRepo.save(student);
    }

    public void deleteStudent(Integer id) {
        // In a real system, we should soft delete to preserve history
        // For now, hard delete is allowed (admin has god mode)
        studentRepo.deleteById(id);
    }

    // ==================== STAFF OPERATIONS ====================

    public List<Staff> getAllStaff() {
        return staffRepo.findAll();
    }

    public Staff getStaffById(Integer id) {
        return staffRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
    }

    public Staff createStaff(Staff staff) {
        if (staffRepo.existsByEmployeeId(staff.getEmployeeId())) {
            throw new BusinessException("DUPLICATE_EMPLOYEE",
                    "Staff with employee ID " + staff.getEmployeeId() + " already exists");
        }
        return staffRepo.save(staff);
    }

    public Staff updateStaff(Integer id, Staff staff) {
        getStaffById(id);
        staff.setStaffId(id);
        return staffRepo.save(staff);
    }

    public void deleteStaff(Integer id) {
        staffRepo.deleteById(id);
    }

    // ==================== SUBJECT OPERATIONS ====================

    public List<Subject> getAllSubjects() {
        return subjectRepo.findAll();
    }

    public Subject getSubjectById(Integer id) {
        return subjectRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
    }

    public List<Subject> getSubjectsByDepartment(Integer deptId) {
        return subjectRepo.findByDeptId(deptId);
    }

    public Subject createSubject(Subject subject) {
        return subjectRepo.save(subject);
    }

    public Subject updateSubject(Integer id, Subject subject) {
        getSubjectById(id);
        subject.setSubjectId(id);
        return subjectRepo.save(subject);
    }

    public void deleteSubject(Integer id) {
        subjectRepo.deleteById(id);
    }

    // ==================== ACADEMIC SESSION OPERATIONS ====================

    public List<AcademicSession> getAllSessions() {
        return sessionRepo.findAll();
    }

    public AcademicSession getSessionById(Integer id) {
        return sessionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicSession", "id", id));
    }

    public AcademicSession createSession(AcademicSession session) {
        return sessionRepo.save(session);
    }

    public AcademicSession updateSession(Integer id, AcademicSession session) {
        getSessionById(id);
        session.setSessionId(id);
        return sessionRepo.save(session);
    }

    public AcademicSession lockSession(Integer id) {
        AcademicSession session = getSessionById(id);
        session.setIsLocked(true);
        return sessionRepo.save(session);
    }

    public AcademicSession unlockSession(Integer id) {
        AcademicSession session = getSessionById(id);
        session.setIsLocked(false);
        return sessionRepo.save(session);
    }

    // ==================== EXAM OPERATIONS ====================

    public List<Exam> getAllExams() {
        return examRepo.findAll();
    }

    public Exam getExamById(Integer id) {
        return examRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", id));
    }

    public Exam createExam(Exam exam) {
        return examRepo.save(exam);
    }

    public Exam updateExam(Integer id, Exam exam) {
        getExamById(id);
        exam.setExamId(id);
        return examRepo.save(exam);
    }

    public void deleteExam(Integer id) {
        examRepo.deleteById(id);
    }

    // ==================== ATTENDANCE OPERATIONS ====================

    public List<StudentSemesterAttendance> getAllAttendance() {
        return attendanceRepo.findAll();
    }

    public StudentSemesterAttendance getAttendanceById(Integer id) {
        return attendanceRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", "id", id));
    }

    public StudentSemesterAttendance createAttendance(StudentSemesterAttendance attendance) {
        return attendanceRepo.save(attendance);
    }

    public StudentSemesterAttendance updateAttendance(Integer id, StudentSemesterAttendance attendance) {
        getAttendanceById(id);
        attendance.setAttendanceId(id);
        return attendanceRepo.save(attendance);
    }

    public void deleteAttendance(Integer id) {
        attendanceRepo.deleteById(id);
    }

    // ==================== EXAM MARKS OPERATIONS ====================

    public List<StudentExamMark> getAllMarks() {
        return markRepo.findAll();
    }

    public StudentExamMark getMarkById(Integer id) {
        return markRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamMark", "id", id));
    }

    public StudentExamMark createMark(StudentExamMark mark) {
        return markRepo.save(mark);
    }

    public StudentExamMark updateMark(Integer id, StudentExamMark mark) {
        getMarkById(id);
        mark.setMarkId(id);
        return markRepo.save(mark);
    }

    public void deleteMark(Integer id) {
        markRepo.deleteById(id);
    }




    /**
     * Get all marks for a specific student
     */


    /**
     * Get all marks for a specific exam
     */
    /**
     * Get all marks for a specific exam
     */


    /**
     * Get marks by student and exam
     */

    /**
     * Bulk update marks for multiple students
     */













    /**
     * Get all marks for a specific student
     */
    public List<StudentExamMark> getMarksByStudent(Integer studentId) {
        return markRepo.findByStudentIdWithFullDetails(studentId);
    }

    /**
     * Get all marks for a specific exam
     */
    public List<StudentExamMark> getMarksByExam(Integer examId) {
        return markRepo.findByExamId(examId);
    }

    /**
     * Get marks by student and exam
     */
    public StudentExamMark getMarkByStudentAndExam(Integer studentId, Integer examId) {
        return markRepo.findByStudentIdAndExamId(studentId, examId)
                .orElse(null);
    }

    /**
     * Bulk update marks for multiple students
     */
    @Transactional
    public List<StudentExamMark> bulkUpdateMarks(List<StudentExamMark> marks) {
        List<StudentExamMark> saved = new ArrayList<>();

        for (StudentExamMark incoming : marks) {
            StudentExamMark entity;

            if (incoming.getMarkId() != null) {
                entity = markRepo.findById(incoming.getMarkId())
                        .orElse(new StudentExamMark());
            } else {
                entity = new StudentExamMark();
            }

            entity.setStudentId(incoming.getStudentId());
            entity.setExamId(incoming.getExamId());
            entity.setMarksObtained(incoming.getMarksObtained());
            entity.setIsAbsent(incoming.getIsAbsent());

            saved.add(markRepo.save(entity));
        }

        return saved;
    }
}