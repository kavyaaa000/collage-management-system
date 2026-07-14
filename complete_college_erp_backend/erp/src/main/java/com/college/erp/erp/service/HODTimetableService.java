package com.college.erp.erp.service;

import com.college.erp.erp.dto.*;
import com.college.erp.erp.entity.*;
import com.college.erp.erp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HODTimetableService {

    private final SubjectStaffConfigRepository configRepository;
    private final GeneratedTimetableRepository timetableRepository;
    private final TimetableSlotRepository slotRepository;
    private final SubjectOfferingRepository offeringRepository;
    private final SubjectRepository subjectRepository;
    private final StaffRepository staffRepository;
    private final ClassroomAssignmentRepository classroomRepository;
    private final ErpRoomRepository erpRoomRepository;

    @Value("${timetable.python.script.path}")
    private String pythonScriptPath;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${timetable.python.executable}")
    private String pythonExecutable;

    // ===== DASHBOARD STATISTICS =====

    @Transactional(readOnly = true)
    public HODDashboardStatsDTO getDashboardStats(Integer deptId, Integer sessionId) {
        log.info("Calculating dashboard stats for dept={}, session={}", deptId, sessionId);

        // Total staff in department
        List<Staff> allStaff = staffRepository.findByDeptIdAndStatus(deptId, "ACTIVE");

        // Get all offerings for this session and department
        List<SubjectOffering> offerings = offeringRepository.findBySessionIdAndDeptId(sessionId, deptId);

        // Count mapped subjects
        long mappedCount = offerings.stream()
                .filter(o -> configRepository.findByOfferingIdAndIsActiveTrue(o.getOfferingId()).size() > 0)
                .count();

        // Classroom assignments
        List<ClassroomAssignment> assignments = classroomRepository
                .findBySessionIdAndDeptIdAndIsActiveTrue(sessionId, deptId);

        // Total rooms
        List<Room> allRooms = erpRoomRepository.findAll();

        // Active timetables
        long activeTimetables = timetableRepository.findByDeptIdOrderByGenerationDateDesc(deptId)
                .stream()
                .filter(t -> "ACTIVE".equals(t.getStatus()))
                .count();

        // Average staff load
        double avgLoad = calculateAverageStaffLoad(deptId, sessionId);

        return HODDashboardStatsDTO.builder()
                .totalStaff(allStaff.size())
                .totalSubjects((int) offerings.size())
                .mappedSubjects((int) mappedCount)
                .unmappedSubjects((int) (offerings.size() - mappedCount))
                .totalClassrooms(allRooms.size())
                .assignedClassrooms(assignments.size())
                .activeTimetables((int) activeTimetables)
                .averageStaffLoad(avgLoad)
                .build();
    }

    // ===== SUBJECT-STAFF MAPPING =====

    @Transactional(readOnly = true)
    public List<SubjectOfferingDTO> getSubjectOfferingsWithMappings(Integer sessionId, Integer deptId) {
        log.info("Fetching subject offerings with mappings for session={}, dept={}", sessionId, deptId);

        List<SubjectOffering> offerings = offeringRepository.findBySessionIdAndDeptId(sessionId, deptId);
        List<SubjectOfferingDTO> result = new ArrayList<>();

        for (SubjectOffering offering : offerings) {
            Subject subject = subjectRepository.findById(offering.getSubjectId())
                    .orElse(null);

            if (subject == null) continue;

            // Get staff mappings
            List<SubjectStaffConfig> configs = configRepository
                    .findByOfferingIdAndIsActiveTrue(offering.getOfferingId());

            List<StaffMappingDTO> staffMappings = new ArrayList<>();
            for (SubjectStaffConfig config : configs) {
                Staff staff = staffRepository.findById(config.getStaffId()).orElse(null);
                if (staff != null) {
                    int currentLoad = calculateStaffCurrentLoad(staff.getStaffId(), sessionId);

                    staffMappings.add(StaffMappingDTO.builder()
                            .configId(config.getConfigId())  // ← IMPORTANT: Include configId
                            .staffId(staff.getStaffId())
                            .staffName(staff.getStaffName())
                            .employeeId(staff.getEmployeeId())
                            .maxHoursPerWeek(config.getMaxPeriodsPerSubjectPerWeek())
                            .currentLoad(currentLoad)
                            .build());
                }
            }

            String className = "SEM" + offering.getSemesterId() + "_SEC" + offering.getSectionId();

            result.add(SubjectOfferingDTO.builder()
                    .offeringId(offering.getOfferingId())
                    .subjectId(subject.getSubjectId())
                    .subjectCode(subject.getSubjectCode())
                    .subjectName(subject.getSubjectName())
                    .subjectType(subject.getSubjectType())
                    .semesterId(offering.getSemesterId())
                    .sectionId(offering.getSectionId())
                    .credits(subject.getCredits())
                    .className(className)
                    .isMapped(!staffMappings.isEmpty())
                    .staffMappings(staffMappings)
                    .build());
        }

        return result;
    }

    @Transactional
    public SubjectStaffConfigDTO saveSubjectStaffMapping(SubjectStaffConfigDTO dto) {
        log.info("Saving subject-staff mapping: offering={}, staff={}", dto.getOfferingId(), dto.getStaffId());

        // Validate offering exists
        SubjectOffering offering = offeringRepository.findById(dto.getOfferingId())
                .orElseThrow(() -> new RuntimeException("Subject offering not found"));

        // Validate staff exists
        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Check if mapping already exists
        Optional<SubjectStaffConfig> existing = configRepository
                .findByOfferingIdAndStaffIdAndIsActiveTrue(dto.getOfferingId(), dto.getStaffId());

        SubjectStaffConfig config;

        if (existing.isPresent()) {
            config = existing.get();
            config.setMaxHoursPerWeek(dto.getMaxHoursPerWeek());
            config.setMaxPeriodsPerSubjectPerWeek(dto.getMaxPeriodsPerSubjectPerWeek());
            config.setUpdatedAt(LocalDateTime.now());
        } else {
            config = SubjectStaffConfig.builder()
                    .offeringId(dto.getOfferingId())
                    .staffId(dto.getStaffId())
                    .maxHoursPerWeek(dto.getMaxHoursPerWeek())
                    .maxPeriodsPerSubjectPerWeek(dto.getMaxPeriodsPerSubjectPerWeek())
                    .isActive(true)
                    .createdBy(dto.getCreatedBy())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        }

        config = configRepository.save(config);

        return convertToDTO(config);
    }

    @Transactional
    public void deleteSubjectStaffMapping(Integer configId) {
        log.info("Deleting subject-staff mapping: {}", configId);

        SubjectStaffConfig config = configRepository.findById(configId)
                .orElseThrow(() -> new RuntimeException("Mapping not found"));

        config.setIsActive(false);
        config.setUpdatedAt(LocalDateTime.now());
        configRepository.save(config);
    }

    @Transactional(readOnly = true)
    public List<StaffWorkloadDTO> getStaffWorkload(Integer deptId, Integer sessionId) {
        log.info("Calculating staff workload for dept={}, session={}", deptId, sessionId);

        List<Staff> staffList = staffRepository.findByDeptIdAndStatus(deptId, "ACTIVE");
        List<StaffWorkloadDTO> result = new ArrayList<>();

        for (Staff staff : staffList) {
            List<SubjectAssignmentDTO> assignments = new ArrayList<>();
            int assignedHours = 0;

            // Get all active configs for this staff
            List<SubjectStaffConfig> configs = configRepository.findByStaffIdAndIsActiveTrue(staff.getStaffId());

            for (SubjectStaffConfig config : configs) {
                SubjectOffering offering = offeringRepository.findById(config.getOfferingId()).orElse(null);
                if (offering != null && offering.getSessionId().equals(sessionId)) {
                    Subject subject = subjectRepository.findById(offering.getSubjectId()).orElse(null);
                    if (subject == null) continue;

                    int hours = config.getMaxPeriodsPerSubjectPerWeek() != null
                            ? config.getMaxPeriodsPerSubjectPerWeek()
                            : (subject.getCredits() != null ? subject.getCredits() : 3);

                    assignedHours += hours;

                    String className = "SEM" + offering.getSemesterId() + "_SEC" + offering.getSectionId();

                    assignments.add(SubjectAssignmentDTO.builder()
                            .subjectId(subject.getSubjectId())
                            .subjectCode(subject.getSubjectCode())
                            .subjectName(subject.getSubjectName())
                            .className(className)
                            .hoursPerWeek(hours)
                            .build());
                }
            }

            int maxHours = staff.getMaxHoursWeek() != null ? staff.getMaxHoursWeek() : 24;
            double workloadPercentage = maxHours > 0 ? (assignedHours * 100.0 / maxHours) : 0;

            result.add(StaffWorkloadDTO.builder()
                    .staffId(staff.getStaffId())
                    .staffName(staff.getStaffName())
                    .employeeId(staff.getEmployeeId())
                    .assignedHours(assignedHours)
                    .maxHours(maxHours)
                    .workloadPercentage(workloadPercentage)
                    .subjects(assignments)
                    .build());
        }

        result.sort((a, b) -> Double.compare(b.getWorkloadPercentage(), a.getWorkloadPercentage()));

        return result;
    }

    @Transactional
    public void updateStaffMaxHours(Integer staffId, Integer maxHours) {
        log.info("Updating max hours for staff={} to {}", staffId, maxHours);

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        staff.setMaxHoursWeek(maxHours);
        staffRepository.save(staff);
    }

    // ===== TIMETABLE GENERATION =====

    @Transactional
    public TimetableGenerationResponse generateTimetable(TimetableGenerationRequest request) {
        log.info("Starting timetable generation for dept={}, session={}", request.getDeptId(), request.getSessionId());

        try {
            // Validate prerequisites
            String validationError = validatePrerequisites(request.getSessionId(), request.getDeptId());
            if (validationError != null) {
                return TimetableGenerationResponse.builder()
                        .status("ERROR")
                        .message(validationError)
                        .build();
            }

            // Execute Python solver
            TimetableGenerationResult result = executeDatabaseSolver(request);

            if (result.isSuccess()) {
                log.info("Timetable generated successfully: ID={}, Cost={}",
                        result.getTimetableId(), result.getSolverCost());

                return TimetableGenerationResponse.builder()
                        .timetableId(result.getTimetableId())
                        .status("SUCCESS")
                        .message("Timetable generated successfully")
                        .solverStatus(result.getSolverStatus())
                        .solverCost(result.getSolverCost())
                        .build();
            } else {
                throw new RuntimeException(result.getErrorMessage());
            }

        } catch (Exception e) {
            log.error("Error generating timetable", e);
            return TimetableGenerationResponse.builder()
                    .status("ERROR")
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    private String validatePrerequisites(Integer sessionId, Integer deptId) {
        // Check offerings
        List<SubjectOffering> offerings = offeringRepository.findBySessionIdAndDeptId(sessionId, deptId);
        if (offerings.isEmpty()) {
            return "No subject offerings found. Please add subjects first.";
        }

        // Check mappings
        long mappedCount = offerings.stream()
                .filter(o -> !configRepository.findByOfferingIdAndIsActiveTrue(o.getOfferingId()).isEmpty())
                .count();

        if (mappedCount == 0) {
            return "No subject-staff mappings found. Please map staff to subjects first.";
        }

        if (mappedCount < offerings.size()) {
            return String.format("Only %d of %d subjects are mapped. Please complete all mappings.",
                    mappedCount, offerings.size());
        }

        // Check staff
        List<Staff> activeStaff = staffRepository.findByDeptIdAndStatus(deptId, "ACTIVE");
        if (activeStaff.isEmpty()) {
            return "No active staff found. Please add staff members first.";
        }

        // Check rooms
        List<Room> rooms = erpRoomRepository.findAll();
        if (rooms.isEmpty()) {
            return "No rooms available. Please add rooms first.";
        }

        return null; // All validations passed
    }

    private TimetableGenerationResult executeDatabaseSolver(TimetableGenerationRequest request)
            throws IOException, InterruptedException {
        log.info("Executing Python solver...");

        // Parse database URL
        String dbHost = "localhost";
        int dbPort = 3306;
        String dbName = "college_erp";

        try {
            String url = dbUrl.replace("jdbc:mysql://", "");
            String[] parts = url.split("/");
            String[] hostPort = parts[0].split(":");
            dbHost = hostPort[0];
            if (hostPort.length > 1) {
                String portPart = hostPort[1].split("\\?")[0];
                dbPort = Integer.parseInt(portPart);
            }
            if (parts.length > 1) {
                dbName = parts[1].split("\\?")[0];
            }
        } catch (Exception e) {
            log.warn("Could not parse database URL, using defaults: {}", e.getMessage());
        }

        // Build Python command
        List<String> command = new ArrayList<>();
        command.add(pythonExecutable);
        // or "python3" on Linux/Mac
        command.add(pythonScriptPath);
        command.add("--dept_id");
        command.add(request.getDeptId().toString());
        command.add("--session_id");
        command.add(request.getSessionId().toString());
        command.add("--db_host");
        command.add(dbHost);
        command.add("--db_port");
        command.add(String.valueOf(dbPort));
        command.add("--db_name");
        command.add(dbName);
        command.add("--db_user");
        command.add(dbUser);
        command.add("--db_password");
        command.add(dbPassword);
        command.add("--time_limit");
        command.add("300");
        command.add("--output_dir");
        command.add("timetables");  // Output directory for Excel/PDF files

        log.info("Executing: python {} --dept_id {} --session_id {}",
                pythonScriptPath, request.getDeptId(), request.getSessionId());

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);

        Process process = pb.start();

        // Capture output
        StringBuilder output = new StringBuilder();
        Integer timetableId = null;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.info("Python: {}", line);
                output.append(line).append("\n");

                // Parse timetable ID
                if (line.contains("Timetable ID:")) {
                    try {
                        String[] parts = line.split(":");
                        if (parts.length > 1) {
                            timetableId = Integer.parseInt(parts[1].trim());
                        }
                    } catch (NumberFormatException e) {
                        log.warn("Could not parse timetable ID from: {}", line);
                    }
                }
            }
        }

        int exitCode = process.waitFor();
        log.info("Python solver finished with exit code: {}", exitCode);

        if (exitCode == 0 && timetableId != null) {
            return parseSolverOutput(output.toString(), timetableId);
        } else {
            return TimetableGenerationResult.builder()
                    .success(false)
                    .errorMessage("Python solver failed with exit code: " + exitCode + "\n" + output.toString())
                    .build();
        }
    }
    private TimetableGenerationResult parseSolverOutput(String output, Integer timetableId) {
        Double solverCost = null;
        String solverStatus = "UNKNOWN";

        for (String line : output.split("\n")) {
            if (line.contains("Solver Cost:")) {
                try {
                    solverCost = Double.parseDouble(line.split(":")[1].trim());
                } catch (Exception e) {
                    log.warn("Could not parse solver cost from: {}", line);
                }
            } else if (line.contains("Status:")) {
                solverStatus = line.split(":")[1].trim();
            }
        }

        return TimetableGenerationResult.builder()
                .success(true)
                .timetableId(timetableId)
                .solverCost(solverCost != null ? solverCost : 0.0)
                .solverStatus(solverStatus)
                .build();
    }

    // ===== TIMETABLE RETRIEVAL =====

    @Transactional(readOnly = true)
    public List<TimetableViewDTO> getTimetables(Integer deptId, Integer sessionId) {
        log.info("Fetching timetables for dept={}, session={}", deptId, sessionId);

        List<GeneratedTimetable> timetables = sessionId != null
                ? timetableRepository.findBySessionIdAndDeptId(sessionId, deptId)
                : timetableRepository.findByDeptIdOrderByGenerationDateDesc(deptId);

        return timetables.stream()
                .map(this::convertToTimetableViewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TimetableViewDTO getTimetableById(Integer timetableId) {
        log.info("Fetching detailed timetable: {}", timetableId);

        GeneratedTimetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));

        List<TimetableSlot> slots = slotRepository.findByTimetableId(timetableId);

        return convertToDetailedTimetableViewDTO(timetable, slots);
    }

    @Transactional
    public void updateTimetableStatus(Integer timetableId, String status) {
        log.info("Updating timetable {} status to {}", timetableId, status);

        GeneratedTimetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));

        // If setting to ACTIVE, deactivate others
        if ("ACTIVE".equals(status)) {
            List<GeneratedTimetable> otherActive = timetableRepository
                    .findByDeptIdOrderByGenerationDateDesc(timetable.getDeptId())
                    .stream()
                    .filter(t -> "ACTIVE".equals(t.getStatus()) && !t.getTimetableId().equals(timetableId))
                    .collect(Collectors.toList());

            for (GeneratedTimetable other : otherActive) {
                other.setStatus("APPROVED");
                timetableRepository.save(other);
            }
        }

        timetable.setStatus(status);
        timetableRepository.save(timetable);
    }

    // ===== CLASSROOM ASSIGNMENT =====

    @Transactional(readOnly = true)
    public List<AvailableRoomDTO> getAvailableRooms(Integer deptId, String roomType) {
        log.info("Fetching available rooms for dept={}, type={}", deptId, roomType);

        List<Room> allRooms;
        if (roomType != null && !roomType.isEmpty()) {
            Integer typeId = "LAB".equalsIgnoreCase(roomType) ? 2 : 1;
            allRooms = erpRoomRepository.findByRoomTypeId(typeId);
        } else {
            allRooms = erpRoomRepository.findAll();
        }

        List<AvailableRoomDTO> result = new ArrayList<>();

        for (Room room : allRooms) {
            List<ClassroomAssignment> assignments = classroomRepository
                    .findByRoomIdAndIsActiveTrue(room.getRoomId());

            boolean isAvailable = assignments.isEmpty();

            result.add(AvailableRoomDTO.builder()
                    .roomId(room.getRoomId())
                    .roomCode(room.getRoomCode())
                    .roomType(room.getRoomTypeId() == 2 ? "LAB" : "CLASSROOM")
                    .capacity(room.getCapacity())
                    .blockName("")
                    .isAvailable(isAvailable)
                    .build());
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<ClassroomAssignmentDTO> getClassroomAssignments(Integer sessionId, Integer deptId) {
        List<ClassroomAssignment> assignments = classroomRepository
                .findBySessionIdAndDeptIdAndIsActiveTrue(sessionId, deptId);

        return assignments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClassroomAssignmentDTO assignClassroom(ClassroomAssignmentDTO dto) {
        log.info("Assigning classroom: room={}, semester={}, section={}",
                dto.getRoomId(), dto.getSemesterId(), dto.getSectionId());

        // Deactivate existing assignment
        Optional<ClassroomAssignment> existing = classroomRepository
                .findBySessionIdAndSemesterIdAndSectionIdAndIsActiveTrue(
                        dto.getSessionId(), dto.getSemesterId(), dto.getSectionId());

        existing.ifPresent(assignment -> {
            assignment.setIsActive(false);
            classroomRepository.save(assignment);
        });

        // Create new assignment
        ClassroomAssignment assignment = ClassroomAssignment.builder()
                .sessionId(dto.getSessionId())
                .semesterId(dto.getSemesterId())
                .sectionId(dto.getSectionId())
                .roomId(dto.getRoomId())
                .deptId(dto.getDeptId())
                .assignedBy(dto.getAssignedBy())
                .assignmentType(dto.getAssignmentType())
                .isActive(true)
                .assignedAt(LocalDateTime.now())
                .build();

        assignment = classroomRepository.save(assignment);
        return convertToDTO(assignment);
    }

    @Transactional
    public void deleteClassroomAssignment(Integer assignmentId) {
        log.info("Deleting classroom assignment: {}", assignmentId);

        ClassroomAssignment assignment = classroomRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setIsActive(false);
        classroomRepository.save(assignment);
    }

    // ===== HELPER METHODS =====

    private SubjectStaffConfigDTO convertToDTO(SubjectStaffConfig config) {
        return SubjectStaffConfigDTO.builder()
                .configId(config.getConfigId())
                .offeringId(config.getOfferingId())
                .staffId(config.getStaffId())
                .maxHoursPerWeek(config.getMaxHoursPerWeek())
                .maxPeriodsPerSubjectPerWeek(config.getMaxPeriodsPerSubjectPerWeek())
                .isActive(config.getIsActive())
                .createdBy(config.getCreatedBy())
                .build();
    }

    private ClassroomAssignmentDTO convertToDTO(ClassroomAssignment assignment) {
        Room room = erpRoomRepository.findById(assignment.getRoomId()).orElse(null);

        return ClassroomAssignmentDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .sessionId(assignment.getSessionId())
                .semesterId(assignment.getSemesterId())
                .sectionId(assignment.getSectionId())
                .roomId(assignment.getRoomId())
                .deptId(assignment.getDeptId())
                .assignedBy(assignment.getAssignedBy())
                .assignmentType(assignment.getAssignmentType())
                .isActive(assignment.getIsActive())
                .roomCode(room != null ? room.getRoomCode() : null)
                .roomName(room != null ? room.getRoomCode() : null)
                .capacity(room != null ? room.getCapacity() : null)
                .build();
    }

    private TimetableViewDTO convertToTimetableViewDTO(GeneratedTimetable tt) {
        return TimetableViewDTO.builder()
                .timetableId(tt.getTimetableId())
                .status(tt.getStatus())
                .generationDate(tt.getGenerationDate().toString())
                .generatedByName("HOD")
                .solverStatus(tt.getSolverStatus())
                .solverCost(tt.getSolverCost())
                .build();
    }

    private TimetableViewDTO convertToDetailedTimetableViewDTO(GeneratedTimetable tt, List<TimetableSlot> slots) {
        Map<String, List<TimetableSlot>> slotsByClass = slots.stream()
                .collect(Collectors.groupingBy(TimetableSlot::getClassId));

        List<ClassTimetableDTO> classTimetables = new ArrayList<>();

        for (Map.Entry<String, List<TimetableSlot>> entry : slotsByClass.entrySet()) {
            classTimetables.add(buildClassTimetable(entry.getKey(), entry.getValue()));
        }

        return TimetableViewDTO.builder()
                .timetableId(tt.getTimetableId())
                .status(tt.getStatus())
                .generationDate(tt.getGenerationDate().toString())
                .generatedByName("HOD")
                .solverStatus(tt.getSolverStatus())
                .solverCost(tt.getSolverCost())
                .classTimetables(classTimetables)
                .build();
    }

    private ClassTimetableDTO buildClassTimetable(String classId, List<TimetableSlot> slots) {
        List<List<TimetableSlotDTO>> schedule = new ArrayList<>();

        for (int day = 1; day <= 5; day++) {
            List<TimetableSlotDTO> daySlots = new ArrayList<>();
            final int d = day;

            for (int period = 1; period <= 8; period++) {
                final int p = period;

                TimetableSlot slot = slots.stream()
                        .filter(s -> s.getDayNumber() == d && s.getPeriodNumber() == p)
                        .findFirst()
                        .orElse(null);

                if (slot != null) {
                    daySlots.add(convertToSlotDTO(slot));
                } else {
                    daySlots.add(null);
                }
            }
            schedule.add(daySlots);
        }

        return ClassTimetableDTO.builder()
                .classId(classId)
                .className(classId)
                .schedule(schedule)
                .build();
    }

    private TimetableSlotDTO convertToSlotDTO(TimetableSlot slot) {
        // Extract numeric subject ID (handle "123_B1" format)
        Integer numericSubjectId = null;
        String subjectCode = null;
        String subjectName = null;

        if (slot.getSubjectId() != null) {
            try {
                // Remove batch suffix if present
                String idStr = slot.getSubjectId().split("_")[0];
                numericSubjectId = Integer.parseInt(idStr);

                // Fetch subject details
                Subject subject = subjectRepository.findById(numericSubjectId).orElse(null);
                if (subject != null) {
                    subjectCode = subject.getSubjectCode();
                    subjectName = subject.getSubjectName();
                }
            } catch (NumberFormatException e) {
                log.warn("Could not parse subject ID: {}", slot.getSubjectId());
            }
        }

        Staff staff = slot.getStaffId() != null ?
                staffRepository.findById(slot.getStaffId()).orElse(null) : null;
        Room room = slot.getRoomId() != null ?
                erpRoomRepository.findById(slot.getRoomId()).orElse(null) : null;

        return TimetableSlotDTO.builder()
                .slotId(slot.getSlotId())
                .classId(slot.getClassId())
                .dayNumber(slot.getDayNumber())
                .periodNumber(slot.getPeriodNumber())
                .subjectId(numericSubjectId)
                .staffId(slot.getStaffId())
                .roomId(slot.getRoomId())
                .isLab(slot.getIsLab())
                .labBatch(slot.getLabBatch())
                .subjectCode(subjectCode)
                .subjectName(subjectName)
                .staffName(staff != null ? staff.getStaffName() : null)
                .roomCode(room != null ? room.getRoomCode() : null)
                .build();
    }

    private double calculateAverageStaffLoad(Integer deptId, Integer sessionId) {
        List<Staff> staffList = staffRepository.findByDeptIdAndStatus(deptId, "ACTIVE");
        if (staffList.isEmpty()) return 0.0;

        double totalLoad = 0.0;

        for (Staff staff : staffList) {
            int assignedHours = calculateStaffCurrentLoad(staff.getStaffId(), sessionId);
            int maxHours = staff.getMaxHoursWeek() != null ? staff.getMaxHoursWeek() : 24;
            double loadPercentage = maxHours > 0 ? (assignedHours * 100.0 / maxHours) : 0;
            totalLoad += loadPercentage;
        }

        return totalLoad / staffList.size();
    }

    private int calculateStaffCurrentLoad(Integer staffId, Integer sessionId) {
        List<SubjectStaffConfig> configs = configRepository.findByStaffIdAndIsActiveTrue(staffId);

        int totalHours = 0;
        for (SubjectStaffConfig config : configs) {
            SubjectOffering offering = offeringRepository.findById(config.getOfferingId()).orElse(null);
            if (offering != null && offering.getSessionId().equals(sessionId)) {
                Integer hours = config.getMaxPeriodsPerSubjectPerWeek();
                if (hours == null) {
                    Subject subject = subjectRepository.findById(offering.getSubjectId()).orElse(null);
                    hours = subject != null && subject.getCredits() != null ? subject.getCredits() : 3;
                }
                totalHours += hours;
            }
        }

        return totalHours;
    }

    @Transactional(readOnly = true)
    public String getExcelPath(Integer timetableId) {
        GeneratedTimetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        return timetable.getExcelFilePath();
    }

    @Transactional(readOnly = true)
    public String getPDFPath(Integer timetableId) {
        GeneratedTimetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        return timetable.getPdfFilePath();
    }













    @Transactional(readOnly = true)
    public List<StaffDTO> getAvailableStaff(Integer deptId) {
        log.info("Fetching available staff for dept={}", deptId);

        List<Staff> staffList = staffRepository.findByDeptIdAndStatus(deptId, "ACTIVE");
        List<StaffDTO> result = new ArrayList<>();

        for (Staff staff : staffList) {
            // Calculate current load
            int currentLoad = calculateStaffCurrentLoad(staff.getStaffId(), null);
            int maxHours = staff.getMaxHoursWeek() != null ? staff.getMaxHoursWeek() : 24;
            double workloadPercentage = maxHours > 0 ? (currentLoad * 100.0 / maxHours) : 0;

            result.add(StaffDTO.builder()
                    .staffId(staff.getStaffId())
                    .employeeId(staff.getEmployeeId())
                    .staffName(staff.getStaffName())
                    .designation(staff.getDesignation())

                    .maxHoursWeek(maxHours)
                    .currentLoad(currentLoad)
                    .workloadPercentage(workloadPercentage)
                    .status(staff.getStatus())
                    .build());
        }

        // Sort by workload percentage (ascending - less loaded staff first)
        result.sort((a, b) -> Double.compare(a.getWorkloadPercentage(), b.getWorkloadPercentage()));

        return result;
    }

    @Transactional(readOnly = true)
    public StaffDTO getStaffById(Integer staffId) {
        log.info("Fetching staff: {}", staffId);

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        int currentLoad = calculateStaffCurrentLoad(staffId, null);
        int maxHours = staff.getMaxHoursWeek() != null ? staff.getMaxHoursWeek() : 24;
        double workloadPercentage = maxHours > 0 ? (currentLoad * 100.0 / maxHours) : 0;

        return StaffDTO.builder()
                .staffId(staff.getStaffId())
                .employeeId(staff.getEmployeeId())
                .staffName(staff.getStaffName())
                .designation(staff.getDesignation())

                .maxHoursWeek(maxHours)
                .currentLoad(currentLoad)
                .workloadPercentage(workloadPercentage)
                .status(staff.getStatus())
                .build();
    }


}