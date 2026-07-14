package com.college.erp.admissions.service;

import com.college.erp.admissions.entity.*;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base.url:http://localhost:3000}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send correction request email to student
     */
    @Async
    public void sendCorrectionRequestEmail(StudentProfile profile) {
        try {
            String subject = "Correction Required - Application " + profile.getApplicationNumber();
            String body = buildCorrectionRequestBody(profile);
            sendEmail(profile.getUser().getEmail(), subject, body);
            log.info("Correction request email sent to {}", profile.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send correction request email", e);
            throw new RuntimeException("Failed to send correction request email: " + e.getMessage());
        }
    }

    /**
     * Send allocation email to student with accept/decline links
     */
    @Async
    public void sendAllocationEmail(AdmissionResult result) {
        try {
            String studentEmail = result.getStudentProfile().getUser().getEmail();
            String studentName = result.getStudentProfile().getUser().getFullName();
            String department = result.getAllocatedDepartment().getName();
            String deptCode = result.getAllocatedDepartment().getCode();
            String applicationNo = result.getStudentProfile().getApplicationNumber();

            String acceptUrl = baseUrl + "/offer/respond?token=" + result.getOfferResponseToken() + "&response=accept";
            String declineUrl = baseUrl + "/offer/respond?token=" + result.getOfferResponseToken() + "&response=decline";

            String subject = "🎉 Admission Offer - " + department;
            String body = buildAllocationEmailBody(
                    studentName, department, deptCode, applicationNo,
                    result.getCutoffScoreAtAllocation(), acceptUrl, declineUrl
            );

            sendEmail(studentEmail, subject, body);
            log.info("Allocation email sent to {}", studentEmail);
        } catch (Exception e) {
            log.error("Failed to send allocation email", e);
            throw new RuntimeException("Failed to send allocation email: " + e.getMessage());
        }
    }

    /**
     * Send waitlist notification to student
     */
    @Async
    public void sendWaitlistEmail(AdmissionResult result) {
        try {
            String studentEmail = result.getStudentProfile().getUser().getEmail();
            String studentName = result.getStudentProfile().getUser().getFullName();
            String applicationNo = result.getStudentProfile().getApplicationNumber();

            String subject = "📋 Admission Status - Waitlisted";
            String body = buildWaitlistEmailBody(studentName, applicationNo);

            sendEmail(studentEmail, subject, body);
            log.info("Waitlist email sent to {}", studentEmail);
        } catch (Exception e) {
            log.error("Failed to send waitlist email", e);
            throw new RuntimeException("Failed to send waitlist email: " + e.getMessage());
        }
    }

    /**
     * Send rejection email to student
     */
    @Async
    public void sendRejectionEmail(AdmissionResult result) {
        try {
            String studentEmail = result.getStudentProfile().getUser().getEmail();
            String studentName = result.getStudentProfile().getUser().getFullName();
            String applicationNo = result.getStudentProfile().getApplicationNumber();

            String subject = "Admission Status Update";
            String body = buildRejectionEmailBody(studentName, applicationNo,
                    result.getCutoffScoreAtAllocation());

            sendEmail(studentEmail, subject, body);
            log.info("Rejection email sent to {}", studentEmail);
        } catch (Exception e) {
            log.error("Failed to send rejection email", e);
            throw new RuntimeException("Failed to send rejection email: " + e.getMessage());
        }
    }

    /**
     * Send offer response confirmation email
     */
    @Async
    public void sendOfferResponseConfirmation(AdmissionResult result) {
        try {
            String studentEmail = result.getStudentProfile().getUser().getEmail();
            String studentName = result.getStudentProfile().getUser().getFullName();
            String department = result.getAllocatedDepartment() != null
                    ? result.getAllocatedDepartment().getName() : "";
            boolean accepted = result.getOfferStatus() == AdmissionResult.OfferStatus.ACCEPTED;

            String subject = accepted
                    ? "✅ Admission Confirmed - " + department
                    : "Offer Declined - Confirmation";

            String body = accepted
                    ? buildAcceptanceConfirmationBody(studentName, department)
                    : buildDeclineConfirmationBody(studentName);

            sendEmail(studentEmail, subject, body);
            log.info("Offer response confirmation sent to {}", studentEmail);
        } catch (Exception e) {
            log.error("Failed to send confirmation email", e);
            throw new RuntimeException("Failed to send confirmation email: " + e.getMessage());
        }
    }

    /**
     * Send HTML email
     */
    private void sendEmail(String to, String subject, String body) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        mailSender.send(message);
    }

    // ==================== EMAIL TEMPLATES ====================

    /**
     * Correction request email template
     */
    private String buildCorrectionRequestBody(StudentProfile profile) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #ef4444 0%%, #dc2626 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .warning { background: #fef2f2; padding: 20px; margin: 20px 0; 
                               border-left: 4px solid #ef4444; border-radius: 5px; }
                    .button { display: inline-block; padding: 12px 30px; margin: 10px 0; 
                             background: #ef4444; color: white; text-decoration: none; 
                             border-radius: 5px; font-weight: bold; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>⚠️ Correction Required</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <p>Your application <strong>%s</strong> has been reviewed by our verification team 
                        and requires corrections before it can be approved.</p>
                        
                        <div class="warning">
                            <h3 style="margin-top: 0; color: #dc2626;">Verification Remarks:</h3>
                            <p><strong>%s</strong></p>
                        </div>
                        
                        <h3>What You Need to Do:</h3>
                        <ol>
                            <li>Login to your account using the button below</li>
                            <li>Review the remarks carefully</li>
                            <li>Make the necessary corrections to your profile or documents</li>
                            <li>Re-submit your application for verification</li>
                        </ol>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s/login" class="button">Login to Edit Profile</a>
                        </div>
                        
                        <p><strong>Important:</strong> Your application will remain in "Correction Requested" 
                        status until you make the required changes and resubmit.</p>
                        
                        <p>If you have any questions, please contact our admissions office.</p>
                        
                        <p>Best regards,<br>
                        <strong>Admissions Office</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply to this message.</p>
                        <p>&copy; 2025 College ERP System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
                profile.getUser().getFullName(),
                profile.getApplicationNumber(),
                profile.getVerificationRemarks(),
                baseUrl
        );
    }

    /**
     * Allocation email template with professional design
     */
    private String buildAllocationEmailBody(String studentName, String department,
                                            String deptCode, String applicationNo,
                                            java.math.BigDecimal cutoffScore,
                                            String acceptUrl, String declineUrl) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .highlight { background: #fff; padding: 20px; margin: 20px 0; 
                                 border-left: 4px solid #667eea; border-radius: 5px; }
                    .button { display: inline-block; padding: 12px 30px; margin: 10px 5px; 
                             text-decoration: none; border-radius: 5px; font-weight: bold; }
                    .btn-accept { background: #10b981; color: white; }
                    .btn-decline { background: #ef4444; color: white; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    .warning { background: #fef3c7; padding: 15px; margin: 15px 0; 
                              border-radius: 5px; border-left: 4px solid #f59e0b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Congratulations!</h1>
                        <p>You have been offered admissions</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <div class="highlight">
                            <h2 style="margin-top: 0; color: #667eea;">Admission Offer Details</h2>
                            <p><strong>Application Number:</strong> %s</p>
                            <p><strong>Department Allocated:</strong> %s (%s)</p>
                            <p><strong>Cutoff Score:</strong> %.2f</p>
                            <p><strong>Status:</strong> <span style="color: #10b981;">Provisionally Allotted</span></p>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Action Required - Deadline: 7 Days</strong>
                            <p>You must respond to this offer within 7 days, otherwise it will be automatically declined 
                            and the seat will be offered to waitlisted candidates.</p>
                        </div>
                        
                        <h3>What's Next?</h3>
                        <ol>
                            <li>Click below to accept or decline this offer</li>
                            <li>If accepted, complete the enrollment process within the deadline</li>
                            <li>Pay the admissions fee to confirm your seat</li>
                            <li>Submit required original documents</li>
                        </ol>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" class="button btn-accept">✓ Accept Offer</a>
                            <a href="%s" class="button btn-decline">✗ Decline Offer</a>
                        </div>
                        
                        <p><strong>Important Notes:</strong></p>
                        <ul>
                            <li>This is a provisional offer subject to document verification</li>
                            <li>Acceptance of this offer is binding</li>
                            <li>Once declined, this decision cannot be reversed</li>
                            <li>Original documents must be submitted within 14 days of acceptance</li>
                        </ul>
                        
                        <p>For any queries, contact our admissions office.</p>
                        
                        <p>Best regards,<br>
                        <strong>Admissions Committee</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply to this message.</p>
                        <p>&copy; 2025 College ERP System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName, applicationNo, department, deptCode, cutoffScore, acceptUrl, declineUrl);
    }

    /**
     * Waitlist email template
     */
    private String buildWaitlistEmailBody(String studentName, String applicationNo) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #f59e0b 0%%, #d97706 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .highlight { background: #fef3c7; padding: 20px; margin: 20px 0; 
                                 border-left: 4px solid #f59e0b; border-radius: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 Admission Status Update</h1>
                        <p>You have been waitlisted</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <div class="highlight">
                            <h2 style="margin-top: 0; color: #d97706;">Waitlist Status</h2>
                            <p><strong>Application Number:</strong> %s</p>
                            <p><strong>Current Status:</strong> <span style="color: #d97706;">Waitlisted</span></p>
                        </div>
                        
                        <p>We regret to inform you that you have not been allocated a seat in the current admissions round. 
                        However, based on your academic performance, you have been placed on our <strong>waitlist</strong>.</p>
                        
                        <h3>What does this mean?</h3>
                        <ul>
                            <li>You are being considered for seats that may become available</li>
                            <li>If students decline their offers, seats will be reallocated to waitlisted candidates</li>
                            <li>Reallocation will be done in order of merit (based on cutoff scores)</li>
                            <li>You will be notified immediately if a seat becomes available</li>
                        </ul>
                        
                        <h3>What should you do?</h3>
                        <ul>
                            <li>Keep checking your registered email regularly</li>
                            <li>Be ready to respond quickly if you receive an offer</li>
                            <li>You may also explore other admissions options as a backup</li>
                        </ul>
                        
                        <p><strong>Timeline:</strong> The waitlist will remain active for 14 days from the date of initial allocation. 
                        After this period, if no seats become available, your application will be moved to "Not Allocated" status.</p>
                        
                        <p>We appreciate your interest in our institution and wish you the very best.</p>
                        
                        <p>Best regards,<br>
                        <strong>Admissions Committee</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply to this message.</p>
                        <p>&copy; 2025 College ERP System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName, applicationNo);
    }

    /**
     * Rejection email template
     */
    private String buildRejectionEmailBody(String studentName, String applicationNo,
                                           java.math.BigDecimal cutoffScore) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6b7280 0%%, #4b5563 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .highlight { background: #fff; padding: 20px; margin: 20px 0; 
                                 border-left: 4px solid #6b7280; border-radius: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Admission Status Update</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <div class="highlight">
                            <p><strong>Application Number:</strong> %s</p>
                            <p><strong>Cutoff Score:</strong> %.2f</p>
                            <p><strong>Status:</strong> Not Allocated</p>
                        </div>
                        
                        <p>Thank you for your interest in our institution. Unfortunately, we were unable to 
                        allocate you a seat in the current admissions cycle due to high competition and limited 
                        seat availability in your preferred departments.</p>
                        
                        <p><strong>Possible Reasons:</strong></p>
                        <ul>
                            <li>All seats in your preferred departments were filled by higher-ranked candidates</li>
                            <li>High cutoff requirements for available programs</li>
                        </ul>
                        
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>You may explore other institutions or programs</li>
                            <li>Consider applying in the next admissions cycle</li>
                            <li>Check if any spot admissions will be conducted</li>
                        </ul>
                        
                        <p>We encourage you to continue pursuing your educational goals and wish you success 
                        in your future endeavors.</p>
                        
                        <p>Best regards,<br>
                        <strong>Admissions Committee</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply to this message.</p>
                        <p>&copy; 2025 College ERP System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName, applicationNo, cutoffScore);
    }

    /**
     * Acceptance confirmation email template
     */
    private String buildAcceptanceConfirmationBody(String studentName, String department) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .success-box { background: #d1fae5; padding: 20px; margin: 20px 0; 
                                   border-left: 4px solid #10b981; border-radius: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Admission Confirmed!</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <div class="success-box">
                            <h2 style="margin-top: 0; color: #059669;">Your Seat is Confirmed</h2>
                            <p><strong>Department:</strong> %s</p>
                            <p><strong>Status:</strong> Admission Accepted</p>
                        </div>
                        
                        <p>Congratulations! You have successfully accepted the admissions offer. Your seat has been confirmed.</p>
                        
                        <h3>📋 Next Steps:</h3>
                        <ol>
                            <li><strong>Pay Admission Fee</strong> - Within 3 days (Details will be sent separately)</li>
                            <li><strong>Submit Original Documents</strong> - Within 14 days at the admissions office</li>
                            <li><strong>Complete Enrollment</strong> - Attend orientation program (Date TBA)</li>
                        </ol>
                        
                        <p><strong>⚠️ Important:</strong> Failure to complete the enrollment process within the 
                        deadline will result in cancellation of your admissions.</p>
                        
                        <p>Welcome to our institution! We look forward to seeing you soon.</p>
                        
                        <p>Best regards,<br>
                        <strong>Admissions Committee</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 College ERP System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName, department);
    }

    /**
     * Decline confirmation email template
     */
    private String buildDeclineConfirmationBody(String studentName) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6b7280 0%%, #4b5563 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: #e5e7eb; padding: 20px; margin: 20px 0; 
                                border-left: 4px solid #6b7280; border-radius: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Offer Declined</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <div class="info-box">
                            <p><strong>Status:</strong> Admission Offer Declined</p>
                        </div>
                        
                        <p>We have received your response declining the admissions offer. Your seat has been 
                        released and will be offered to other candidates.</p>
                        
                        <p><strong>Please Note:</strong></p>
                        <ul>
                            <li>This decision is final and cannot be reversed</li>
                            <li>The seat is no longer reserved for you</li>
                            <li>You may apply again in future admissions cycles</li>
                        </ul>
                        
                        <p>Thank you for considering our institution. We wish you all the best in your 
                        academic pursuits.</p>
                        
                        <p>Best regards,<br>
                        <strong>Admissions Committee</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 College ERP System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName);
    }
}