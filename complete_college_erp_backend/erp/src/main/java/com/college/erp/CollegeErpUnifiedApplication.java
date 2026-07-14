package com.college.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main Application Class for Unified College ERP System
 *
 * This application integrates the following modules:
 * 1. Main ERP Module (Admin, HOD, Staff, Student management)
 * 2. Admissions Module (Student admissions workflow)
 * 3. AI Evaluation Module (Answer sheet evaluation)
 * 4. College Connect Module (Contests, Store, Gamification)
 *
 * @author College ERP Team
 * @version 1.0.0
 */
//@SpringBootApplication(scanBasePackages = {
//        "com.college.erp",           // Main package
//        "com.college.erp.erp",       // ERP Module
//        "com.college.erp.admissions", // Admissions Module
//        "com.college.erp.evaluation", // AI Evaluation Module
//        "com.college.erp.connect"     // College Connect Module
//})
//@EnableJpaRepositories(basePackages = {
//        "com.college.erp.erp.repository",
//        "com.college.erp.admissions.repository",
//        "com.college.erp.evaluation.repository",
//        "com.college.erp.connect.repository"
//})
//@EntityScan(basePackages = {
//        "com.college.erp.erp.entity",
//        "com.college.erp.admissions.entity",
//        "com.college.erp.evaluation.entity",
//        "com.college.erp.connect.entity"
//})
//@EnableJpaAuditing
//@EnableTransactionManagement
//@EnableAspectJAutoProxy
//@EnableScheduling
//public class CollegeErpUnifiedApplication {
//
//    public static void main(String[] args) {
//        SpringApplication.run(CollegeErpUnifiedApplication.class, args);
//
//        System.out.println("=".repeat(80));
//        System.out.println("║" + " ".repeat(78) + "║");
//        System.out.println("║" + centerText("COLLEGE ERP - UNIFIED SYSTEM", 78) + "║");
//        System.out.println("║" + " ".repeat(78) + "║");
//        System.out.println("=".repeat(80));
//        System.out.println("║ Modules Loaded:                                                             ║");
//        System.out.println("║   ✓ Main ERP Module (Admin, HOD, Staff, Students)                          ║");
//        System.out.println("║   ✓ Admissions Module (Application Processing)                             ║");
//        System.out.println("║   ✓ AI Evaluation Module (Answer Sheet Evaluation)                         ║");
//        System.out.println("║   ✓ College Connect Module (Contests, Store, Gamification)                 ║");
//        System.out.println("=".repeat(80));
//        System.out.println("║ Server Information:                                                         ║");
//        System.out.println("║   • Port: 8080                                                              ║");
//        System.out.println("║   • Base URL: http://localhost:8080                                         ║");
//        System.out.println("║   • Health: http://localhost:8080/actuator/health                           ║");
//        System.out.println("=".repeat(80));
//        System.out.println("║ API Endpoints:                                                              ║");
//        System.out.println("║   • Main ERP:    /api/erp/**                                                ║");
//        System.out.println("║   • Admissions:  /api/admissions/**                                         ║");
//        System.out.println("║   • Evaluation:  /api/evaluation/**                                         ║");
//        System.out.println("║   • Connect:     /api/connect/**                                            ║");
//        System.out.println("║   • Auth:        /api/auth/**                                               ║");
//        System.out.println("=".repeat(80));
//        System.out.println();
//        System.out.println("🚀 Application Started Successfully!");
//        System.out.println();
//    }
//
//    private static String centerText(String text, int width) {
//        int padding = (width - text.length()) / 2;
//        return " ".repeat(padding) + text + " ".repeat(width - padding - text.length());
//    }
//}
@SpringBootApplication
@EnableJpaAuditing
@EnableTransactionManagement
@EnableAspectJAutoProxy
@EnableScheduling
public class CollegeErpUnifiedApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollegeErpUnifiedApplication.class, args);
    }
}