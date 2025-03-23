document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Insecure: storing credentials in plaintext in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    
    // Display the stored credentials (demonstrating the vulnerability)
    document.getElementById('message').innerText = `Insecurely stored credentials - Username: ${username}, Password: ${password}`;
  });
  