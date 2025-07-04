// A10: Server-Side Request Forgery (SSRF) Interactive Demo
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab functionality
    initializeTabs();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize SSRF logging
    initializeSSRFLogging();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and target pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Form handlers
function initializeFormHandlers() {
    // Network scanning demo
    const networkScanForm = document.getElementById('networkScanForm');
    if (networkScanForm) {
        networkScanForm.addEventListener('submit', handleNetworkScan);
    }
    
    // Metadata access demo
    const metadataAccessForm = document.getElementById('metadataAccessForm');
    if (metadataAccessForm) {
        metadataAccessForm.addEventListener('submit', handleMetadataAccess);
    }
    
    // Internal service demo
    const internalServiceForm = document.getElementById('internalServiceForm');
    if (internalServiceForm) {
        internalServiceForm.addEventListener('submit', handleInternalService);
    }
}

// Network scanning demo handler
async function handleNetworkScan(e) {
    e.preventDefault();
    const url = document.getElementById('networkScanUrl').value;
    const resultDiv = document.getElementById('networkScanResult');
    
    if (!url) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a URL to scan</div>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Scanning network...</div>';
    
    try {
        const response = await fetch('/api/ssrf/network-scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h4>Network Scan Results:</h4>
                    <p><strong>URL:</strong> ${url}</p>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Response:</strong></p>
                    <pre>${data.response.substring(0, 500)}${data.response.length > 500 ? '...' : ''}</pre>
                    <div class="warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Vulnerability Detected:</strong> This demonstrates how SSRF can be used to scan internal networks!
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Scan Failed:</h4>
                    <p>${data.error}</p>
                </div>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error:</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Metadata access demo handler
async function handleMetadataAccess(e) {
    e.preventDefault();
    const endpoint = document.getElementById('metadataEndpoint').value;
    const resultDiv = document.getElementById('metadataAccessResult');
    
    resultDiv.innerHTML = '<div class="loading">Accessing metadata...</div>';
    
    try {
        const response = await fetch('/api/ssrf/metadata-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: endpoint })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h4>Metadata Access Results:</h4>
                    <p><strong>Endpoint:</strong> ${endpoint}</p>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Metadata:</strong></p>
                    <pre>${data.metadata.substring(0, 500)}${data.metadata.length > 500 ? '...' : ''}</pre>
                    <div class="warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Critical:</strong> This demonstrates access to cloud metadata services!
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Access Failed:</h4>
                    <p>${data.error}</p>
                </div>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error:</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Internal service demo handler
async function handleInternalService(e) {
    e.preventDefault();
    const url = document.getElementById('internalServiceUrl').value;
    const payload = document.getElementById('servicePayload').value;
    const resultDiv = document.getElementById('internalServiceResult');
    
    if (!url) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter an internal service URL</div>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Sending to internal service...</div>';
    
    try {
        const response = await fetch('/api/ssrf/internal-service', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                url: url, 
                payload: payload || 'Default payload' 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h4>Internal Service Interaction:</h4>
                    <p><strong>URL:</strong> ${url}</p>
                    <p><strong>Payload:</strong> ${payload || 'Default payload'}</p>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Response:</strong></p>
                    <pre>${data.response.substring(0, 500)}${data.response.length > 500 ? '...' : ''}</pre>
                    <div class="warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Dangerous:</strong> This demonstrates SSRF interaction with internal services!
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Interaction Failed:</h4>
                    <p>${data.error}</p>
                </div>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error:</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// URL validation test function
function testUrlValidation() {
    const testUrl = document.getElementById('testUrl').value;
    const resultDiv = document.getElementById('urlTestResult');
    
    if (!testUrl) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a URL to test</div>';
        return;
    }
    
    const validationResult = validateUrl(testUrl);
    
    resultDiv.innerHTML = `
        <div class="alert ${validationResult.isValid ? 'alert-success' : 'alert-danger'}">
            <h4>URL Validation Result:</h4>
            <p><strong>URL:</strong> ${testUrl}</p>
            <p><strong>Valid:</strong> ${validationResult.isValid ? 'Yes' : 'No'}</p>
            <p><strong>Reason:</strong> ${validationResult.reason}</p>
            <p><strong>Recommendation:</strong> ${validationResult.recommendation}</p>
        </div>
    `;
}

// URL validation function
function validateUrl(url) {
    try {
        const urlObj = new URL(url);
        
        // Check for private IP ranges
        const privateIPRanges = [
            /^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./,
            /^127\./, /^169\.254\./, /^::1$/, /^fc00:/, /^fe80:/
        ];
        
        const hostname = urlObj.hostname;
        
        // Check scheme
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return {
                isValid: false,
                reason: 'Invalid protocol. Only HTTP and HTTPS are allowed.',
                recommendation: 'Use only HTTP or HTTPS protocols.'
            };
        }
        
        // Check for private IP ranges
        if (privateIPRanges.some(range => range.test(hostname))) {
            return {
                isValid: false,
                reason: 'URL points to private/internal IP range.',
                recommendation: 'Block access to private IP ranges to prevent SSRF attacks.'
            };
        }
        
        // Check for localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return {
                isValid: false,
                reason: 'URL points to localhost.',
                recommendation: 'Block access to localhost to prevent SSRF attacks.'
            };
        }
        
        // Check for cloud metadata services
        const metadataServices = [
            '169.254.169.254', // AWS, DigitalOcean
            'metadata.google.internal', // Google Cloud
            '169.254.169.254', // Azure
            '100.100.100.200' // Alibaba Cloud
        ];
        
        if (metadataServices.includes(hostname)) {
            return {
                isValid: false,
                reason: 'URL points to cloud metadata service.',
                recommendation: 'Block access to cloud metadata services to prevent credential theft.'
            };
        }
        
        return {
            isValid: true,
            reason: 'URL appears to be safe for external access.',
            recommendation: 'Still implement proper validation and monitoring.'
        };
        
    } catch (error) {
        return {
            isValid: false,
            reason: 'Invalid URL format.',
            recommendation: 'Ensure URL is properly formatted.'
        };
    }
}

// Quiz function
function checkQuiz() {
    const selectedAnswer = document.querySelector('input[name="q1"]:checked');
    const resultDiv = document.getElementById('quizResult');
    
    if (!selectedAnswer) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please select an answer</div>';
        return;
    }
    
    const correctAnswer = 'b'; // Allowlist is better
    
    if (selectedAnswer.value === correctAnswer) {
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h4>Correct!</h4>
                <p>Allowlists (whitelists) are better than blocklists for preventing SSRF because:</p>
                <ul>
                    <li>They explicitly define what is allowed</li>
                    <li>They prevent new attack vectors from being missed</li>
                    <li>They are easier to maintain and audit</li>
                    <li>They follow the principle of least privilege</li>
                </ul>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h4>Incorrect!</h4>
                <p>The correct answer is B) Allowlist of approved domains.</p>
                <p>Allowlists are more secure because they explicitly define what is allowed, 
                making it harder for attackers to find new ways to bypass restrictions.</p>
            </div>
        `;
    }
}

// SSRF logging initialization
function initializeSSRFLogging() {
    // Log page access for educational purposes
    console.log('🔓 SSRF PAGE ACCESS (EDUCATIONAL):', {
        timestamp: new Date().toISOString(),
        page: 'A10-ServerSideRequestForgery',
        purpose: 'educational_demo',
        userAgent: navigator.userAgent
    });
}

// Utility function to show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Processing...</div>';
    }
}

// Utility function to show error
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error:</h4>
                <p>${message}</p>
            </div>
        `;
    }
}

// Utility function to show success
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-success">
                <h4>Success:</h4>
                <p>${message}</p>
            </div>
        `;
    }
}

// Add some CSS for better styling
const additionalStyles = `
<style>
.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}

.warning {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;
    color: #856404;
}

.warning i {
    margin-right: 5px;
}

.form-control {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

textarea {
    width: 100%;
    min-height: 80px;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
}

.url-test {
    margin: 15px 0;
}

.url-test label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.url-test input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.quiz-question {
    margin: 15px 0;
}

.quiz-question label {
    display: block;
    margin: 5px 0;
    cursor: pointer;
}

.quiz-question input[type="radio"] {
    margin-right: 8px;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
