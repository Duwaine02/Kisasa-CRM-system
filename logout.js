// Logout function
document.getElementById('logoutBtn').addEventListener('click', () => {
  // Remove login info from localStorage
  localStorage.removeItem('loggedIn');       // optional flag
  localStorage.removeItem('agent');          // optional agent info
  localStorage.removeItem('selectedClient'); // clear selected client
  // Redirect to login page
  window.location.href = 'login.html';
});
