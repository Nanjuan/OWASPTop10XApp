// A07:2021 - Identification and Authentication Failures Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Initialize all interactive components
    initializeWeakPasswordDemo();
    initializeSessionManagementDemo();
    initializeCredentialStuffingDemo();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    
    // Track page visit
    trackPageVisit();
}

// Weak Password Demo
function initializeWeakPasswordDemo() {
    const form = document.getElementById('weakPasswordForm');
    const resultArea = document.getElementById('weakPasswordResult');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: Please enter both username and password</div>`;
            return;
        }
        
        try {
            resultArea.innerHTML = '<div class="loading">Testing credentials...</div>';
            
            // Call backend endpoint for weak authentication
            fetch('/api/auth/weak-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Authentication Successful!</h4>
                            <div class="exploit-data">
                                <p><strong>Username:</strong> ${username}</p>
                                <p><strong>Password:</strong> ${password}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                                <p><strong>Impact:</strong> Unauthorized access gained</p>
                                <p><strong>Timestamp:</strong> ${data.timestamp}</p>
                            </div>
                            <div class="vulnerability-note">
                                <p><strong>⚠️ Vulnerability:</strong> Application accepts weak, common passwords!</p>
                                <p><strong>Note:</strong> This demonstrates the risk of weak password policies.</p>
                            </div>
                        </div>
                    `;
                    updateProgress('passwordProgress', 100);
                } else {
                    resultArea.innerHTML = `
                        <div class="error-result">
                            <h4>❌ Authentication Failed</h4>
                            <p><strong>Username:</strong> ${username}</p>
                            <p><strong>Password:</strong> ${password}</p>
                            <p><strong>Status:</strong> ${data.message}</p>
                            <p><strong>Hint:</strong> ${data.hint}</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Session Management Demo
function initializeSessionManagementDemo() {
    const generateBtn = document.getElementById('generateSessionBtn');
    const predictBtn = document.getElementById('predictSessionBtn');
    const bruteForceBtn = document.getElementById('bruteForceBtn');
    const resultArea = document.getElementById('sessionResult');
    
    let sessionTokens = [];
    let sessionCounter = 0;
    
    // Generate predictable session tokens
    generateBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Generating session tokens...</div>';
            
            // Call backend endpoint to generate session tokens
            fetch('/api/auth/generate-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sessionTokens.push(data.sessionToken);
                    
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Session Token Generated</h4>
                            <div class="token-data">
                                <p><strong>Generated Token:</strong> <code>${data.sessionToken}</code></p>
                                <p><strong>Pattern:</strong> ${data.pattern}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                                <p><strong>Timestamp:</strong> ${data.timestamp}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('sessionProgress', 50);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Predict next session token
    predictBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Analyzing token patterns...</div>';
            
            setTimeout(() => {
                if (sessionTokens.length === 0) {
                    resultArea.innerHTML = `<div class="error-result">❌ No tokens generated yet. Generate some tokens first.</div>`;
                    return;
                }
                
                sessionCounter++;
                const predictedToken = `session_${sessionCounter}_${Date.now().toString(36)}`;
                
                resultArea.innerHTML = `
                    <div class="success-result">
                        <h4>✅ Token Pattern Analysis Complete</h4>
                        <div class="prediction-data">
                            <p><strong>Predicted Next Token:</strong> <code>${predictedToken}</code></p>
                            <p><strong>Pattern:</strong> session_[incremental_counter]_[timestamp]</p>
                            <p><strong>Vulnerability:</strong> Predictable token generation allows session hijacking</p>
                            <p><strong>Impact:</strong> Attackers can predict and hijack user sessions</p>
                        </div>
                    </div>
                `;
                updateProgress('sessionProgress', 75);
            }, 1500);
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Brute force session tokens
    bruteForceBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Attempting session brute force...</div>';
            
            setTimeout(() => {
                if (sessionTokens.length === 0) {
                    resultArea.innerHTML = `<div class="error-result">❌ No tokens to brute force. Generate some tokens first.</div>`;
                    return;
                }
                
                const attempts = Math.floor(Math.random() * 50) + 10;
                const successAttempt = Math.floor(Math.random() * attempts) + 1;
                const targetToken = sessionTokens[Math.floor(Math.random() * sessionTokens.length)];
                
                resultArea.innerHTML = `
                    <div class="success-result">
                        <h4>✅ Session Brute Force Successful!</h4>
                        <div class="brute-force-data">
                            <p><strong>Total Attempts:</strong> ${attempts}</p>
                            <p><strong>Successful Attempt:</strong> ${successAttempt}</p>
                            <p><strong>Hijacked Token:</strong> <code>${targetToken}</code></p>
                            <p><strong>Vulnerability:</strong> No rate limiting on session validation</p>
                            <p><strong>Impact:</strong> Session hijacking successful</p>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> Application allows unlimited session validation attempts!</p>
                        </div>
                    </div>
                `;
                updateProgress('sessionProgress', 100);
            }, 2000);
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Credential Stuffing Demo
function initializeCredentialStuffingDemo() {
    const loadDataBtn = document.getElementById('loadBreachDataBtn');
    const startStuffingBtn = document.getElementById('startStuffingBtn');
    const resultArea = document.getElementById('stuffingResult');
    
    let breachData = [];
    let isDataLoaded = false;
    
    // Load simulated breach data
    loadDataBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Loading breach data...</div>';
            
            // Call backend endpoint to get breach data
            fetch('/api/auth/breach-data')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    breachData = data.breachData;
                    isDataLoaded = true;
                    
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Breach Data Loaded</h4>
                            <div class="breach-data">
                                <p><strong>Total Records:</strong> ${data.totalRecords}</p>
                                <p><strong>Source:</strong> ${data.source}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                                <p><strong>Data Preview:</strong></p>
                                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                                    <thead>
                                        <tr style="background: #f8f9fa;">
                                            <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Email</th>
                                            <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${breachData.slice(0, 5).map(record => `
                                            <tr>
                                                <td style="padding: 0.5rem; border: 1px solid #dee2e6;">${record.email}</td>
                                                <td style="padding: 0.5rem; border: 1px solid #dee2e6;">${record.password}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                <p><strong>Note:</strong> This is simulated breach data for educational purposes.</p>
                                <p><strong>Timestamp:</strong> ${data.timestamp}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('stuffingProgress', 50);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Start credential stuffing attack
    startStuffingBtn.addEventListener('click', function() {
        try {
            if (!isDataLoaded) {
                resultArea.innerHTML = `<div class="error-result">❌ Please load breach data first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Starting credential stuffing attack...</div>';
            
            // Test each credential from breach data
            const testPromises = breachData.map((record, index) => {
                return fetch('/api/auth/credential-stuffing', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: record.email, password: record.password })
                })
                .then(response => response.json())
                .then(data => ({
                    ...data,
                    email: record.email,
                    password: record.password,
                    attempt: index + 1
                }));
            });
            
            Promise.all(testPromises)
            .then(results => {
                const successfulLogins = results.filter(result => result.success);
                const attempts = results.length;
                
                resultArea.innerHTML = `
                    <div class="success-result">
                        <h4>✅ Credential Stuffing Attack Complete</h4>
                        <div class="stuffing-data">
                            <p><strong>Total Attempts:</strong> ${attempts}</p>
                            <p><strong>Successful Logins:</strong> ${successfulLogins.length}</p>
                            <p><strong>Success Rate:</strong> ${((successfulLogins.length / attempts) * 100).toFixed(1)}%</p>
                            
                            ${successfulLogins.length > 0 ? `
                                <p><strong>Compromised Accounts:</strong></p>
                                <ul>
                                    ${successfulLogins.map(login => `
                                        <li><strong>${login.email}</strong> (Attempt #${login.attempt}) - ${login.vulnerability}</li>
                                    `).join('')}
                                </ul>
                            ` : '<p><strong>No successful logins found.</strong></p>'}
                            
                            <p><strong>Vulnerability:</strong> Users reusing passwords from other breaches</p>
                            <p><strong>Impact:</strong> Unauthorized access to multiple accounts</p>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> Application doesn't detect credential stuffing attacks!</p>
                        </div>
                    </div>
                `;
                updateProgress('stuffingProgress', 100);
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Code Tabs Functionality
function initializeCodeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Practice Exercise
function initializeExercise() {
    const form = document.getElementById('exerciseForm');
    const resultArea = document.getElementById('exerciseResult');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const answer = document.getElementById('exerciseInput').value.trim().toLowerCase();
        const correctAnswer = 'password';
        
        if (answer === correctAnswer) {
            resultArea.innerHTML = `
                <div class="success-result">
                    <h4>✅ Correct Answer!</h4>
                    <p>"password" is indeed the most common weak password used worldwide.</p>
                    <p><strong>Statistics:</strong> Used by millions of users</p>
                    <p><strong>Risk Level:</strong> Extremely High</p>
                    <p><strong>Recommendation:</strong> Always use strong, unique passwords</p>
                </div>
            `;
        } else {
            resultArea.innerHTML = `
                <div class="error-result">
                    <h4>❌ Incorrect Answer</h4>
                    <p>Try again! Hint: Think of the most basic, common password that people use.</p>
                    <p>Common answers: password, 123456, admin, qwerty</p>
                </div>
            `;
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    // Initialize progress bars
    updateProgress('passwordProgress', 0);
    updateProgress('sessionProgress', 0);
    updateProgress('stuffingProgress', 0);
}

function updateProgress(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.style.backgroundColor = percentage === 100 ? '#28a745' : '#007bff';
    }
}

// Analytics and Tracking
function trackPageVisit() {
    // Track page visit for analytics
    console.log('A07:2021 - Identification and Authentication Failures page visited');
    
    // You could send analytics data here
    // analytics.track('page_viewed', { page: 'A07-AuthenticationFailures' });
}

// Utility Functions
function setPassword(password) {
    document.getElementById('password').value = password;
}

function showLoading(element, message = 'Loading...') {
    element.innerHTML = `<div class="loading">${message}</div>`;
}

function showError(element, message) {
    element.innerHTML = `<div class="error-result">❌ Error: ${message}</div>`;
}

function showSuccess(element, message) {
    element.innerHTML = `<div class="success-result">✅ ${message}</div>`;
}
