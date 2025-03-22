const express = require('express');
const app = express();
const PORT = 3000;

// Middleware for serving static files
app.use(express.static('vulnerabilities/2024/01-brokenAccessControl/index.html'));

app.get('/admin', (req, res) => {
    res.status(403).send('Access Denied: Unauthorized User');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
