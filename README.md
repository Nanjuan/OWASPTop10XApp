# OWASP Top 10 2021 - Interactive Learning Platform

A comprehensive, interactive web application designed to teach and demonstrate the OWASP Top 10 2021 vulnerabilities through realistic scenarios, hands-on exercises, and progressive learning paths.

## 🎯 Overview

This platform provides an immersive learning experience for web application security professionals, developers, and security enthusiasts. Each vulnerability is presented with:

- **Detailed explanations** of the vulnerability and its impact
- **Multiple attack scenarios** with varying difficulty levels
- **Interactive demonstrations** that allow hands-on exploitation
- **Prevention strategies** and secure coding examples
- **Progress tracking** to monitor learning advancement
- **Real-world examples** that reflect actual security challenges

## 🏗️ Architecture

### Frontend
- **HTML5/CSS3/JavaScript** - Modern, responsive web interface
- **Progressive Web App** features for enhanced user experience
- **Interactive components** for hands-on learning
- **Progress tracking** with localStorage persistence

### Backend
- **Node.js/Express.js** - RESTful API server
- **SQLite Database** - In-memory database with realistic data
- **Intentionally Vulnerable Endpoints** - For educational demonstrations
- **Session Management** - Basic session handling (insecure for learning)

### Deployment
- **Docker** containerization for easy deployment
- **Docker Compose** for orchestration
- **Hot-reload** development environment

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- Docker (optional)
- Modern web browser

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd OWASPTop10XApp-1

# Install dependencies
cd OT10XApp
npm install

# Start the development server
npm run dev

# Access the application
open http://localhost:3000
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f deploy/docker-compose.yml up --build

