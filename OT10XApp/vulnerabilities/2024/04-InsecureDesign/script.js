// Progress tracking
let progress = {
  clientSide: 0,
  businessLogic: 0,
  missingControls: 0
};

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('insecure-design-progress');
  if (saved) {
    progress = JSON.parse(saved);
    updateProgressBars();
  }
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem('insecure-design-progress', JSON.stringify(progress));
}

// Update progress bars
function updateProgressBars() {
  document.getElementById('clientSideProgress').style.width = `${progress.clientSide}%`;
  document.getElementById('businessLogicProgress').style.width = `${progress.businessLogic}%`;
  document.getElementById('missingControlsProgress').style.width = `${progress.missingControls}%`;
}

// Insecure Design: Sensitive information is hardcoded and exposed in the client-side code.
const adminCredentials = {
  username: "admin",
  password: "SuperSecret123"  // Sensitive data exposed!
};

const apiKeys = {
  stripe: "sk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG",
  aws: "AKIAIOSFODNN7EXAMPLE",
  google: "AIzaSyB-1234567890abcdefghijklmnopqrstuvwxyz"
};

const dbConnection = {
  host: "localhost",
  port: 5432,
  database: "production_db",
  username: "db_user",
  password: "db_password_123"
};

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
  loadProgress();
  
  // Display exposed sensitive information
  document.getElementById('adminCredentials').innerText = `Username: ${adminCredentials.username}, Password: ${adminCredentials.password}`;
  document.getElementById('apiKeys').innerText = `Stripe: ${apiKeys.stripe.substring(0, 20)}..., AWS: ${apiKeys.aws.substring(0, 20)}...`;
  document.getElementById('dbConnection').innerText = `Host: ${dbConnection.host}:${dbConnection.port}, DB: ${dbConnection.database}`;
  
  // Tab switching
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
  
  // Client-Side Authentication Form
  const clientAuthForm = document.getElementById('clientAuthForm');
  if (clientAuthForm) {
    clientAuthForm.addEventListener('submit', handleClientAuth);
  }
  
  // Business Logic Form
  const businessLogicForm = document.getElementById('businessLogicForm');
  if (businessLogicForm) {
    businessLogicForm.addEventListener('submit', handleBusinessLogic);
  }
  
  // Missing Authentication Form
  const missingAuthForm = document.getElementById('missingAuthForm');
  if (missingAuthForm) {
    missingAuthForm.addEventListener('submit', handleMissingAuth);
  }
  
  // Missing Validation Form
  const missingValidationForm = document.getElementById('missingValidationForm');
  if (missingValidationForm) {
    missingValidationForm.addEventListener('submit', handleMissingValidation);
  }
  
  // Exercise Form
  const exerciseForm = document.getElementById('exerciseForm');
  if (exerciseForm) {
    exerciseForm.addEventListener('submit', handleExercise);
  }
});

// Handle Client-Side Authentication Demo
async function handleClientAuth(e) {
  e.preventDefault();
  
  const userRole = document.getElementById('userRole').value;
  const resultArea = document.getElementById('clientAuthResult');
  
  // WARNING: This is a design flaw - client-side authentication can be bypassed
  let isSuccessful = false;
  let message = '';
  
  if (userRole === 'admin') {
    isSuccessful = true;
    message = '🔓 Access granted to Admin Panel! (This is a design flaw - client-side auth can be bypassed)';
  } else if (userRole === 'superadmin') {
    isSuccessful = true;
    message = '🔓 Access granted to Super Admin Panel! (This is a design flaw - client-side auth can be bypassed)';
  } else {
    message = 'Access denied to Regular User. (But this can be bypassed by modifying the frontend code!)';
  }
  
  if (isSuccessful && progress.clientSide < 100) {
    progress.clientSide = Math.min(100, progress.clientSide + 25);
    saveProgress();
    updateProgressBars();
  }
  
  resultArea.innerHTML = `
    <div class="result ${isSuccessful ? 'success' : 'info'}">
      <h4>Client-Side Authentication Result:</h4>
      <p>${message}</p>
      <div class="design-flaw-warning">
        <h5>⚠️ Design Flaw:</h5>
        <p>Client-side authentication is fundamentally insecure. Attackers can:</p>
        <ul>
          <li>Modify the frontend JavaScript code</li>
          <li>Bypass authentication checks in browser dev tools</li>
          <li>Make direct API calls without authentication</li>
          <li>Access unauthorized resources</li>
        </ul>
      </div>
      ${isSuccessful ? '<div class="success-message">🎉 Client-side security flaw exploited! Progress updated.</div>' : ''}
    </div>
  `;
}

