function simulateAccess() {
    const adminPanel = document.querySelector('.admin-panel');
    adminPanel.classList.remove('hidden');
    alert('Unauthorized access granted to admin panel!');
}
