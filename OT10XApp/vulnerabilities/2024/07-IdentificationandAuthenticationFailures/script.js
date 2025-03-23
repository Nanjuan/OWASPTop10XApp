document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Send credentials to the vulnerable backend endpoint
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.text())
  .then(data => {
    document.getElementById('response').innerText = data;
  })
  .catch(error => {
    document.getElementById('response').innerText = 'Error: ' + error.message;
  });
});
