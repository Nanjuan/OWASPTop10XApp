// Event listener to fetch the sensitive file when the button is clicked.
document.getElementById('fetchSensitive').addEventListener('click', function() {
  fetch('/files/secret.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('output').innerText = data;
    })
    .catch(error => {
      document.getElementById('output').innerText = 'Error fetching sensitive file: ' + error.message;
    });
});

// Automatically load and display public_info.txt when the page loads.
window.addEventListener('load', () => {
  fetch('/files/public_info.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load public info');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('publicOutput').innerText = data;
    })
    .catch(error => {
      document.getElementById('publicOutput').innerText = 'Error loading public info: ' + error.message;
    });
});
