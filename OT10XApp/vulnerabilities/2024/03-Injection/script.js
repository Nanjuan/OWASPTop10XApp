document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const query = document.getElementById('query').value;
  
  // Send the unsanitized query to the backend search endpoint
  fetch(`/search?query=${encodeURIComponent(query)}`)
    .then(response => response.text())
    .then(data => {
      document.getElementById('results').innerText = data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('results').innerText = 'Error fetching data.';
    });
});
