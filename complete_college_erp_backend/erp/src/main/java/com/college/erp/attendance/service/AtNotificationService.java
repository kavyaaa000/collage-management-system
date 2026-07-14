package com.college.erp.attendance.service;

import com.college.erp.attendance.dto.request.SendNotificationRequest;
import com.college.erp.attendance.dto.response.NotificationResponse;
import com.college.erp.attendance.entity.*;
import com.college.erp.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtNotificationService {

    private final AtNotificationRepository atNotificationRepository;
    private final AtStaffRepository atStaffRepository;
    private final AtStudentRepository atStudentRepository;
    private final AtSmartAlertRepository atSmartAlertRepository;

    @Transactional
    public void sendNotification(SendNotificationRequest request) {
        log.info("Sending notification from staff {} to {}", request.getSenderId(), request.getRecipientType());

        Notification notification = Notification.builder()
                .senderId(request.getSenderId())
                .senderType(Notification.SenderType.STAFF)
                .recipientType(Notification.RecipientType.valueOf(request.getRecipientType()))
                .recipientId(request.getRecipientId())
                .title(request.getTitle())
                .message(request.getMessage())
                .notificationType(request.getNotificationType() != null ?
                        Notification.NotificationType.valueOf(request.getNotificationType()) :
                        Notification.NotificationType.GENERAL)
                .priority(request.getPriority() != null ?
                        Notification.Priority.valueOf(request.getPriority()) :
                        Notification.Priority.MEDIUM)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        atNotificationRepository.save(notification);
        log.info("Notification sent successfully");
    }

    @Transactional
    public void sendAttendanceAlert(Integer staffId, Integer studentId, String subjectName, Double percentage) {
        String message = String.format(
                "Your attendance in %s is %.1f%%. This is below the required 75%%. " +
                        "Please improve your attendance to meet eligibility criteria.",
                subjectName, percentage
        );

        SendNotificationRequest request = new SendNotificationRequest();
        request.setSenderId(staffId);
        request.setRecipientType("STUDENT");
        request.setRecipientId(studentId);
        request.setTitle("Low Attendance Alert");
        request.setMessage(message);
        request.setNotificationType("ATTENDANCE_ALERT");
        request.setPriority(percentage < 65 ? "CRITICAL" : "HIGH");

        sendNotification(request);
    }

    @Transactional
    public void sendPerformanceAlert(Integer staffId, Integer studentId, String subjectName, Double average) {
        String message = String.format(
                "Your average marks in %s is %.1f%%. This is below the passing marks. " +
                        "Please schedule a meeting with the faculty for guidance.",
                subjectName, average
        );

        SendNotificationRequest request = new SendNotificationRequest();
        request.setSenderId(staffId);
        request.setRecipientType("STUDENT");
        request.setRecipientId(studentId);
        request.setTitle("Performance Alert");
        request.setMessage(message);
        request.setNotificationType("PERFORMANCE_ALERT");
        request.setPriority("HIGH");

        sendNotification(request);
    }

    public List<NotificationResponse> getStudentNotifications(Integer studentId, Integer sectionId, Integer semesterId) {
        List<Notification> notifications = atNotificationRepository.findStudentNotifications(
                studentId, sectionId, semesterId);

        return notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Integer studentId, Integer sectionId, Integer semesterId) {
        return atNotificationRepository.countUnreadNotifications(studentId, sectionId, semesterId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = atNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        atNotificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        Staff sender = atStaffRepository.findById(notification.getSenderId()).orElse(null);

        return NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .senderName(sender != null ? sender.getStaffName() : "System")
                .title(notification.getTitle())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType().name())
                .priority(notification.getPriority().name())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }

    @Transactional
    public void processSmartAlerts() {
        log.info("Processing smart alerts...");

        List<SmartAlert> unnotifiedAlerts = atSmartAlertRepository.findByIsNotifiedFalseAndSeverity(
                SmartAlert.Severity.CRITICAL);

        for (SmartAlert alert : unnotifiedAlerts) {
            // Create notification for each critical alert
            SendNotificationRequest request = new SendNotificationRequest();
            request.setSenderId(1); // System/Admin
            request.setRecipientType("STUDENT");
            request.setRecipientId(alert.getStudentId());
            request.setTitle("Automated Alert: " + alert.getAlertType());
            request.setMessage(alert.getMessage());
            request.setNotificationType("URGENT");
            request.setPriority("CRITICAL");

            sendNotification(request);

            alert.setIsNotified(true);
            alert.setNotifiedAt(LocalDateTime.now());
            atSmartAlertRepository.save(alert);
        }

        log.info("Processed {} smart alerts", unnotifiedAlerts.size());
    }
}