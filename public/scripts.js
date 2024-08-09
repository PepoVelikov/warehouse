document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const registerContainer = document.getElementById('registerContainer');
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');

  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.container').style.display = 'none';
      registerContainer.style.display = 'block';
    });
  }

  if (showLoginLink) {  
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.container').style.display = 'block';
      registerContainer.style.display = 'none';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || 'Login successful');
          localStorage.setItem('token', data.token);
          window.location.href = 'dashboard.html';
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword })
        });

        const data = await response.json();
        if (response.ok) {
          alert('Registration successful');
          window.location.href = 'login.html';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  });
}
});