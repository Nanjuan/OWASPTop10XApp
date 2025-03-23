document.getElementById('applyUpdateBtn').addEventListener('click', function() {
  // Simulate fetching an update from an untrusted source without verifying integrity.
  fetch('/update')
    .then(response => response.text())
    .then(data => {
      document.getElementById('updateOutput').innerText = 'Applying update...\n' + data;
      try {
        // Insecurely execute the fetched code without verifying its integrity.
        // WARNING: Using eval in this manner is dangerous and only for demonstration.
        eval(data);
      } catch (e) {
        document.getElementById('updateOutput').innerText += '\nError executing update: ' + e.message;
      }
    })
    .catch(error => {
      document.getElementById('updateOutput').innerText = 'Error fetching update: ' + error.message;
    });
});
