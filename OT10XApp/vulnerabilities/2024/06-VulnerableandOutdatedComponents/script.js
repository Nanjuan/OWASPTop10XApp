// A06:2021 - Vulnerable and Outdated Components Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Initialize all interactive components
    initializeJQueryExploit();
    initializeDependencyScan();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    
    // Track page visit
    trackPageVisit();
}

// jQuery Vulnerability Demo
function initializeJQueryExploit() {
    const form = document.getElementById('jqueryExploitForm');
    const resultArea = document.getElementById('jqueryResult');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const payload = document.getElementById('xssPayload').value.trim();
        
        if (!payload) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: Please enter an XSS payload</div>`;
            return;
        }
        
        try {
            resultArea.innerHTML = '<div class="loading">Executing XSS payload via vulnerable jQuery...</div>';
            
            // Use vulnerable jQuery .html() method with user-provided payload
            $('#jqueryResult').html(`
                <div class="success-result">
                    <h4>✅ jQuery Vulnerability Exploited!</h4>
                    <div class="exploit-data">
                        <p><strong>Vulnerable Version:</strong> jQuery 1.7.2</p>
                        <p><strong>Vulnerability Type:</strong> XSS via .html() method</p>
                        <p><strong>Your Payload:</strong> <code>${payload.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></p>
                        <p><strong>Impact:</strong> Arbitrary JavaScript execution</p>
                    </div>
                    <div class="vulnerability-note">
                        <p><strong>⚠️ Vulnerability:</strong> Outdated jQuery version allows XSS attacks through unsafe DOM manipulation!</p>
                        <p><strong>Note:</strong> The payload was executed using jQuery's vulnerable .html() method.</p>
                    </div>
                </div>
                ${payload}
            `);
            
            // Update progress
            updateProgress('jqueryProgress', 100);
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}



// Dependency Scanning Demo
function initializeDependencyScan() {
    const button = document.getElementById('scanDepsBtn');
    const resultArea = document.getElementById('depsResult');
    
    button.addEventListener('click', async function() {
        try {
            resultArea.innerHTML = '<div class="loading">Scanning dependencies...</div>';
            
            const response = await fetch('/api/scan-dependencies');
            const data = await response.json();
            
            if (response.ok) {
                const vulnerablePackages = data.vulnerabilities.map(vuln => `
                    <tr>
                        <td>${vuln.package}</td>
                        <td>${vuln.version}</td>
                        <td>${vuln.severity}</td>
                        <td>${vuln.cve}</td>
                        <td>${vuln.description}</td>
                    </tr>
                `).join('');
                
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Dependency Scan Complete!</h4>
                        <div class="scan-data">
                            <p><strong>Total Dependencies:</strong> ${data.totalDependencies}</p>
                            <p><strong>Vulnerable Packages:</strong> ${data.vulnerabilities.length}</p>
                            <p><strong>Critical Vulnerabilities:</strong> ${data.criticalCount}</p>
                        </div>
                        <div class="vulnerabilities-table">
                            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Package</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Version</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Severity</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">CVE</th>
                                        <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${vulnerablePackages}
                                </tbody>
                            </table>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> Outdated dependencies contain known security vulnerabilities!</p>
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                updateProgress('depsProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
            }
        } catch (error) {
            resultArea.innerHTML = `
                <div class="success-result">
                    <h4>✅ Dependency Scan Simulation Complete!</h4>
                    <div class="scan-data">
                        <p><strong>Total Dependencies:</strong> 15</p>
                        <p><strong>Vulnerable Packages:</strong> 3</p>
                        <p><strong>Critical Vulnerabilities:</strong> 1</p>
                    </div>
                    <div class="vulnerabilities-table">
                        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Package</th>
                                    <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Version</th>
                                    <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Severity</th>
                                    <th style="padding: 0.5rem; border: 1px solid #dee2e6;">CVE</th>
                                    <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>express</td>
                                    <td>4.16.0</td>
                                    <td>High</td>
                                    <td>CVE-2022-24999</td>
                                    <td>Prototype pollution vulnerability</td>
                                </tr>
                                <tr>
                                    <td>lodash</td>
                                    <td>4.17.10</td>
                                    <td>Critical</td>
                                    <td>CVE-2021-23337</td>
                                    <td>Command injection vulnerability</td>
                                </tr>
                                <tr>
                                    <td>moment</td>
                                    <td>2.22.0</td>
                                    <td>Medium</td>
                                    <td>CVE-2022-24785</td>
                                    <td>Regular expression denial of service</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="vulnerability-note">
                        <p><strong>⚠️ Vulnerability:</strong> Outdated dependencies contain known security vulnerabilities!</p>
                    </div>
                </div>
            `;
            updateProgress('depsProgress', 100);
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
        const correctAnswer = 'cve-2011-4969';
        
        if (answer === correctAnswer) {
            resultArea.innerHTML = `
                <div class="success-result">
                    <h4>✅ Correct Answer!</h4>
                    <p>CVE-2011-4969 is a common XSS vulnerability in older jQuery versions.</p>
                    <p><strong>Impact:</strong> Cross-Site Scripting (XSS)</p>
                    <p><strong>Affected Versions:</strong> jQuery 1.6.4 and earlier</p>
                    <p><strong>CVSS Score:</strong> 4.3 (Medium)</p>
                </div>
            `;
        } else {
            resultArea.innerHTML = `
                <div class="error-result">
                    <h4>❌ Incorrect Answer</h4>
                    <p>Try again! Hint: Look for a common XSS vulnerability in older jQuery versions.</p>
                    <p>Common CVEs to consider: CVE-2011-4969, CVE-2010-5312, CVE-2012-6708</p>
                </div>
            `;
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    // Initialize progress bars
    updateProgress('jqueryProgress', 0);
    updateProgress('depsProgress', 0);
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
    console.log('A06:2021 - Vulnerable and Outdated Components page visited');
    
    // You could send analytics data here
    // analytics.track('page_viewed', { page: 'A06-VulnerableComponents' });
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

// Helper function to set payload in input field
function setPayload(payload) {
    document.getElementById('xssPayload').value = payload;
}
