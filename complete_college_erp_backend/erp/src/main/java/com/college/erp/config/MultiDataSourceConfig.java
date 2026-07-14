package com.college.erp.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

/**
 * Multi-DataSource Configuration
 * Configures separate databases for each module:
 * 1. Primary (ERP) - college_db
 * 2. Admissions - CollegeERPAdmissionFinal
 * 3. Evaluation - college_db_updated
 * 4. Connect - college_connect
 */
@Configuration
@EnableTransactionManagement





public class MultiDataSourceConfig {

    // =================================================================
    // PRIMARY DATASOURCE (ERP Module) - college_db
    // =================================================================




    @Primary
    @Bean(name = "primaryDataSourceProperties")
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties primaryDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean(name = "primaryDataSource")
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource primaryDataSource(
            @Qualifier("primaryDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Primary
    @Bean(name = "primaryEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("primaryDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "none");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.format_sql", true);

        return builder
                .dataSource(dataSource)
                .packages("com.college.erp.erp.entity") // ERP Module entities
                .persistenceUnit("primary")
                .properties(properties)
                .build();
    }

    @Primary
    @Bean(name = "primaryTransactionManager")
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryEntityManagerFactory") LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory) {
        return new JpaTransactionManager(primaryEntityManagerFactory.getObject());
    }

    // =================================================================
    // ADMISSIONS DATASOURCE - CollegeERPAdmissionFinal
    // =================================================================

    @Bean(name = "admissionsDataSourceProperties")
    @ConfigurationProperties("datasources.admissions")
    public DataSourceProperties admissionsDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "admissionsDataSource")
    public DataSource admissionsDataSource(
            @Qualifier("admissionsDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "admissionsEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean admissionsEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("admissionsDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update"); // Auto-create tables
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.format_sql", true);

        return builder
                .dataSource(dataSource)
                .packages("com.college.erp.admissions.entity") // Admissions Module entities
                .persistenceUnit("admissions")
                .properties(properties)
                .build();
    }

    @Bean(name = "admissionsTransactionManager")
    public PlatformTransactionManager admissionsTransactionManager(
            @Qualifier("admissionsEntityManagerFactory") LocalContainerEntityManagerFactoryBean admissionsEntityManagerFactory) {
        return new JpaTransactionManager(admissionsEntityManagerFactory.getObject());
    }

    // =================================================================
    // EVALUATION DATASOURCE - college_db_updated
    // =================================================================

    @Bean(name = "evaluationDataSourceProperties")
    @ConfigurationProperties("datasources.evaluation")
    public DataSourceProperties evaluationDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "evaluationDataSource")
    public DataSource evaluationDataSource(
            @Qualifier("evaluationDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "evaluationEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean evaluationEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("evaluationDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "none");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.format_sql", true);

        return builder
                .dataSource(dataSource)
                .packages("com.college.erp.evaluation.entity") // Evaluation Module entities
                .persistenceUnit("evaluation")
                .properties(properties)
                .build();
    }

    @Bean(name = "evaluationTransactionManager")
    public PlatformTransactionManager evaluationTransactionManager(
            @Qualifier("evaluationEntityManagerFactory") LocalContainerEntityManagerFactoryBean evaluationEntityManagerFactory) {
        return new JpaTransactionManager(evaluationEntityManagerFactory.getObject());
    }

    // =================================================================
    // CONNECT DATASOURCE - college_connect
    // =================================================================

    @Bean(name = "connectDataSourceProperties")
    @ConfigurationProperties("datasources.connect")
    public DataSourceProperties connectDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "connectDataSource")
    public DataSource connectDataSource(
            @Qualifier("connectDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "connectEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean connectEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("connectDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.format_sql", true);

        return builder
                .dataSource(dataSource)
                .packages("com.college.erp.connect.entity") // Connect Module entities
                .persistenceUnit("connect")
                .properties(properties)
                .build();
    }

    @Bean(name = "connectTransactionManager")
    public PlatformTransactionManager connectTransactionManager(
            @Qualifier("connectEntityManagerFactory") LocalContainerEntityManagerFactoryBean connectEntityManagerFactory) {
        return new JpaTransactionManager(connectEntityManagerFactory.getObject());
    }












    // Add this section to MultiDataSourceConfig.java after the connect datasource

// =================================================================
// ATTENDANCE DATASOURCE - college_db (shares with ERP)
// =================================================================

    @Bean(name = "attendanceDataSourceProperties")
    @ConfigurationProperties("datasources.attendance")
    public DataSourceProperties attendanceDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "attendanceDataSource")
    public DataSource attendanceDataSource(
            @Qualifier("attendanceDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "attendanceEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean attendanceEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("attendanceDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "none");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.format_sql", true);

        return builder
                .dataSource(dataSource)
                .packages("com.college.erp.attendance.entity") // Attendance Module entities
                .persistenceUnit("attendance")
                .properties(properties)
                .build();
    }

    @Bean(name = "attendanceTransactionManager")
    public PlatformTransactionManager attendanceTransactionManager(
            @Qualifier("attendanceEntityManagerFactory") LocalContainerEntityManagerFactoryBean attendanceEntityManagerFactory) {
        return new JpaTransactionManager(attendanceEntityManagerFactory.getObject());
    }
}












