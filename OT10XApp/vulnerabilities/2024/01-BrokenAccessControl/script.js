// A01:2021 - Broken Access Control Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Initialize all interactive components
    initializeIDORAttack();
    initializeOrderAccess();
    initializeFileAccess();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    
    // Track page visit
    trackPageVisit();
}

// IDOR Attack Demo
function initializeIDORAttack() {
    const form = document.getElementById('idorForm');
    const resultArea = document.getElementById('idorResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        
        try {
            // Show loading state
            resultArea.innerHTML = '<div class="loading">Accessing user profile...</div>';
            
            // Make API call to vulnerable endpoint
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            
            if (response.ok) {
                // Format the response for display
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ User Profile Accessed Successfully!</h4>
                        <div class="user-data">
                            <p><strong>ID:</strong> ${data.id}</p>
                            <p><strong>Username:</strong> ${data.username}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p><strong>Role:</strong> ${data.role}</p>
                            <p><strong>Created:</strong> ${data.created_at}</p>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> This demonstrates an IDOR attack. You can access any user's profile by changing the ID!</p>
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                // Update progress
                updateProgress('idorProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
            }
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Order Access Demo
function initializeOrderAccess() {
    const form = document.getElementById('orderForm');
    const resultArea = document.getElementById('orderResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('orderId').value;
        
        try {
            resultArea.innerHTML = '<div class="loading">Accessing order details...</div>';
            
            const response = await fetch(`/api/orders/${orderId}`);
            const data = await response.json();
            
            if (response.ok) {
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Order Details Accessed Successfully!</h4>
                        <div class="order-data">
                            <p><strong>Order ID:</strong> ${data.id}</p>
                            <p><strong>User:</strong> ${data.username}</p>
                            <p><strong>Product:</strong> ${data.product_name}</p>
                            <p><strong>Quantity:</strong> ${data.quantity}</p>
                            <p><strong>Total Price:</strong> $${data.total_price}</p>
                            <p><strong>Status:</strong> ${data.status}</p>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> You can access any user's order by changing the order ID!</p>
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                updateProgress('orderProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
            }
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// File Access Demo (Directory Traversal)
function initializeFileAccess() {
    const form = document.getElementById('fileForm');
    const resultArea = document.getElementById('fileResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const filePath = document.getElementById('filePath').value;
        
        // Check if user is attempting directory traversal
        const isTraversalAttempt = filePath.includes('../') || filePath.includes('..\\');
        
        try {
            resultArea.innerHTML = '<div class="loading">Accessing file...</div>';
            
            // Try to access the file through the files endpoint
            const response = await fetch(`/files/${filePath}`);
            
            if (response.ok) {
                const data = await response.text();
                
                let vulnerabilityNote = '';
                if (isTraversalAttempt) {
                    vulnerabilityNote = `
                        <div class="vulnerability-note">
                            <p><strong>🎯 Directory Traversal Successful!</strong></p>
                            <p>You successfully used path traversal sequences (../) to access files outside the intended directory.</p>
                            <p><strong>Attack Technique:</strong> ${filePath}</p>
                        </div>
                    `;
                } else {
                    vulnerabilityNote = `
                        <div class="vulnerability-note">
                            <p><strong>⚠️ File Access:</strong> You accessed a file within the intended directory.</p>
                            <p><strong>Try:</strong> Use path traversal sequences like "../../../etc/passwd" to access system files.</p>
                        </div>
                    `;
                }
                
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ File Accessed Successfully!</h4>
                        <div class="file-data">
                            <p><strong>File Path:</strong> ${filePath}</p>
                            <pre class="file-content">${data}</pre>
                        </div>
                        ${vulnerabilityNote}
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                // Only update progress if it's a successful traversal attempt
                if (isTraversalAttempt) {
                    updateProgress('fileProgress', 100);
                }
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                resultArea.innerHTML = `
                    <div class="error-result">
                        <h4>❌ File Access Failed</h4>
                        <p><strong>Error:</strong> ${errorData.error}</p>
                        <div class="hint-box">
                            <h5>💡 Directory Traversal Hints:</h5>
                            <ul>
                                <li>Try: <code>../../../etc/passwd</code> (Unix/Linux)</li>
                                <li>Try: <code>..\\..\\..\\windows\\system32\\drivers\\etc\\hosts</code> (Windows)</li>
                                <li>Try: <code>../../../package.json</code> (Docker Container)</li>
                                <li>Try: <code>../../../server/app.js</code> (Docker Source Code)</li>
                                <li>Try: <code>../../../../../../etc/hosts</code> (deep traversal)</li>
                                <li>Try: <code>....//....//....//etc/passwd</code> (encoded traversal)</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            resultArea.innerHTML = `
                <div class="error-result">
                    <h4>❌ Error: ${error.message}</h4>
                    <div class="hint-box">
                        <h5>💡 Directory Traversal Hints:</h5>
                        <ul>
                            <li>Try: <code>../../../etc/passwd</code> (Unix/Linux)</li>
                            <li>Try: <code>..\\..\\..\\windows\\system32\\drivers\\etc\\hosts</code> (Windows)</li>
                            <li>Try: <code>../../../package.json</code> (Docker Container)</li>
                            <li>Try: <code>../../../server/app.js</code> (Docker Source Code)</li>
                            <li>Try: <code>../../../../../../etc/hosts</code> (deep traversal)</li>
                            <li>Try: <code>....//....//....//etc/passwd</code> (encoded traversal)</li>
                        </ul>
                    </div>
                </div>
            `;
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
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const input = document.getElementById('exerciseInput').value.trim();
        
        // Check if user is trying to access the admin panel file
        if (input.toLowerCase() === 'admin_panel.txt') {
            try {
                // Try to access the admin panel file
                const response = await fetch(`/files/${input}`);
                
                if (response.ok) {
                    const data = await response.text();
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>🎉 Congratulations! You found the hidden admin panel!</h4>
                            <p>You successfully used directory traversal to discover the hidden admin file!</p>
                            <div class="admin-panel-content">
                                <h5>Hidden Admin Panel Content:</h5>
                                <pre class="file-content">${data}</pre>
                            </div>
                            <div class="achievement">
                                <i class="fas fa-trophy"></i>
                                <strong>Achievement Unlocked:</strong> Directory Traversal Master
                            </div>
                        </div>
                    `;
                } else {
                    resultArea.innerHTML = `
                        <div class="error-result">
                            <h4>❌ File not found</h4>
                            <p>The file "${input}" was not found. Try using directory traversal to access it.</p>
                            <div class="hint-box">
                                <h5>💡 Directory Traversal Hint:</h5>
                                <p>You need to use path traversal sequences to access the hidden file. Try:</p>
                                <ul>
                                    <li><code>../../../admin_panel.txt</code></li>
                                    <li><code>../../admin_panel.txt</code></li>
                                    <li><code>../admin_panel.txt</code></li>
                                </ul>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                resultArea.innerHTML = `
                    <div class="error-result">
                        <h4>❌ Error accessing file</h4>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
        } else if (input.includes('../') || input.includes('..\\')) {
            // User is trying directory traversal - let them test it
            try {
                const response = await fetch(`/files/${input}`);
                
                if (response.ok) {
                    const data = await response.text();
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Directory Traversal Successful!</h4>
                            <p>You successfully accessed a file using directory traversal!</p>
                            <div class="file-content">
                                <h5>File Content:</h5>
                                <pre>${data}</pre>
                            </div>
                            <div class="hint-box">
                                <h5>💡 Next Step:</h5>
                                <p>Great! You can access files outside the intended directory. Now try to find the hidden admin panel file.</p>
                                <p><strong>Hint:</strong> Look for a file with "admin" in the name.</p>
                            </div>
                        </div>
                    `;
                } else {
                    resultArea.innerHTML = `
                        <div class="error-result">
                            <h4>❌ File not found</h4>
                            <p>The path "${input}" was not found. Try a different traversal path.</p>
                        </div>
                    `;
                }
            } catch (error) {
                resultArea.innerHTML = `
                    <div class="error-result">
                        <h4>❌ Error</h4>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
        } else {
            resultArea.innerHTML = `
                <div class="error-result">
                    <h4>❌ Not quite right...</h4>
                    <p>You need to use directory traversal techniques to find the hidden admin panel.</p>
                    <div class="hint-box">
                        <h5>💡 Directory Traversal Challenge:</h5>
                        <ul>
                            <li>Use the file access form above to test directory traversal</li>
                            <li>Try accessing files with "admin" in the name</li>
                            <li>Use path traversal sequences like <code>../</code> or <code>../../</code></li>
                            <li>Once you find the admin file, enter its name here</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    // Load saved progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('brokenAccessProgress') || '{}');
    
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
        const savedProgress = JSON.parse(localStorage.getItem('brokenAccessProgress') || '{}');
        savedProgress[elementId] = percentage;
        localStorage.setItem('brokenAccessProgress', JSON.stringify(savedProgress));
    }
}

// Analytics and Tracking
function trackPageVisit() {
    // Track that user visited this vulnerability page
    const visitedVulnerabilities = JSON.parse(localStorage.getItem('visitedVulnerabilities') || '[]');
    if (!visitedVulnerabilities.includes('A01-BrokenAccessControl')) {
        visitedVulnerabilities.push('A01-BrokenAccessControl');
        localStorage.setItem('visitedVulnerabilities', JSON.stringify(visitedVulnerabilities));
    }
    
    // Log for analytics
    console.log('User visited A01:2021 - Broken Access Control page');
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

// Add some CSS for the new elements
const additionalStyles = `
    .learning-overview, .attack-scenarios, .prevention, .code-examples, .practice-exercise, .progress-tracking {
        margin-bottom: 3rem;
    }
    
    .overview-card, .scenario-card, .prevention-card, .exercise-card, .progress-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .scenario-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
    }
    
    .scenario-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .scenario-content h4 {
        color: #2c3e50;
        margin: 1rem 0 0.5rem 0;
    }
    
    .scenario-content ol, .scenario-content ul {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .interactive-demo {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        margin-top: 1rem;
    }
    
    .result-area {
        margin-top: 1rem;
        min-height: 100px;
    }
    
    .success-result {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
    }
    
    .error-result {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
    }
    
    .admin-panel-content {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .file-content {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        white-space: pre-wrap;
        overflow-x: auto;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .loading {
        text-align: center;
        color: #6c757d;
        font-style: italic;
    }
    
    .vulnerability-note {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }
    
    .prevention-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .code-tabs {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .tab-buttons {
        display: flex;
        background: #f8f9fa;
    }
    
    .tab-btn {
        flex: 1;
        padding: 1rem;
        border: none;
        background: transparent;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .tab-btn.active {
        background: #3498db;
        color: white;
    }
    
    .tab-content {
        padding: 2rem;
    }
    
    .tab-pane {
        display: none;
    }
    
    .tab-pane.active {
        display: block;
    }
    
    .progress-item {
        margin-bottom: 1rem;
    }
    
    .progress-item span {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    .progress-bar {
        background: #e9ecef;
        border-radius: 10px;
        height: 10px;
        overflow: hidden;
    }
    
    .progress-fill {
        background: linear-gradient(90deg, #2ecc71, #27ae60);
        height: 100%;
        transition: width 0.5s ease;
    }
    
    .achievement {
        background: #ffd700;
        color: #856404;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: bold;
    }
    
    .user-data, .order-data {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .file-content {
        background: #2c3e50;
        color: #ecf0f1;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }
    
    .traversal-examples {
        background: #e3f2fd;
        border: 1px solid #2196f3;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .traversal-examples h5 {
        color: #1976d2;
        margin-bottom: 0.5rem;
    }
    
    .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 0.5rem;
    }
    
    .example-item {
        background: #f5f5f5;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }
    
    .example-item code {
        display: block;
        background: #2c3e50;
        color: #ecf0f1;
        padding: 0.3rem;
        border-radius: 4px;
        margin-top: 0.2rem;
        font-size: 0.8rem;
        word-break: break-all;
    }
    
    .hint-box {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .hint-box h5 {
        color: #856404;
        margin-bottom: 0.5rem;
    }
    
    .hint-box ul {
        margin: 0;
        padding-left: 1.5rem;
    }
    
    .hint-box li {
        margin-bottom: 0.3rem;
    }
    
    .hint-box code {
        background: #f8f9fa;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .scenario-grid {
            grid-template-columns: 1fr;
        }
        
        .prevention-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

document.getElementById('bypassBtn').addEventListener('click', function() {
    const adminPanel = document.querySelector('.admin-panel');
    adminPanel.classList.remove('hidden');
    alert('Admin panel access granted (simulated unauthorized access).');
  });

  