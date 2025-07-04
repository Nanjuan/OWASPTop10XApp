// Progress tracking
let progress = {
  sql: 0,
  command: 0,
  nosql: 0
};

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('injection-progress');
  if (saved) {
    progress = JSON.parse(saved);
    updateProgressBars();
  }
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem('injection-progress', JSON.stringify(progress));
}

// Update progress bars
function updateProgressBars() {
  document.getElementById('sqlProgress').style.width = `${progress.sql}%`;
  document.getElementById('commandProgress').style.width = `${progress.command}%`;
  document.getElementById('nosqlProgress').style.width = `${progress.nosql}%`;
}

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
  loadProgress();
  
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
  
  // SQL Injection Form
  const sqlInjectionForm = document.getElementById('sqlInjectionForm');
  if (sqlInjectionForm) {
    sqlInjectionForm.addEventListener('submit', handleSQLInjection);
  }
  
  // Command Injection Form
  const commandInjectionForm = document.getElementById('commandInjectionForm');
  if (commandInjectionForm) {
    commandInjectionForm.addEventListener('submit', handleCommandInjection);
  }
  
  // NoSQL Injection Form
  const nosqlInjectionForm = document.getElementById('nosqlInjectionForm');
  if (nosqlInjectionForm) {
    nosqlInjectionForm.addEventListener('submit', handleNoSQLInjection);
  }
  
  // Exercise Form
  const exerciseForm = document.getElementById('exerciseForm');
  if (exerciseForm) {
    exerciseForm.addEventListener('submit', handleExercise);
  }
});

