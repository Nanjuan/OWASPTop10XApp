// A02:2021 - Cryptographic Failures Interactive Learning

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Initialize all interactive components
    initializePasswordStorage();
    initializeEncryption();
    initializeTransmission();
    initializeCodeTabs();
    initializeExercise();
    initializeProgressTracking();
    
    // Track page visit
    trackPageVisit();
}

// Password Storage Demo
function initializePasswordStorage() {
    const form = document.getElementById('passwordStorageForm');
    const resultArea = document.getElementById('passwordResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            // Show loading state
            resultArea.innerHTML = '<div class="loading">Storing password...</div>';
            
            // Make API call to vulnerable endpoint
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Format the response for display
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Password Stored Successfully!</h4>
                        <div class="password-data">
                            <p><strong>Username:</strong> ${username}</p>
                            <p><strong>Password:</strong> ${password}</p>
                            <p><strong>Storage Method:</strong> Plaintext (Vulnerable)</p>
                        </div>
                        <div class="vulnerability-note">
                            <p><strong>⚠️ Vulnerability:</strong> Password is stored in plaintext! If the database is compromised, all passwords are immediately readable.</p>
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                // Update progress
                updateProgress('passwordProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
            }
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Encryption Demo
function initializeEncryption() {
    const form = document.getElementById('encryptionForm');
    const resultArea = document.getElementById('encryptionResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const secretMessage = document.getElementById('secretMessage').value;
        const encryptionType = document.getElementById('encryptionType').value;
        
        try {
            resultArea.innerHTML = '<div class="loading">Encrypting data...</div>';
            
            const response = await fetch('/api/encrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: secretMessage, 
                    algorithm: encryptionType 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                let algorithmInfo = '';
                let vulnerabilityNote = '';
                
                switch(encryptionType) {
                    case 'weak':
                        algorithmInfo = 'MD5 (Weak - Cryptographically Broken)';
                        vulnerabilityNote = '<p><strong>⚠️ Vulnerability:</strong> MD5 is cryptographically broken and can be easily reversed using rainbow tables or brute force attacks.</p>';
                        break;
                    case 'medium':
                        algorithmInfo = 'SHA1 (Medium - Deprecated)';
                        vulnerabilityNote = '<p><strong>⚠️ Vulnerability:</strong> SHA1 is deprecated and vulnerable to collision attacks. Not suitable for security applications.</p>';
                        break;
                    case 'strong':
                        algorithmInfo = 'SHA256 (Strong - Currently Secure)';
                        vulnerabilityNote = '<p><strong>✅ Secure:</strong> SHA256 is currently considered cryptographically secure for most applications.</p>';
                        break;
                }
                
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Data Encrypted Successfully!</h4>
                        <div class="encryption-data">
                            <p><strong>Original Message:</strong> ${secretMessage}</p>
                            <p><strong>Algorithm:</strong> ${algorithmInfo}</p>
                            <p><strong>Hash:</strong> <code>${data.hash}</code></p>
                        </div>
                        <div class="vulnerability-note">
                            ${vulnerabilityNote}
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                updateProgress('encryptionProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
            }
        } catch (error) {
            resultArea.innerHTML = `<div class="error-result">❌ Error: ${error.message}</div>`;
        }
    });
}

// Data Transmission Demo
function initializeTransmission() {
    const form = document.getElementById('transmissionForm');
    const resultArea = document.getElementById('transmissionResult');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const creditCard = document.getElementById('creditCard').value;
        const transmissionType = document.getElementById('transmissionType').value;
        
        try {
            resultArea.innerHTML = '<div class="loading">Transmitting data...</div>';
            
            const response = await fetch('/api/transmit-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    creditCard, 
                    transmissionType 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                let transmissionInfo = '';
                let vulnerabilityNote = '';
                
                if (transmissionType === 'insecure') {
                    transmissionInfo = 'HTTP (Insecure - No Encryption)';
                    vulnerabilityNote = `
                        <p><strong>⚠️ Vulnerability:</strong> Data transmitted over HTTP is sent in plaintext and can be intercepted by anyone on the network.</p>
                        <p><strong>How to verify:</strong> Open Developer Tools (F12) → Network tab → Send this request → Check the request payload to see the credit card in plaintext!</p>
                    `;
                } else {
                    transmissionInfo = 'HTTPS (Secure - Encrypted)';
                    vulnerabilityNote = '<p><strong>✅ Secure:</strong> Data transmitted over HTTPS is encrypted and protected from interception.</p>';
                }
                
                const formattedData = `
                    <div class="success-result">
                        <h4>✅ Data Transmitted Successfully!</h4>
                        <div class="transmission-data">
                            <p><strong>Credit Card:</strong> ${creditCard}</p>
                            <p><strong>Protocol:</strong> ${transmissionInfo}</p>
                            <p><strong>Status:</strong> ${data.message}</p>
                        </div>
                        <div class="vulnerability-note">
                            ${vulnerabilityNote}
                        </div>
                    </div>
                `;
                resultArea.innerHTML = formattedData;
                
                updateProgress('transmissionProgress', 100);
            } else {
                resultArea.innerHTML = `<div class="error-result">❌ Error: ${data.error}</div>`;
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
        
        const userAnswer = document.getElementById('exerciseInput').value.trim().toLowerCase();
        const correctAnswer = 'password123';
        
        if (userAnswer === correctAnswer) {
            const successMessage = `
                <div class="success-result">
                    <h4>🎉 Congratulations! You successfully cracked the MD5 hash!</h4>
                    <div class="achievement">
                        <i class="fas fa-trophy"></i>
                        <div>
                            <p><strong>Hash:</strong> 482c811da5d5b4bc6d497ffa98491e38</p>
                            <p><strong>Password:</strong> password123</p>
                            <p><strong>Lesson Learned:</strong> MD5 is cryptographically broken and should never be used for password storage or security applications.</p>
                        </div>
                    </div>
                    <div class="vulnerability-note">
                        <p><strong>Why MD5 is dangerous:</strong></p>
                        <ul>
                            <li>MD5 is cryptographically broken and vulnerable to collision attacks</li>
                            <li>Online databases contain millions of pre-computed MD5 hashes</li>
                            <li>Common passwords can be cracked instantly</li>
                            <li>Use bcrypt, Argon2, or PBKDF2 for password hashing instead</li>
                        </ul>
                    </div>
                </div>
            `;
            resultArea.innerHTML = successMessage;
        } else {
            const errorMessage = `
                <div class="error-result">
                    <h4>❌ Incorrect Answer</h4>
                    <p>The password you entered is not correct. Try again!</p>
                    <div class="hint-box">
                        <h5>💡 Hints:</h5>
                        <ul>
                            <li>Copy the hash: <code>482c811da5d5b4bc6d497ffa98491e38</code></li>
                            <li>Use an online MD5 cracker like <a href="https://crackstation.net/" target="_blank">CrackStation</a></li>
                            <li>The password is a common word with numbers</li>
                            <li>Think about typical password patterns</li>
                        </ul>
                    </div>
                </div>
            `;
            resultArea.innerHTML = errorMessage;
        }
    });
}

// Copy hash function for exercise
function copyHash() {
    const hash = '482c811da5d5b4bc6d497ffa98491e38';
    navigator.clipboard.writeText(hash).then(function() {
        // Show a brief success message
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Progress Tracking
function initializeProgressTracking() {
    // Load saved progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('cryptoProgress') || '{}');
    
    // Update progress bars with saved values
    Object.keys(savedProgress).forEach(elementId => {
        updateProgress(elementId, savedProgress[elementId], false);
    });
}

function updateProgress(elementId, percentage, save = true) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        
        // Save progress to localStorage
        if (save) {
            const savedProgress = JSON.parse(localStorage.getItem('cryptoProgress') || '{}');
            savedProgress[elementId] = percentage;
            localStorage.setItem('cryptoProgress', JSON.stringify(savedProgress));
        }
    }
}

// Analytics and tracking
function trackPageVisit() {
    // Track that user visited this page
    const visits = JSON.parse(localStorage.getItem('cryptoPageVisits') || '0');
    localStorage.setItem('cryptoPageVisits', JSON.stringify(visits + 1));
    
    console.log('A02:2021 - Cryptographic Failures page visited');
}

// Utility functions
function showLoading(element, message = 'Loading...') {
    element.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> ${message}</div>`;
}

function showError(element, message) {
    element.innerHTML = `<div class="error-result">❌ ${message}</div>`;
}

function showSuccess(element, message) {
    element.innerHTML = `<div class="success-result">✅ ${message}</div>`;
}
  