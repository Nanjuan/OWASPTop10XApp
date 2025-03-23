document.getElementById('bypassBtn').addEventListener('click', function() {
    const adminPanel = document.querySelector('.admin-panel');
    adminPanel.classList.remove('hidden');
    alert('Admin panel access granted (simulated unauthorized access).');
  });

  