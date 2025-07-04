// A05:2021 - Security Misconfiguration Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Initialize all interactive components
    initializeHeadersCheck();
    initializeFilesListing();
    initializeDefaultCredentials();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    
    // Track page visit
    trackPageVisit();
}

// Information Disclosure Demo
function initializeHeadersCheck() {
    const button = document.getElementById('checkHeadersBtn');
    const resultArea = document.getElementById('headersResult');
    
    button.addEventListener('click', async function() {
        try {
            resultArea.innerHTML = '<div class="loading">Checking response headers...</div>';
            
            // Make a request to get headers
            const response = await fetch('/health');
            const headers = {};
            
            // Extract all headers
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            
            // Format the response for display
            const formattedData = `
                <div class="success-result">
                    <h4>✅ Response Headers Retrieved!</h4>
                    <div class="headers-data">
                        <h5>Exposed Information:</h5>
                        <ul>
                            ${headers['x-powered-by'] ? `<li><strong>Server Technology:</strong> ${headers['x-powered-by']}</li>` : ''}
                            ${headers['x-server-version'] ? `<li><strong>Server Version:</strong> ${headers['x-server-version']}</li>` : ''}
                            ${headers['x-database-type'] ? `<li><strong>Database Type:</strong> ${headers['x-database-type']}</li>` : ''}
                            ${headers['content-type'] ? `<li><strong>Content Type:</strong> ${headers['content-type']}</li>` : ''}
                            ${headers['server'] ? `<li><strong>Server:</strong> ${headers['server']}</li>` : ''}
                        </ul>
                    </div>
                    <div class="vulnerability-note">
                        <p><strong>⚠️ Vulnerability:</strong> Server information is exposed in headers, helping attackers understand the technology stack!</p>
                    </div>
                </div>
            `;
            resultArea.innerHTML = formattedData;
            
            // Update progress
            updateProgress('headersProgress', 100);
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Directory Listing Demo
function initializeFilesListing() {
    const button = document.getElementById('listFilesBtn');
    const resultArea = document.getElementById('filesResult');
    
    button.addEventListener('click', async function() {
        try {
            resultArea.innerHTML = '<div class="loading">Listing files...</div>';
            
            const response = await fetch('/secret');
            const data = await response.json();
            
            if (response.ok) {
                const fileList = data.files.map(file => `
                    <tr>
                        <td>${file.name}</td>
                        <td>${file.path}</td>
                        <td>${file.size} bytes</td>
                        <td>${file.type}</td>
                        <td><a href="${file.path}" target="_blank">View</a></td>
                    </tr>
                `).join('');
                
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Secret Directory Listing Retrieved!</h4>
                        <div class="files-data">
                            <p><strong>Directory:</strong> ${data.directory}</p>
                            <p><strong>Total Files:</strong> ${data.total}</p>
                            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">File Name</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Path</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Size</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Type</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${fileList}
                                </tbody>
                            </table>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> ${data.vulnerability}</p>
                            <p><strong>Impact:</strong> Sensitive configuration files, API keys, and credentials are now exposed!</p>
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                updateProgress('filesProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
            }
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Default Credentials Demo
function initializeDefaultCredentials() {
    const form = document.getElementById('defaultCredsForm');
    const resultArea = document.getElementById('loginResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            resultArea.innerHTML = '<div class="loading">Attempting login...</div>';
            
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Login Successful!</h4>
                        <div class="login-data">
                            <p><strong>Username:</strong> ${username}</p>
                            <p><strong>Password:</strong> ${password}</p>
                            <p><strong>Session ID:</strong> ${data.sessionId}</p>
                            <p><strong>User Role:</strong> ${data.user.role}</p>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> Default credentials are working! This is a common misconfiguration.</p>
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                updateProgress('credsProgress', 100);
            } else {
                resultArea.innerHTML = `
                    <div class="error-result">
                        <h4>❌ Login Failed</h4>
                        <p>Try other common credentials:</p>
                        <ul>
                            <li>admin / password</li>
                            <li>admin / admin</li>
                            <li>root / root</li>
                            <li>user / password</li>
                        </ul>
                    </div>
                `;
            }
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
        
        const input = document.getElementById('exerciseInput').value.toLowerCase();
        
        // Check for correct answers
        const correctAnswers = [
            'express.js',
            'express',
            'node.js',
            'nodejs',
            'node'
        ];
        
        if (correctAnswers.includes(input)) {
            resultArea.innerHTML = `
                <div class="success-result">
                    <h4>🎉 Correct! You identified the server technology!</h4>
                    <p>Express.js is being used as the web framework. This information was exposed through the X-Powered-By header.</p>
                    <div class="achievement">
                        <i class="fas fa-trophy"></i>
                        <strong>Achievement Unlocked:</strong> Information Gatherer
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = `
                <div class="error-result">
                    <h4>❌ Not quite right...</h4>
                    <p>Try checking the response headers again to see what server technology is being used.</p>
                    <p><strong>Hint:</strong> Look for the X-Powered-By header in the response.</p>
                </div>
            `;
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    // Load saved progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('securityMisconfigProgress') || '{}');
    
    // Apply saved progress
    Object.keys(savedProgress).forEach(key => {
        updateProgress(key, savedProgress[key]);
    });
}

function updateProgress(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        
        // Save progress to localStorage
        const savedProgress = JSON.parse(localStorage.getItem('securityMisconfigProgress') || '{}');
        savedProgress[elementId] = percentage;
        localStorage.setItem('securityMisconfigProgress', JSON.stringify(savedProgress));
    }
}

// Analytics and Tracking
function trackPageVisit() {
    // Track that user visited this vulnerability page
    const visitedVulnerabilities = JSON.parse(localStorage.getItem('visitedVulnerabilities') || '[]');
    if (!visitedVulnerabilities.includes('A05-SecurityMisconfiguration')) {
        visitedVulnerabilities.push('A05-SecurityMisconfiguration');
        localStorage.setItem('visitedVulnerabilities', JSON.stringify(visitedVulnerabilities));
    }
    
    // Log for analytics
    console.log('User visited A05:2021 - Security Misconfiguration page');
}

// Utility Functions
function showLoading(element, message = 'Loading...') {
    element.innerHTML = `<div class="loading">${message}</div>`;
}

function showError(element, message) {
    element.innerHTML = `<div class="error-result">❌ Error: ${message}</div>`;
}

function showSuccess(element, message) {
    element.innerHTML = `<div class="success-result">✅ ${message}</div>`;
}

// Add CSS for additional elements
const additionalStyles = `
    .headers-data, .files-data, .login-data {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .headers-data ul {
        list-style: none;
        padding: 0;
    }
    
    .headers-data li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #dee2e6;
    }
    
    .headers-data li:last-child {
        border-bottom: none;
    }
    
    .files-data table {
        font-size: 0.9rem;
    }
    
    .files-data th, .files-data td {
        text-align: left;
        padding: 0.5rem;
        border: 1px solid #dee2e6;
    }
    
    .files-data a {
        color: #3498db;
        text-decoration: none;
    }
    
    .files-data a:hover {
        text-decoration: underline;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
