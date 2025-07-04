FROM openjdk:8-jdk-alpine

# Install necessary packages
RUN apk add --no-cache curl maven

# Create app directory
WORKDIR /app

# Create a simple vulnerable Log4j application
RUN mkdir -p src/main/java/com/vulnerable/log4j && \
    mkdir -p src/main/resources

# Create pom.xml with vulnerable Log4j
RUN echo '<?xml version="1.0" encoding="UTF-8"?>' > pom.xml && \
    echo '<project xmlns="http://maven.apache.org/POM/4.0.0"' >> pom.xml && \
    echo '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' >> pom.xml && \
    echo '         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">' >> pom.xml && \
    echo '    <modelVersion>4.0.0</modelVersion>' >> pom.xml && \
    echo '    <groupId>com.vulnerable</groupId>' >> pom.xml && \
    echo '    <artifactId>log4j-vulnerable-app</artifactId>' >> pom.xml && \
    echo '    <version>1.0.0</version>' >> pom.xml && \
    echo '    <parent>' >> pom.xml && \
    echo '        <groupId>org.springframework.boot</groupId>' >> pom.xml && \
    echo '        <artifactId>spring-boot-starter-parent</artifactId>' >> pom.xml && \
    echo '        <version>2.5.0</version>' >> pom.xml && \
    echo '    </parent>' >> pom.xml && \
    echo '    <dependencies>' >> pom.xml && \
    echo '        <dependency>' >> pom.xml && \
    echo '            <groupId>org.springframework.boot</groupId>' >> pom.xml && \
    echo '            <artifactId>spring-boot-starter-web</artifactId>' >> pom.xml && \
    echo '        </dependency>' >> pom.xml && \
    echo '        <dependency>' >> pom.xml && \
    echo '            <groupId>org.apache.logging.log4j</groupId>' >> pom.xml && \
    echo '            <artifactId>log4j-core</artifactId>' >> pom.xml && \
    echo '            <version>2.14.1</version>' >> pom.xml && \
    echo '        </dependency>' >> pom.xml && \
    echo '    </dependencies>' >> pom.xml && \
    echo '    <build>' >> pom.xml && \
    echo '        <plugins>' >> pom.xml && \
    echo '            <plugin>' >> pom.xml && \
    echo '                <groupId>org.springframework.boot</groupId>' >> pom.xml && \
    echo '                <artifactId>spring-boot-maven-plugin</artifactId>' >> pom.xml && \
    echo '            </plugin>' >> pom.xml && \
    echo '        </plugins>' >> pom.xml && \
    echo '    </build>' >> pom.xml && \
    echo '</project>' >> pom.xml

# Create vulnerable Java application
RUN echo 'package com.vulnerable.log4j;' > src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo 'import org.springframework.boot.SpringApplication;' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo 'import org.springframework.boot.autoconfigure.SpringBootApplication;' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo 'import org.springframework.web.bind.annotation.*;' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo 'import org.apache.logging.log4j.LogManager;' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo 'import org.apache.logging.log4j.Logger;' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '@SpringBootApplication' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '@RestController' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo 'public class Log4jVulnerableApp {' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    private static final Logger logger = LogManager.getLogger(Log4jVulnerableApp.class);' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    public static void main(String[] args) {' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '        SpringApplication.run(Log4jVulnerableApp.class, args);' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    }' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    @GetMapping("/")' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    public String home() {' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '        return "Log4j Vulnerable Application - Use /search?q=payload to test Log4Shell";' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    }' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    @GetMapping("/search")' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    public String search(@RequestParam String q) {' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '        // VULNERABLE: Logging user input without sanitization' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '        logger.info("Search query: " + q);' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '        return "Searching for: " + q;' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '    }' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java && \
    echo '}' >> src/main/java/com/vulnerable/log4j/Log4jVulnerableApp.java

# Create log4j2.xml configuration
RUN echo '<?xml version="1.0" encoding="UTF-8"?>' > src/main/resources/log4j2.xml && \
    echo '<Configuration status="WARN">' >> src/main/resources/log4j2.xml && \
    echo '    <Appenders>' >> src/main/resources/log4j2.xml && \
    echo '        <Console name="Console" target="SYSTEM_OUT">' >> src/main/resources/log4j2.xml && \
    echo '            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>' >> src/main/resources/log4j2.xml && \
    echo '        </Console>' >> src/main/resources/log4j2.xml && \
    echo '    </Appenders>' >> src/main/resources/log4j2.xml && \
    echo '    <Loggers>' >> src/main/resources/log4j2.xml && \
    echo '        <Root level="info">' >> src/main/resources/log4j2.xml && \
    echo '            <AppenderRef ref="Console"/>' >> src/main/resources/log4j2.xml && \
    echo '        </Root>' >> src/main/resources/log4j2.xml && \
    echo '    </Loggers>' >> src/main/resources/log4j2.xml && \
    echo '</Configuration>' >> src/main/resources/log4j2.xml

# Create flag file
RUN echo "FLAG{Log4Shell_Exploit_2024_7X9Y2Z}" > /app/flag.txt

# Build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the vulnerable application
CMD ["java", "-jar", "target/log4j-vulnerable-app-1.0.0.jar"] 