// Handle SQL Injection Demo
async function handleSQLInjection(e) {
  e.preventDefault();
  
  const searchQuery = document.getElementById('searchQuery').value;
  const resultArea = document.getElementById('sqlInjectionResult');
  
  if (!searchQuery.trim()) {
    resultArea.innerHTML = '<div class="error">Please enter a search query.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Executing SQL injection attack...</div>';
  
  try {
    const response = await fetch(`/search?query=${encodeURIComponent(searchQuery)}`);
    const data = await response.text();
    
    // Check if the attack was successful (contains multiple results or specific patterns)
    const isSuccessful = data.includes('id') && data.includes('username') && 
                        (data.includes('admin') || data.includes('user') || 
                         searchQuery.includes("'") || searchQuery.includes('--') ||
                         searchQuery.includes('UNION') || searchQuery.includes('OR'));
    
    if (isSuccessful && progress.sql < 100) {
      progress.sql = Math.min(100, progress.sql + 25);
      saveProgress();
      updateProgressBars();
    }
    
    resultArea.innerHTML = `
      <div class="result ${isSuccessful ? 'success' : 'info'}">
        <h4>SQL Injection Result:</h4>
        <pre>${data}</pre>
        ${isSuccessful ? '<div class="success-message">🎉 SQL injection attack successful! Progress updated.</div>' : ''}
      </div>
    `;
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error executing SQL injection:</h4>
        <pre>${error.message}</pre>
        <p>Make sure the server is running and the endpoint is available.</p>
      </div>
    `;
  }
}

// Handle Command Injection Demo
async function handleCommandInjection(e) {
  e.preventDefault();
  
  const systemCommand = document.getElementById('systemCommand').value;
  const resultArea = document.getElementById('commandInjectionResult');
  
  if (!systemCommand.trim()) {
    resultArea.innerHTML = '<div class="error">Please enter a system command.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Executing command injection attack...</div>';
  
  try {
    const response = await fetch('/api/system/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: systemCommand })
    });
    
    const data = await response.json();
    
    // Check if the command was executed successfully
    const isSuccessful = data.output && data.output.length > 0;
    
    if (isSuccessful && progress.command < 100) {
      progress.command = Math.min(100, progress.command + 25);
      saveProgress();
      updateProgressBars();
    }
    
    resultArea.innerHTML = `
      <div class="result ${isSuccessful ? 'success' : 'info'}">
        <h4>Command Injection Result:</h4>
        <div class="command-output">
          <h5>Output:</h5>
          <pre>${data.output || 'No output'}</pre>
          ${data.error ? `<h5>Error:</h5><pre>${data.error}</pre>` : ''}
        </div>
        ${isSuccessful ? '<div class="success-message">🎉 Command injection attack successful! Progress updated.</div>' : ''}
      </div>
    `;
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error executing command injection:</h4>
        <pre>${error.message}</pre>
        <p>Make sure the server is running and the endpoint is available.</p>
      </div>
    `;
  }
}

// Handle NoSQL Injection Demo
async function handleNoSQLInjection(e) {
  e.preventDefault();
  
  const nosqlQuery = document.getElementById('nosqlQuery').value;
  const resultArea = document.getElementById('nosqlInjectionResult');
  
  if (!nosqlQuery.trim()) {
    resultArea.innerHTML = '<div class="error">Please enter a NoSQL query.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Executing NoSQL injection attack...</div>';
  
  try {
    const response = await fetch('/api/nosql/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: nosqlQuery })
    });
    
    const data = await response.json();
    
    // Check if the NoSQL injection was successful
    const isSuccessful = data.results && data.results.length > 0 && 
                        (nosqlQuery.includes('$') || nosqlQuery.includes('{') || 
                         nosqlQuery.includes('}') || nosqlQuery.includes('regex') ||
                         nosqlQuery.includes('where') || nosqlQuery.includes('ne'));
    
    if (isSuccessful && progress.nosql < 100) {
      progress.nosql = Math.min(100, progress.nosql + 25);
      saveProgress();
      updateProgressBars();
    }
    
    resultArea.innerHTML = `
      <div class="result ${isSuccessful ? 'success' : 'info'}">
        <h4>NoSQL Injection Result:</h4>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        ${isSuccessful ? '<div class="success-message">🎉 NoSQL injection attack successful! Progress updated.</div>' : ''}
      </div>
    `;
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error executing NoSQL injection:</h4>
        <pre>${error.message}</pre>
        <p>Make sure the server is running and the endpoint is available.</p>
      </div>
    `;
  }
}

// Handle Exercise
async function handleExercise(e) {
  e.preventDefault();
  
  const exerciseInput = document.getElementById('exerciseInput').value;
  const resultArea = document.getElementById('exerciseResult');
  
  if (!exerciseInput.trim()) {
    resultArea.innerHTML = '<div class="error">Please enter your SQL injection payload.</div>';
    return;
  }
  
  resultArea.innerHTML = '<div class="loading">Testing your SQL injection payload...</div>';
  
  try {
    const response = await fetch(`/search?query=${encodeURIComponent(exerciseInput)}`);
    const data = await response.text();
    
    // Check if the exercise was completed successfully
    const isSuccessful = data.includes('id') && data.includes('username') && 
                        (exerciseInput.includes("' OR '1'='1") || 
                         exerciseInput.includes("' UNION") ||
                         exerciseInput.includes("' --") ||
                         exerciseInput.includes("';") ||
                         (exerciseInput.includes("'") && exerciseInput.includes('OR')));
    
    if (isSuccessful) {
      // Update all progress bars for completing the exercise
      progress.sql = Math.max(progress.sql, 100);
      progress.command = Math.max(progress.command, 75);
      progress.nosql = Math.max(progress.nosql, 75);
      saveProgress();
      updateProgressBars();
      
      resultArea.innerHTML = `
        <div class="result success">
          <h4>🎉 Exercise Completed Successfully!</h4>
          <p>You successfully extracted user data using SQL injection!</p>
          <div class="exercise-solution">
            <h5>Your Payload:</h5>
            <code>${exerciseInput}</code>
            <h5>Result:</h5>
            <pre>${data}</pre>
          </div>
          <div class="success-message">
            <h5>🎯 Learning Achievement:</h5>
            <ul>
              <li>✅ Successfully bypassed search functionality</li>
              <li>✅ Extracted sensitive user data</li>
              <li>✅ Demonstrated SQL injection techniques</li>
              <li>✅ Progress updated across all injection types</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      resultArea.innerHTML = `
        <div class="result info">
          <h4>Exercise Attempt</h4>
          <p>Your payload was executed but didn't extract all user data. Try different SQL injection techniques!</p>
          <div class="exercise-attempt">
            <h5>Your Payload:</h5>
            <code>${exerciseInput}</code>
            <h5>Result:</h5>
            <pre>${data}</pre>
          </div>
          <div class="hint">
            <h5>💡 Hint:</h5>
            <p>Try using <code>' OR '1'='1</code> or <code>' UNION SELECT * FROM users --</code> to extract all user data.</p>
          </div>
        </div>
      `;
    }
    
  } catch (error) {
    resultArea.innerHTML = `
      <div class="error">
        <h4>Error testing your payload:</h4>
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