//
//package com.college.erp.config;
//
//import com.zaxxer.hikari.HikariDataSource;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.orm.jpa.JpaTransactionManager;
//import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
//import org.springframework.transaction.PlatformTransactionManager;
//import org.springframework.transaction.annotation.EnableTransactionManagement;
//
//import javax.sql.DataSource;
//import java.util.HashMap;
//import java.util.Map;
//
///**
// * Multi-DataSource Configuration.
// * Each module gets its own EntityManagerFactory, TransactionManager, and DataSource.
// *
// * Scan packages:
// *  - primary      → com.college.erp.erp.entity         / com.college.erp.erp.repository
// *  - admissions   → com.college.erp.admissions.entity   / com.college.erp.admissions.repository
// *  - evaluation   → com.college.erp.evaluation.entity   / com.college.erp.evaluation.repository
// *  - connect      → com.college.erp.connect.entity      / com.college.erp.connect.repository
// *  - attendance   → com.college.erp.attendance.entity   / com.college.erp.attendance.repository
// */
//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.college.erp.erp.repository",
//        entityManagerFactoryRef = "primaryEntityManagerFactory",
//        transactionManagerRef = "primaryTransactionManager"
//)
//public class MultiDataSourceConfig {
//
//    // =================================================================
//    // PRIMARY (ERP Module) — college_db
//    // =================================================================
//
//    @Primary
//    @Bean(name = "primaryDataSourceProperties")
//    @ConfigurationProperties("spring.datasource")
//    public DataSourceProperties primaryDataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
//    @Primary
//    @Bean(name = "primaryDataSource")
//    @ConfigurationProperties("spring.datasource.hikari")
//    public DataSource primaryDataSource(
//            @Qualifier("primaryDataSourceProperties") DataSourceProperties properties) {
//        return properties.initializeDataSourceBuilder()
//                .type(HikariDataSource.class)
//                .build();
//    }
//
//    @Primary
//    @Bean(name = "primaryEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("primaryDataSource") DataSource dataSource) {
//
//        Map<String, Object> props = new HashMap<>();
//        props.put("hibernate.hbm2ddl.auto", "none");
//        props.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//
//        return builder
//                .dataSource(dataSource)
//                .packages("com.college.erp.erp.entity")
//                .persistenceUnit("primary")
//                .properties(props)
//                .build();
//    }
//
//    @Primary
//    @Bean(name = "primaryTransactionManager")
//    public PlatformTransactionManager primaryTransactionManager(
//            @Qualifier("primaryEntityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
//        return new JpaTransactionManager(factory.getObject());
//    }
//
//    // =================================================================
//    // ADMISSIONS — CollegeERPAdmissionFinal
//    // =================================================================
//
//    @Bean(name = "admissionsDataSourceProperties")
//    @ConfigurationProperties("datasources.admissions")
//    public DataSourceProperties admissionsDataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
//    @Bean(name = "admissionsDataSource")
//    public DataSource admissionsDataSource(
//            @Qualifier("admissionsDataSourceProperties") DataSourceProperties properties) {
//        return properties.initializeDataSourceBuilder()
//                .type(HikariDataSource.class)
//                .build();
//    }
//
//    @Bean(name = "admissionsEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean admissionsEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("admissionsDataSource") DataSource dataSource) {
//
//        Map<String, Object> props = new HashMap<>();
//        props.put("hibernate.hbm2ddl.auto", "update");  // auto-create admissions tables
//        props.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//
//        return builder
//                .dataSource(dataSource)
//                .packages("com.college.erp.admissions.entity")
//                .persistenceUnit("admissions")
//                .properties(props)
//                .build();
//    }
//
//    @Bean(name = "admissionsTransactionManager")
//    public PlatformTransactionManager admissionsTransactionManager(
//            @Qualifier("admissionsEntityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
//        return new JpaTransactionManager(factory.getObject());
//    }
//
//    // =================================================================
//    // AI EVALUATION — college_db_updated
//    // =================================================================
//
//    @Bean(name = "evaluationDataSourceProperties")
//    @ConfigurationProperties("datasources.evaluation")
//    public DataSourceProperties evaluationDataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
//    @Bean(name = "evaluationDataSource")
//    public DataSource evaluationDataSource(
//            @Qualifier("evaluationDataSourceProperties") DataSourceProperties properties) {
//        return properties.initializeDataSourceBuilder()
//                .type(HikariDataSource.class)
//                .build();
//    }
//
//    @Bean(name = "evaluationEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean evaluationEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("evaluationDataSource") DataSource dataSource) {
//
//        Map<String, Object> props = new HashMap<>();
//        props.put("hibernate.hbm2ddl.auto", "none");
//        props.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//
//        return builder
//                .dataSource(dataSource)
//                .packages("com.college.erp.evaluation.entity")
//                .persistenceUnit("evaluation")
//                .properties(props)
//                .build();
//    }
//
//    @Bean(name = "evaluationTransactionManager")
//    public PlatformTransactionManager evaluationTransactionManager(
//            @Qualifier("evaluationEntityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
//        return new JpaTransactionManager(factory.getObject());
//    }
//
//    // =================================================================
//    // COLLEGE CONNECT — college_connect
//    // =================================================================
//
//    @Bean(name = "connectDataSourceProperties")
//    @ConfigurationProperties("datasources.connect")
//    public DataSourceProperties connectDataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
//    @Bean(name = "connectDataSource")
//    public DataSource connectDataSource(
//            @Qualifier("connectDataSourceProperties") DataSourceProperties properties) {
//        return properties.initializeDataSourceBuilder()
//                .type(HikariDataSource.class)
//                .build();
//    }
//
//    @Bean(name = "connectEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean connectEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("connectDataSource") DataSource dataSource) {
//
//        Map<String, Object> props = new HashMap<>();
//        props.put("hibernate.hbm2ddl.auto", "update");
//        props.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//
//        return builder
//                .dataSource(dataSource)
//                .packages("com.college.erp.connect.entity")
//                .persistenceUnit("connect")
//                .properties(props)
//                .build();
//    }
//
//    @Bean(name = "connectTransactionManager")
//    public PlatformTransactionManager connectTransactionManager(
//            @Qualifier("connectEntityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
//        return new JpaTransactionManager(factory.getObject());
//    }
//
//    // =================================================================
//    // ATTENDANCE — shares college_db with ERP
//    // =================================================================
//
//    @Bean(name = "attendanceDataSourceProperties")
//    @ConfigurationProperties("datasources.attendance")
//    public DataSourceProperties attendanceDataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
//    @Bean(name = "attendanceDataSource")
//    public DataSource attendanceDataSource(
//            @Qualifier("attendanceDataSourceProperties") DataSourceProperties properties) {
//        return properties.initializeDataSourceBuilder()
//                .type(HikariDataSource.class)
//                .build();
//    }
//
//    @Bean(name = "attendanceEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean attendanceEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("attendanceDataSource") DataSource dataSource) {
//
//        Map<String, Object> props = new HashMap<>();
//        props.put("hibernate.hbm2ddl.auto", "none");
//        props.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//
//        return builder
//                .dataSource(dataSource)
//                .packages("com.college.erp.attendance.entity")
//                .persistenceUnit("attendance")
//                .properties(props)
//                .build();
//    }
//
//    @Bean(name = "attendanceTransactionManager")
//    public PlatformTransactionManager attendanceTransactionManager(
//            @Qualifier("attendanceEntityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
//        return new JpaTransactionManager(factory.getObject());
//    }
//}