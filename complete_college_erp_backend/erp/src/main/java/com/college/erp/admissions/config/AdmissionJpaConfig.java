// ========================================================
// FILE 1: AdmissionsJpaConfig.java
// Package: com.college.erp.admissions.config
// ========================================================
package com.college.erp.admissions.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Wires admissions repositories to the admissions EntityManagerFactory and TransactionManager.
 * Must be separate from MultiDataSourceConfig to avoid circular bean references.
 */
@Configuration
@EnableJpaRepositories(
        basePackages = "com.college.erp.admissions.repository",
        entityManagerFactoryRef = "admissionsEntityManagerFactory",
        transactionManagerRef = "admissionsTransactionManager"
)
public class AdmissionJpaConfig {
    // No additional beans needed — MultiDataSourceConfig provides the EMF and TM.
}