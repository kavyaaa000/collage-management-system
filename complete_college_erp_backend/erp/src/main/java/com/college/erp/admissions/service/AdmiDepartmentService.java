package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.Department;
import com.college.erp.admissions.repository.AdmissionResultRepository;
import com.college.erp.admissions.repository.AdDepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmiDepartmentService {

    private final AdDepartmentRepository adDepartmentRepository;
    private final AdmissionResultRepository admissionResultRepository;

    public ApiResponse<List<DepartmentDTO>> getAllDepartments() {
        List<DepartmentDTO> departments = adDepartmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success("Departments retrieved", departments);
    }

    public ApiResponse<List<DepartmentDTO>> getAllActiveDepartments() {
        List<DepartmentDTO> departments = adDepartmentRepository.findAllActiveDepartments()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success("Active departments retrieved", departments);
    }

    public ApiResponse<DepartmentDTO> getDepartmentById(Long id) {
        return adDepartmentRepository.findById(id)
                .map(this::toDTO)
                .map(dto -> ApiResponse.success("Department retrieved", dto))
                .orElse(ApiResponse.error("Department not found"));
    }

    @Transactional
    public ApiResponse<DepartmentDTO> createDepartment(CreateDepartmentRequest request) {
        try {
            if (adDepartmentRepository.existsByCode(request.getCode())) {
                return ApiResponse.error("Department code already exists");
            }

            Department department = Department.builder()
                    .code(request.getCode())
                    .name(request.getName())
                    .totalSeats(request.getTotalSeats())
                    .availableSeats(request.getTotalSeats())
                    .isActive(true)
                    .build();

            department = adDepartmentRepository.save(department);
            return ApiResponse.success("Department created successfully", toDTO(department));

        } catch (Exception e) {
            return ApiResponse.error("Failed to create department: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<DepartmentDTO> updateDepartment(Long id, UpdateDepartmentRequest request) {
        try {
            Department department = adDepartmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            int oldTotalSeats = department.getTotalSeats();
            int newTotalSeats = request.getTotalSeats();

            // Calculate currently allocated seats
            int allocatedSeats = oldTotalSeats - department.getAvailableSeats();

            // Validate: Cannot reduce total seats below already allocated seats
            if (newTotalSeats < allocatedSeats) {
                return ApiResponse.error(
                        String.format("Cannot reduce seats to %d. Already allocated: %d seats",
                                newTotalSeats, allocatedSeats)
                );
            }

            // Update department details
            department.setName(request.getName());
            department.setTotalSeats(newTotalSeats);

            // Recalculate available seats: new total - already allocated
            department.setAvailableSeats(newTotalSeats - allocatedSeats);

            if (request.getIsActive() != null) {
                department.setIsActive(request.getIsActive());
            }

            department = adDepartmentRepository.save(department);
            return ApiResponse.success("Department updated successfully", toDTO(department));

        } catch (Exception e) {
            return ApiResponse.error("Failed to update department: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<Void> deleteDepartment(Long id) {
        try {
            Department department = adDepartmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            // Check if department has any allocations
            long allocationsCount = admissionResultRepository.countByAllocatedDepartmentId(id);
            if (allocationsCount > 0) {
                return ApiResponse.error(
                        "Cannot delete department with existing admissions. Please deactivate instead."
                );
            }

            // Check if department has preferences
            if (!department.getPreferences().isEmpty()) {
                return ApiResponse.error(
                        "Cannot delete department with student preferences. Please deactivate instead."
                );
            }

            adDepartmentRepository.delete(department);
            return ApiResponse.success("Department deleted successfully", null);

        } catch (Exception e) {
            return ApiResponse.error("Failed to delete department: " + e.getMessage());
        }
    }

    @Transactional
    public void resetAllSeats() {
        List<Department> departments = adDepartmentRepository.findAll();
        for (Department dept : departments) {
            dept.setAvailableSeats(dept.getTotalSeats());
        }
        adDepartmentRepository.saveAll(departments);
    }

    private DepartmentDTO toDTO(Department department) {
        return DepartmentDTO.builder()
                .id(department.getId())
                .code(department.getCode())
                .name(department.getName())
                .totalSeats(department.getTotalSeats())
                .availableSeats(department.getAvailableSeats())
                .isActive(department.getIsActive())
                .createdAt(department.getCreatedAt())
                .build();
    }
}