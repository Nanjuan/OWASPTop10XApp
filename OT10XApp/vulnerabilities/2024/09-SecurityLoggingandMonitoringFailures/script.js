// A09:2021 - Security Logging and Monitoring Failures Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    initializeMissingLogDemo();
    initializeLogInjectionDemo();
    initializeMonitoringDemo();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    trackPageVisit();
}

// Scenario 1: Missing or Incomplete Logging
function initializeMissingLogDemo() {
    const form = document.getElementById('missingLogForm');
    const resultArea = document.getElementById('missingLogResult');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('missingLogUsername').value.trim();
        const password = document.getElementById('missingLogPassword').value.trim();
        if (!username || !password) {
            resultArea.innerHTML = `<div class="error-result">❌ Please enter both username and password</div>`;
            return;
        }
        fetch('/api/logging/missing-log-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                resultArea.innerHTML = `<div class="success-result">✅ ${data.message}</div>`;
                updateProgress('loggingProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                updateProgress('loggingProgress', 50);
            }
        })
        .catch(error => {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        });
    });
}

// Scenario 2: Log Injection/Manipulation
function initializeLogInjectionDemo() {
    const form = document.getElementById('logInjectionForm');
    const resultArea = document.getElementById('logInjectionResult');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const payload = document.getElementById('logInjectionInput').value;
        if (!payload) {
            resultArea.innerHTML = `<div class="error-result">❌ Please enter a log message or payload</div>`;
            return;
        }
        fetch('/api/logging/log-injection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: payload })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                resultArea.innerHTML = `<div class="success-result">✅ ${data.message}</div>`;
                updateProgress('injectionProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                updateProgress('injectionProgress', 50);
            }
        })
        .catch(error => {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        });
    });
}

// Scenario 3: Insufficient Monitoring & Alerting
function initializeMonitoringDemo() {
    const btn = document.getElementById('triggerSuspiciousActivityBtn');
    const resultArea = document.getElementById('monitoringResult');
    btn.addEventListener('click', function() {
        resultArea.innerHTML = '<div class="loading">Triggering suspicious activity...</div>';
        fetch('/api/logging/trigger-suspicious', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                resultArea.innerHTML = `<div class="success-result">✅ ${data.message}</div>`;
                updateProgress('monitoringProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ ${data.message}</div>`;
                updateProgress('monitoringProgress', 50);
            }
        })
        .catch(error => {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        });
    });
}

// Code Tabs
function initializeCodeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
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
        const answer = document.getElementById('exerciseInput').value.trim();
        // Accept answers that contain newlines, carriage returns, or common log injection payloads
        const correctPatterns = [/\\n/, /\\r/, /InjectedEntry/i, /admin:true/i, /role=admin/i, /newline/i, /log injection/i];
        if (correctPatterns.some(re => re.test(answer))) {
            resultArea.innerHTML = `<div class="success-result"><h4>✅ Correct!</h4><p>Log injection payloads often use newlines (\\n) or control characters to break log format or inject fake entries.</p></div>`;
        } else {
            resultArea.innerHTML = `<div class="error-result"><h4>❌ Incorrect</h4><p>Try again! Hint: Common payloads use newlines or control characters.</p></div>`;
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    updateProgress('loggingProgress', 0);
    updateProgress('injectionProgress', 0);
    updateProgress('monitoringProgress', 0);
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
    console.log('A09:2021 - Security Logging and Monitoring Failures page visited');
}
