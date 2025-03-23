// Insecure Design: Sensitive information is hardcoded and exposed in the client-side code.
const adminCredentials = {
  username: "admin",
  password: "SuperSecret123"  // Sensitive data exposed!
};

// Display the exposed credentials on the page for demonstration purposes.
document.getElementById('adminCredentials').innerText = `Username: ${adminCredentials.username}, Password: ${adminCredentials.password}`;
