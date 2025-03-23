document.getElementById('vulnerableButton').addEventListener('click', function() {
  // Simulate an exploit using the outdated jQuery version.
  // In a real-world scenario, attackers might exploit such vulnerabilities to inject malicious code.
  $('#result').html('<strong>Exploit Successful:</strong> Outdated jQuery vulnerability exploited!<script>alert("XSS")</script>');
});