// Handle Business Logic Demo
async function handleBusinessLogic(e) {
  e.preventDefault();
  
  const productId = document.getElementById('productId').value;
  const quantity = document.getElementById('quantity').value;
  const userId = document.getElementById('userId').value;
  const totalPrice = document.getElementById('totalPrice').value;
  const resultArea = document.getElementById('businessLogicResult');
  
  if (!productId || !quantity || !userId || !totalPrice) {
    resultArea.innerHTML = '<div class="error">Please fill in all fields.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Creating order with business logic flaw...</div>';
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
        user_id: parseInt(userId),
        total_price: parseFloat(totalPrice)
      })
    });
    
    const data = await response.json();
    
    // Check if the business logic flaw was exploited
    const isSuccessful = (
      parseFloat(totalPrice) < 10 || // Price manipulation
      parseInt(quantity) < 0 || // Negative quantity
      parseInt(userId) === 1 || // Admin user spoofing
      parseInt(quantity) > 1000 // Quantity overflow
    );
    
    if (isSuccessful && progress.businessLogic < 100) {
      progress.businessLogic = Math.min(100, progress.businessLogic + 25);
      saveProgress();
      updateProgressBars();
    }
    
    resultArea.innerHTML = `
      <div class="result ${isSuccessful ? 'success' : 'info'}">
        <h4>Business Logic Flaw Result:</h4>
        <div class="order-details">
          <h5>Order Details:</h5>
          <p><strong>Product ID:</strong> ${productId}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>User ID:</strong> ${userId}</p>
          <p><strong>Total Price:</strong> $${totalPrice}</p>
        </div>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <div class="business-logic-warning">
          <h5>⚠️ Business Logic Flaw:</h5>
          <p>The application accepts client-provided prices without validation. This allows:</p>
          <ul>
            <li>Price manipulation (set price to $0.01)</li>
            <li>Negative quantities</li>
            <li>User ID spoofing</li>
            <li>Quantity overflow attacks</li>
          </ul>
        </div>
        ${isSuccessful ? '<div class="success-message">🎉 Business logic flaw exploited! Progress updated.</div>' : ''}
      </div>
    `;
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error creating order:</h4>
        <pre>${error.message}</pre>
        <p>Make sure the server is running and the endpoint is available.</p>
      </div>
    `;
  }
}

// Handle Missing Authentication Demo
async function handleMissingAuth(e) {
  e.preventDefault();
  
  const targetUserId = document.getElementById('targetUserId').value;
  const resultArea = document.getElementById('missingControlsResult');
  
  if (!targetUserId) {
    resultArea.innerHTML = '<div class="error">Please enter a user ID.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Accessing user profile without authentication...</div>';
  
  try {
    const response = await fetch(`/api/users/${targetUserId}`);
    const data = await response.json();
    
    // Check if the missing authentication control was exploited
    const isSuccessful = data && data.id && data.username;
    
    if (isSuccessful && progress.missingControls < 100) {
      progress.missingControls = Math.min(100, progress.missingControls + 25);
      saveProgress();
      updateProgressBars();
    }
    
    resultArea.innerHTML = `
      <div class="result ${isSuccessful ? 'success' : 'info'}">
        <h4>Missing Authentication Control Result:</h4>
        <div class="user-profile">
          <h5>User Profile (No Auth Required):</h5>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
        <div class="missing-control-warning">
          <h5>⚠️ Missing Authentication Control:</h5>
          <p>The application allows access to user profiles without authentication. This is a fundamental design flaw that:</p>
          <ul>
            <li>Exposes sensitive user data</li>
            <li>Allows unauthorized access to any user profile</li>
            <li>Violates privacy and security principles</li>
            <li>Cannot be fixed by proper implementation alone</li>
          </ul>
        </div>
        ${isSuccessful ? '<div class="success-message">🎉 Missing authentication control exploited! Progress updated.</div>' : ''}
      </div>
    `;
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error accessing user profile:</h4>
        <pre>${error.message}</pre>
        <p>Make sure the server is running and the endpoint is available.</p>
      </div>
    `;
  }
}

