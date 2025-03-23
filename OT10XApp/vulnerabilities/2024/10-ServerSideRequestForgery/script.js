// Handle form submission for SSRF proxy endpoint
document.getElementById('ssrfForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const url = document.getElementById('url').value;
  try {
      const response = await fetch('/proxy', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: url })
      });
      const data = await response.text();
      // Render the response as HTML so injected content is displayed.
      document.getElementById('response').innerHTML = data;
  } catch (error) {
      document.getElementById('response').innerText = 'Error: ' + error.message;
  }
});


// New event listener for fetching the payload from /payload endpoint
document.getElementById('fetchPayloadBtn').addEventListener('click', async function() {
  try {
    const response = await fetch('/payload');
    const data = await response.text();
    // Inject the HTML payload into the page
    document.getElementById('payloadOutput').innerHTML = data;
  } catch (error) {
    document.getElementById('payloadOutput').innerText = 'Error: ' + error.message;
  }
});
