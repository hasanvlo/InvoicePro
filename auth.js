document.addEventListener('DOMContentLoaded', function() {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Here you would typically make an API call to your backend
            console.log('Login attempt:', { email, remember });
            
            // For demo purposes, we'll just simulate a successful login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Redirect to profile page
            window.location.href = 'https://hasanvlo.github.io/InvoicePro/profile.html';
        });
    }
    
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Here you would typically make an API call to your backend
            console.log('Signup attempt:', { fullName, email });
            
            // For demo purposes, we'll just simulate a successful signup
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', fullName);
            
            // Redirect to profile page
            window.location.href = 'https://hasanvlo.github.io/InvoicePro/profile.html';
        });
    }
    
    // Check login status and update UI
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        // Update navigation based on login status
        const nav = document.querySelector('nav ul');
        if (nav) {
            if (isLoggedIn) {
                // Show logged-in state
                const loginLink = nav.querySelector('a[href*="login.html"]');
                const signupLink = nav.querySelector('a[href*="signup.html"]');
                if (loginLink) loginLink.style.display = 'none';
                if (signupLink) signupLink.style.display = 'none';
                
                // Add profile link if not exists
                if (!nav.querySelector('a[href*="profile.html"]')) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="https://hasanvlo.github.io/InvoicePro/profile.html">Profile</a>`;
                    nav.appendChild(li);
                }
                
                // Add logout link if not exists
                if (!nav.querySelector('a[href*="logout.html"]')) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="https://hasanvlo.github.io/InvoicePro/logout.html" class="btn btn-outline">Logout</a>`;
                    nav.appendChild(li);
                }
            } else {
                // Show logged-out state
                const profileLink = nav.querySelector('a[href*="profile.html"]');
                const logoutLink = nav.querySelector('a[href*="logout.html"]');
                if (profileLink) profileLink.style.display = 'none';
                if (logoutLink) logoutLink.style.display = 'none';
                
                // Show login/signup links if hidden
                const loginLink = nav.querySelector('a[href*="login.html"]');
                const signupLink = nav.querySelector('a[href*="signup.html"]');
                if (loginLink) loginLink.style.display = '';
                if (signupLink) signupLink.style.display = '';
            }
        }
    }
    
    // Check login status when page loads
    checkLoginStatus();
}); 