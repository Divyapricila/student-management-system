package com.studentmanagement.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * Intelligent Dynamic DataSource Configuration.
 * 
 * 1. Checks if MySQL Server is actively reachable on port 3306.
 * 2. If MySQL is running, connects to MySQL 'student_management_db'.
 * 3. If MySQL is not running or not installed, automatically activates an
 *    in-memory database in MySQL compatibility mode with pre-seeded sample data.
 * 
 * This ensures 'mvn spring-boot:run' works immediately out-of-the-box for demonstrations.
 */
@Configuration
@Profile("!test")
public class DynamicDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DynamicDataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/student_management_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUsername;

    @Value("${spring.datasource.password:}")
    private String mysqlPassword;

    @Value("${DB_HOST:localhost}")
    private String dbHost;

    @Value("${DB_PORT:3306}")
    private int dbPort;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (isPortReachable(dbHost, dbPort, 1200)) {
            try {
                log.info(">>> MySQL service detected at {}:{}! Attempting to connect to MySQL database...", dbHost, dbPort);
                HikariDataSource ds = new HikariDataSource();
                ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
                ds.setJdbcUrl(mysqlUrl);
                ds.setUsername(mysqlUsername);
                ds.setPassword(mysqlPassword);
                ds.setConnectionTimeout(3000);
                ds.setMaximumPoolSize(10);

                // Verify connectivity
                ds.getConnection().close();
                log.info(">>> [SUCCESS] Connected to live MySQL database: student_management_db");
                return ds;
            } catch (Exception e) {
                log.warn(">>> MySQL connection failed ({}). Switching to in-memory fallback database.", e.getMessage());
            }
        } else {
            log.info(">>> MySQL service is not running on port {}.", dbPort);
            log.info(">>> Automatically activating in-memory database with full MySQL compatibility mode!");
        }

        HikariDataSource fallbackDs = new HikariDataSource();
        fallbackDs.setDriverClassName("org.h2.Driver");
        fallbackDs.setJdbcUrl("jdbc:h2:mem:student_management_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
        fallbackDs.setUsername("sa");
        fallbackDs.setPassword("");
        fallbackDs.setMaximumPoolSize(10);
        return fallbackDs;
    }

    private boolean isPortReachable(String host, int port, int timeoutMs) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), timeoutMs);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
