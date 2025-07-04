// A08:2021 - Software and Data Integrity Failures Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Initialize all interactive components
    initializeUpdateDemo();
    initializeSupplyChainDemo();
    initializeCICDDemo();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    
    // Track page visit
    trackPageVisit();
}

// Global variables
let currentUpdateSource = 'official';
let updateAvailable = false;
let updateDownloaded = false;

// Unverified Software Updates Demo
function initializeUpdateDemo() {
    const checkBtn = document.getElementById('checkForUpdatesBtn');
    const downloadBtn = document.getElementById('downloadUpdateBtn');
    const installBtn = document.getElementById('installUpdateBtn');
    const resultArea = document.getElementById('updateResult');
    
    // Check for updates
    checkBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Checking for updates...</div>';
            
            // Call backend endpoint to check for updates
            fetch('/api/integrity/check-updates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ source: currentUpdateSource })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateAvailable = true;
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Update Available</h4>
                            <div class="update-info">
                                <p><strong>Version:</strong> ${data.version}</p>
                                <p><strong>Source:</strong> ${data.source}</p>
                                <p><strong>Size:</strong> ${data.size}</p>
                                <p><strong>Integrity Check:</strong> ${data.integrityVerified ? '✅ Verified' : '❌ Not Verified'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('updateProgress', 33);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Download update
    downloadBtn.addEventListener('click', function() {
        try {
            if (!updateAvailable) {
                resultArea.innerHTML = `<div class="error-result">❌ No update available. Check for updates first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Downloading update...</div>';
            
            // Call backend endpoint to download update
            fetch('/api/integrity/download-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ source: currentUpdateSource })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateDownloaded = true;
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Update Downloaded</h4>
                            <div class="download-info">
                                <p><strong>File:</strong> ${data.filename}</p>
                                <p><strong>Checksum:</strong> ${data.checksum}</p>
                                <p><strong>Expected Checksum:</strong> ${data.expectedChecksum}</p>
                                <p><strong>Integrity Match:</strong> ${data.integrityMatch ? '✅ Match' : '❌ Mismatch'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('updateProgress', 66);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Install update
    installBtn.addEventListener('click', function() {
        try {
            if (!updateDownloaded) {
                resultArea.innerHTML = `<div class="error-result">❌ No update downloaded. Download update first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Installing update...</div>';
            
            // Call backend endpoint to install update
            fetch('/api/integrity/install-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ source: currentUpdateSource })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Update Installed Successfully!</h4>
                            <div class="install-info">
                                <p><strong>Status:</strong> ${data.status}</p>
                                <p><strong>Malicious Code Detected:</strong> ${data.maliciousCode ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Backdoor Installed:</strong> ${data.backdoorInstalled ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                                <p><strong>Impact:</strong> ${data.impact}</p>
                            </div>
                            <div class="vulnerability-note">
                                <p><strong>⚠️ Vulnerability:</strong> Application installed update without integrity verification!</p>
                            </div>
                        </div>
                    `;
                    updateProgress('updateProgress', 100);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
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

// Supply Chain Attack Demo
function initializeSupplyChainDemo() {
    const scanBtn = document.getElementById('scanDependenciesBtn');
    const installBtn = document.getElementById('installDependencyBtn');
    const buildBtn = document.getElementById('buildProjectBtn');
    const resultArea = document.getElementById('supplyChainResult');
    
    let dependenciesScanned = false;
    let dependencyInstalled = false;
    
    // Scan dependencies
    scanBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Scanning dependencies...</div>';
            
            // Call backend endpoint to scan dependencies
            fetch('/api/integrity/scan-dependencies')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    dependenciesScanned = true;
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Dependencies Scanned</h4>
                            <div class="scan-info">
                                <p><strong>Total Dependencies:</strong> ${data.totalDependencies}</p>
                                <p><strong>Vulnerable Dependencies:</strong> ${data.vulnerableDependencies}</p>
                                <p><strong>Compromised Packages:</strong> ${data.compromisedPackages}</p>
                                <p><strong>Risk Level:</strong> ${data.riskLevel}</p>
                            </div>
                            <div class="dependency-list">
                                <h5>Dependency Analysis:</h5>
                                <ul>
                                    ${data.dependencies.map(dep => `
                                        <li><strong>${dep.name}</strong> (${dep.version}) - ${dep.status}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                    updateProgress('supplyChainProgress', 33);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Install dependency
    installBtn.addEventListener('click', function() {
        try {
            if (!dependenciesScanned) {
                resultArea.innerHTML = `<div class="error-result">❌ Scan dependencies first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Installing dependency...</div>';
            
            // Call backend endpoint to install dependency
            fetch('/api/integrity/install-dependency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ packageName: 'malicious-package' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    dependencyInstalled = true;
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Dependency Installed</h4>
                            <div class="install-info">
                                <p><strong>Package:</strong> ${data.packageName}</p>
                                <p><strong>Version:</strong> ${data.version}</p>
                                <p><strong>Integrity Check:</strong> ${data.integrityVerified ? '✅ Verified' : '❌ Not Verified'}</p>
                                <p><strong>Malicious Code:</strong> ${data.maliciousCode ? '⚠️ Detected' : '✅ Clean'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('supplyChainProgress', 66);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Build project
    buildBtn.addEventListener('click', function() {
        try {
            if (!dependencyInstalled) {
                resultArea.innerHTML = `<div class="error-result">❌ Install dependency first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Building project...</div>';
            
            // Call backend endpoint to build project
            fetch('/api/integrity/build-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Project Built Successfully!</h4>
                            <div class="build-info">
                                <p><strong>Build Status:</strong> ${data.buildStatus}</p>
                                <p><strong>Malicious Code Executed:</strong> ${data.maliciousCodeExecuted ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Backdoor Installed:</strong> ${data.backdoorInstalled ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Data Exfiltrated:</strong> ${data.dataExfiltrated ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                                <p><strong>Impact:</strong> ${data.impact}</p>
                            </div>
                            <div class="vulnerability-note">
                                <p><strong>⚠️ Vulnerability:</strong> Application built with compromised dependencies!</p>
                            </div>
                        </div>
                    `;
                    updateProgress('supplyChainProgress', 100);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
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

// CI/CD Pipeline Compromise Demo
function initializeCICDDemo() {
    const triggerBtn = document.getElementById('triggerBuildBtn');
    const deployBtn = document.getElementById('deployAppBtn');
    const verifyBtn = document.getElementById('verifyDeploymentBtn');
    const resultArea = document.getElementById('cicdResult');
    
    let buildTriggered = false;
    let appDeployed = false;
    
    // Trigger build
    triggerBtn.addEventListener('click', function() {
        try {
            resultArea.innerHTML = '<div class="loading">Triggering build...</div>';
            
            // Call backend endpoint to trigger build
            fetch('/api/integrity/trigger-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    buildTriggered = true;
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Build Triggered</h4>
                            <div class="build-info">
                                <p><strong>Build ID:</strong> ${data.buildId}</p>
                                <p><strong>Status:</strong> ${data.status}</p>
                                <p><strong>Build Script Verified:</strong> ${data.scriptVerified ? '✅ Yes' : '❌ No'}</p>
                                <p><strong>Malicious Code Injected:</strong> ${data.maliciousCodeInjected ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('cicdProgress', 33);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Deploy application
    deployBtn.addEventListener('click', function() {
        try {
            if (!buildTriggered) {
                resultArea.innerHTML = `<div class="error-result">❌ Trigger build first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Deploying application...</div>';
            
            // Call backend endpoint to deploy application
            fetch('/api/integrity/deploy-app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    appDeployed = true;
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Application Deployed</h4>
                            <div class="deploy-info">
                                <p><strong>Deployment ID:</strong> ${data.deploymentId}</p>
                                <p><strong>Status:</strong> ${data.status}</p>
                                <p><strong>URL:</strong> ${data.url}</p>
                                <p><strong>Malicious Code Deployed:</strong> ${data.maliciousCodeDeployed ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                            </div>
                        </div>
                    `;
                    updateProgress('cicdProgress', 66);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                }
            })
            .catch(error => {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
            });
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
    
    // Verify deployment
    verifyBtn.addEventListener('click', function() {
        try {
            if (!appDeployed) {
                resultArea.innerHTML = `<div class="error-result">❌ Deploy application first.</div>`;
                return;
            }
            
            resultArea.innerHTML = '<div class="loading">Verifying deployment...</div>';
            
            // Call backend endpoint to verify deployment
            fetch('/api/integrity/verify-deployment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultArea.innerHTML = `
                        <div class="success-result">
                            <h4>✅ Deployment Verification Complete!</h4>
                            <div class="verify-info">
                                <p><strong>Deployment Status:</strong> ${data.deploymentStatus}</p>
                                <p><strong>Malicious Code Active:</strong> ${data.maliciousCodeActive ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Backdoor Access:</strong> ${data.backdoorAccess ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Data Compromised:</strong> ${data.dataCompromised ? '⚠️ YES' : '✅ NO'}</p>
                                <p><strong>Vulnerability:</strong> ${data.vulnerability}</p>
                                <p><strong>Impact:</strong> ${data.impact}</p>
                            </div>
                            <div class="vulnerability-note">
                                <p><strong>⚠️ Vulnerability:</strong> CI/CD pipeline compromised and deployed malicious code!</p>
                            </div>
                        </div>
                    `;
                    updateProgress('cicdProgress', 100);
                } else {
                    resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
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
        const correctAnswers = ['dependency poisoning', 'dependency attack', 'supply chain attack'];
        
        if (correctAnswers.includes(answer)) {
            resultArea.innerHTML = `
                <div class="success-result">
                    <h4>✅ Correct Answer!</h4>
                    <p>"Dependency poisoning" is indeed the most common type of supply chain attack.</p>
                    <p><strong>How it works:</strong> Attackers compromise popular packages and inject malicious code</p>
                    <p><strong>Examples:</strong> npm, PyPI, and other package repositories have been targeted</p>
                    <p><strong>Prevention:</strong> Always verify package integrity and use trusted sources</p>
                </div>
            `;
        } else {
            resultArea.innerHTML = `
                <div class="error-result">
                    <h4>❌ Incorrect Answer</h4>
                    <p>Try again! Hint: Think about how attackers compromise software dependencies.</p>
                    <p>Common answers: dependency poisoning, supply chain attack, package compromise</p>
                </div>
            `;
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    // Initialize progress bars
    updateProgress('updateProgress', 0);
    updateProgress('supplyChainProgress', 0);
    updateProgress('cicdProgress', 0);
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
    console.log('A08:2021 - Software and Data Integrity Failures page visited');
    
    // You could send analytics data here
    // analytics.track('page_viewed', { page: 'A08-IntegrityFailures' });
}

// Utility Functions
function setUpdateSource(source) {
    currentUpdateSource = source;
    console.log('Update source set to:', source);
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
