package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtNotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE " +
            "(n.recipientType = 'STUDENT' AND n.recipientId = :studentId) OR " +
            "(n.recipientType = 'ALL_STUDENTS') OR " +
            "(n.recipientType = 'SECTION' AND n.recipientId = :sectionId) OR " +
            "(n.recipientType = 'SEMESTER' AND n.recipientId = :semesterId) " +
            "ORDER BY n.createdAt DESC")
    List<Notification> findStudentNotifications(Integer studentId, Integer sectionId, Integer semesterId);

    List<Notification> findBySenderIdOrderByCreatedAtDesc(Integer senderId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE " +
            "((n.recipientType = 'STUDENT' AND n.recipientId = :studentId) OR " +
            "(n.recipientType = 'ALL_STUDENTS') OR " +
            "(n.recipientType = 'SECTION' AND n.recipientId = :sectionId) OR " +
            "(n.recipientType = 'SEMESTER' AND n.recipientId = :semesterId)) " +
            "AND n.isRead = false")
    long countUnreadNotifications(Integer studentId, Integer sectionId, Integer semesterId);
}