// Handle Missing Validation Demo
async function handleMissingValidation(e) {
  e.preventDefault();
  
  const userInput = document.getElementById('userInput').value;
  const resultArea = document.getElementById('missingControlsResult');
  
  if (!userInput) {
    resultArea.innerHTML = '<div class="error">Please enter some data.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Submitting data without validation...</div>';
  
  try {
    // Simulate submitting data without validation
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      '"; DROP TABLE users; --',
      'admin\' OR \'1\'=\'1',
      'javascript:alert("XSS")',
      'data:text/html,<script>alert("XSS")</script>'
    ];
    
    const isMalicious = maliciousInputs.some(malicious => 
      userInput.toLowerCase().includes(malicious.toLowerCase())
    );
    
    if (isMalicious && progress.missingControls < 100) {
      progress.missingControls = Math.min(100, progress.missingControls + 25);
      saveProgress();
      updateProgressBars();
    }
    
    resultArea.innerHTML = `
      <div class="result ${isMalicious ? 'success' : 'info'}">
        <h4>Missing Input Validation Result:</h4>
        <div class="input-analysis">
          <h5>Submitted Data:</h5>
          <pre>${userInput}</pre>
          <p><strong>Data Length:</strong> ${userInput.length} characters</p>
          <p><strong>Contains Special Characters:</strong> ${/[<>"'&]/.test(userInput) ? 'Yes' : 'No'}</p>
        </div>
        <div class="missing-validation-warning">
          <h5>⚠️ Missing Input Validation:</h5>
          <p>The application accepts any input without validation. This allows:</p>
          <ul>
            <li>XSS (Cross-Site Scripting) attacks</li>
            <li>SQL injection attempts</li>
            <li>Command injection</li>
            <li>Data corruption</li>
            <li>Buffer overflow attempts</li>
          </ul>
        </div>
        ${isMalicious ? '<div class="success-message">🎉 Missing validation control exploited! Progress updated.</div>' : ''}
      </div>
    `;
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error processing input:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
}

// Handle Exercise
async function handleExercise(e) {
  e.preventDefault();
  
  const productId = document.getElementById('exerciseProductId').value;
  const quantity = document.getElementById('exerciseQuantity').value;
  const userId = document.getElementById('exerciseUserId').value;
  const price = document.getElementById('exercisePrice').value;
  const resultArea = document.getElementById('exerciseResult');
  
  if (!productId || !quantity || !userId || !price) {
    resultArea.innerHTML = '<div class="error">Please fill in all fields.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Testing business logic exploitation...</div>';
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
        user_id: parseInt(userId),
        total_price: parseFloat(price)
      })
    });
    
    const data = await response.json();
    
    // Check if the exercise was completed successfully
    const isSuccessful = (
      parseFloat(price) < 1.00 || // Price manipulation
      parseInt(quantity) < 0 || // Negative quantity
      parseInt(userId) === 1 || // Admin user spoofing
      parseInt(quantity) > 1000 || // Quantity overflow
      parseFloat(price) === 0 || // Free items
      userInput.includes('<script>') || // XSS attempt
      userInput.includes('DROP TABLE') // SQL injection attempt
    );
    
    if (isSuccessful) {
      // Update all progress bars for completing the exercise
      progress.clientSide = Math.max(progress.clientSide, 100);
      progress.businessLogic = Math.max(progress.businessLogic, 100);
      progress.missingControls = Math.max(progress.missingControls, 100);
      saveProgress();
      updateProgressBars();
      
      resultArea.innerHTML = `
        <div class="result success">
          <h4>🎉 Exercise Completed Successfully!</h4>
          <p>You successfully exploited business logic flaws in the order system!</p>
          <div class="exercise-solution">
            <h5>Your Attack Parameters:</h5>
            <ul>
              <li><strong>Product ID:</strong> ${productId}</li>
              <li><strong>Quantity:</strong> ${quantity}</li>
              <li><strong>User ID:</strong> ${userId}</li>
              <li><strong>Price:</strong> $${price}</li>
            </ul>
            <h5>Result:</h5>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
          <div class="success-message">
            <h5>🎯 Learning Achievement:</h5>
            <ul>
              <li>✅ Successfully exploited business logic flaws</li>
              <li>✅ Demonstrated price manipulation</li>
              <li>✅ Showed missing validation controls</li>
              <li>✅ Progress updated across all insecure design types</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      resultArea.innerHTML = `
        <div class="result info">
          <h4>Exercise Attempt</h4>
          <p>Your attack was executed but didn't exploit the business logic flaws. Try different parameter manipulations!</p>
          <div class="exercise-attempt">
            <h5>Your Parameters:</h5>
            <ul>
              <li><strong>Product ID:</strong> ${productId}</li>
              <li><strong>Quantity:</strong> ${quantity}</li>
              <li><strong>User ID:</strong> ${userId}</li>
              <li><strong>Price:</strong> $${price}</li>
            </ul>
            <h5>Result:</h5>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
          <div class="hint">
            <h5>💡 Hint:</h5>
            <p>Try setting the price to $0.01, quantity to -1, or user ID to 1 (admin) to exploit the business logic flaws.</p>
          </div>
        </div>
      `;
    }
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error testing your attack:</h4>
        <pre>${error.message}</pre>
        <p>Make sure the server is running and try again.</p>
      </div>
    `;
  }
}

// Copy example to clipboard
function copyExample(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show a brief success message
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  });
}

// Add click handlers to example codes
document.addEventListener('DOMContentLoaded', function() {
  const exampleCodes = document.querySelectorAll('.example-item code');
  exampleCodes.forEach(code => {
    code.style.cursor = 'pointer';
    code.title = 'Click to copy';
    code.addEventListener('click', () => copyExample(code.textContent));
  });
});
