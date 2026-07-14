package com.college.erp.attendance.controller;

import com.college.erp.attendance.dto.request.SendNotificationRequest;
import com.college.erp.attendance.dto.response.NotificationResponse;
import com.college.erp.attendance.service.AtNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("at/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notifications", description = "Notification management APIs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AtNotificationController {

    private final AtNotificationService atNotificationService;

    @PostMapping("/send")
    @Operation(summary = "Send notification", description = "Send notification to students")
    public ResponseEntity<Void> sendNotification(@Valid @RequestBody SendNotificationRequest request) {
        log.info("Send notification request from staff: {}", request.getSenderId());
        atNotificationService.sendNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student notifications", description = "Get all notifications for a student")
    public ResponseEntity<List<NotificationResponse>> getStudentNotifications(
            @PathVariable Integer studentId,
            @RequestParam Integer sectionId,
            @RequestParam Integer semesterId) {
        log.info("Fetching notifications for student: {}", studentId);
        List<NotificationResponse> notifications = atNotificationService.getStudentNotifications(
                studentId, sectionId, semesterId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/student/{studentId}/unread-count")
    @Operation(summary = "Get unread count", description = "Get unread notification count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable Integer studentId,
            @RequestParam Integer sectionId,
            @RequestParam Integer semesterId) {
        long count = atNotificationService.getUnreadCount(studentId, sectionId, semesterId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{notificationId}/mark-read")
    @Operation(summary = "Mark as read", description = "Mark notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        atNotificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/process-alerts")
    @Operation(summary = "Process smart alerts", description = "Process and send smart alerts")
    public ResponseEntity<Void> processSmartAlerts() {
        log.info("Processing smart alerts");
        atNotificationService.processSmartAlerts();
        return ResponseEntity.ok().build();
    }
}