# Access the application
open http://localhost:3000
```

## 📚 Learning Modules

### A01:2021 - Broken Access Control
**Difficulty: Beginner**

Learn how attackers bypass authorization mechanisms to access unauthorized resources.

**Attack Scenarios:**
- IDOR (Insecure Direct Object References) attacks
- Privilege escalation techniques
- Directory traversal attacks
- Missing authorization checks

**Interactive Features:**
- User profile access manipulation
- Order data exposure
- File system traversal
- Progress tracking and achievements

### A02:2021 - Cryptographic Failures
**Difficulty: Beginner**

Explore how weak cryptography leads to data exposure and system compromise.

**Attack Scenarios:**
- Plaintext password storage
- Weak encryption algorithms
- Key management failures
- Data at rest vulnerabilities

### A03:2021 - Injection
**Difficulty: Intermediate**

Master various injection attacks including SQL, NoSQL, LDAP, and command injection.

**Attack Scenarios:**
- SQL injection with database manipulation
- Command injection for system access
- Cross-site scripting (XSS)
- NoSQL injection techniques

### A04:2021 - Insecure Design
**Difficulty: Intermediate**

Understand how design flaws create fundamental security weaknesses.

**Attack Scenarios:**
- Business logic vulnerabilities
- Architecture flaws
- Design pattern weaknesses
- Client-side security bypasses

### A05:2021 - Security Misconfiguration
**Difficulty: Beginner**

Learn about common configuration mistakes that expose applications to attacks.

**Attack Scenarios:**
- Default configuration exploitation
- Server information disclosure
- Directory listing vulnerabilities
- Cloud security misconfigurations

### A06:2021 - Vulnerable and Outdated Components
**Difficulty: Intermediate**

Explore the risks of using outdated libraries and components with known vulnerabilities.

**Attack Scenarios:**
- CVE exploitation
- Dependency vulnerabilities
- Version control issues
- Supply chain attacks

### A07:2021 - Identification and Authentication Failures
**Difficulty: Beginner**

Understand weak authentication mechanisms and session management flaws.

**Attack Scenarios:**
- Weak password policies
- Session management vulnerabilities
- MFA bypass techniques
- Credential stuffing attacks

### A08:2021 - Software and Data Integrity Failures
**Difficulty: Advanced**

Learn about supply chain attacks and integrity verification failures.

**Attack Scenarios:**
- Supply chain compromises
- Integrity check bypasses
- CI/CD security failures
- Unverified software updates

### A09:2021 - Security Logging and Monitoring Failures
**Difficulty: Intermediate**

Explore how inadequate logging enables attackers to operate undetected.

**Attack Scenarios:**
- Log manipulation
- Monitoring bypasses
- Alert evasion
- Forensic challenges

### A10:2021 - Server-Side Request Forgery (SSRF)
**Difficulty: Advanced**

Master SSRF attacks that force servers to make unauthorized requests.

**Attack Scenarios:**
- Internal network access
- Cloud metadata exploitation
- URL manipulation attacks
- Service enumeration

## 🔧 API Endpoints

### Vulnerable Endpoints (For Learning)

#### A01:2021 - Broken Access Control
- `GET /api/users/:id` - IDOR vulnerable user profile access
- `GET /api/orders/:id` - IDOR vulnerable order access
- `GET /files` - Directory listing vulnerability

#### A02:2021 - Cryptographic Failures
- `POST /api/register` - Plaintext password storage

#### A03:2021 - Injection
- `GET /search?query=` - SQL injection vulnerable search
- `POST /api/system/execute` - Command injection endpoint

#### A04:2021 - Insecure Design
- `POST /api/orders` - Client-controlled price manipulation

#### A05:2021 - Security Misconfiguration
- Headers expose server information
- Directory listing enabled

#### A06:2021 - Vulnerable Components
- `GET /api/legacy/process` - Simulated outdated component

#### A07:2021 - Authentication Failures
- `POST /login` - Weak authentication
- `GET /api/profile` - Insecure session validation

#### A08:2021 - Integrity Failures
- `GET /update` - Unverified software update

#### A09:2021 - Logging Failures
- `POST /api/action` - Inadequate logging

#### A10:2021 - SSRF
- `POST /proxy` - SSRF vulnerable proxy
- `POST /api/fetch-resource` - Resource fetching without validation

## 🎓 Learning Features

### Interactive Demonstrations
Each vulnerability includes hands-on exercises where users can:
- Execute actual attacks in a safe environment
- Observe the impact of security failures
- Practice exploitation techniques
- Learn prevention strategies

### Progress Tracking
- Individual progress for each vulnerability
- Achievement system for completed exercises
- Learning path recommendations
- Performance analytics

### Code Examples
- Vulnerable code demonstrations
- Secure implementation examples
- Side-by-side comparisons
- Best practice guidelines

### Realistic Scenarios
- E-commerce application context
- User management systems
- File handling operations
- API security challenges

## 🛡️ Security Considerations

### ⚠️ IMPORTANT WARNINGS

This application contains **intentionally vulnerable code** for educational purposes only. 

**NEVER deploy this application in production environments!**

### Safe Learning Environment
- All vulnerabilities are contained within the application
- No external systems are targeted
- All data is fictional and for demonstration only
- Network isolation recommended for production-like testing

### Responsible Disclosure
- Report any unintended vulnerabilities to maintainers
- Use only for authorized learning and testing
- Follow ethical hacking principles
- Respect system boundaries

## 🚀 Development

### Project Structure
```
OT10XApp/
├── index.html                 # Main landing page
├── package.json              # Node.js dependencies
├── scripts/
│   └── main.js              # Main JavaScript functionality
├── styles/
│   └── styles.css           # Global styles
├── server/
│   └── app.js               # Express.js server
├── files/                   # Files for access control testing
│   ├── public_info.txt
│   └── secret.txt
└── vulnerabilities/         # Individual vulnerability modules
    └── 2024/
        ├── 01-BrokenAccessControl/
        ├── 02-CryptographicFailures/
        ├── 03-Injection/
        └── ...
```

### Adding New Vulnerabilities
1. Create a new directory in `vulnerabilities/2024/`
2. Add `index.html`, `script.js`, and `styles.css`
3. Update the main `index.html` with the new vulnerability card
4. Add corresponding backend endpoints in `server/app.js`
5. Update this README with new vulnerability details

### Contributing
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📖 Educational Resources

### Recommended Reading
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Additional Learning
- Web Application Security Fundamentals
- Secure Coding Practices
- Penetration Testing Methodologies
- Security Architecture Design

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the maintainers
- Join the OWASP community

## 🙏 Acknowledgments

- OWASP Foundation for the Top 10 framework
- Security researchers and contributors
- Open source community
- Educational institutions using this platform

---

**Remember: Security is everyone's responsibility. Learn, practice, and stay secure!** 🔒
