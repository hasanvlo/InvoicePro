document.addEventListener('DOMContentLoaded', function() {
    // Profile Navigation
    const profileMenu = document.querySelector('.profile-menu');
    const profileSections = document.querySelectorAll('.profile-section');
    
    if (profileMenu) {
        profileMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                
                // Update active menu item
                profileMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show target section
                profileSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId + 'Section') {
                        section.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Profile Picture Upload
    const avatarInput = document.getElementById('avatarInput');
    const profilePicture = document.getElementById('profilePicture');
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicture.src = e.target.result;
                    // Here you would typically upload the image to your server
                    console.log('Profile picture updated');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Company Logo Upload
    const companyLogoInput = document.getElementById('companyLogoInput');
    const companyLogoPreview = document.getElementById('companyLogoPreview');
    
    if (companyLogoInput) {
        companyLogoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    companyLogoPreview.src = e.target.result;
                    companyLogoPreview.style.display = 'block';
                    // Here you would typically upload the logo to your server
                    console.log('Company logo updated');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form Submissions
    const forms = document.querySelectorAll('.profile-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Save business information to localStorage
            if (form.id === 'companyDetailsForm') {
                localStorage.setItem('businessName', data.companyName);
                localStorage.setItem('businessAddress', data.companyAddress);
                localStorage.setItem('businessEmail', data.email);
                localStorage.setItem('businessPhone', data.phone);
                
                // Save company logo if uploaded
                const logoInput = document.getElementById('companyLogoInput');
                if (logoInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        localStorage.setItem('businessLogo', e.target.result);
                    };
                    reader.readAsDataURL(logoInput.files[0]);
                }
            }
            
            // Here you would typically make an API call to your backend
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Changes saved successfully!');
        });
    });
    
    // Load User Data
    function loadUserData() {
        // Here you would typically fetch user data from your backend
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (123) 456-7890',
            companyName: 'ACME Inc.',
            companyAddress: '123 Business St\nCity, Country\nPostal Code',
            taxNumber: 'TAX123456',
            billingAddress: '456 Billing St\nCity, Country\nPostal Code',
            paymentMethod: 'bank',
            bankDetails: 'Bank: Example Bank\nAccount: 1234567890\nIBAN: XX00 XXXX 0000 0000'
        };
        
        // Populate form fields
        Object.keys(userData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = userData[key];
            }
        });
    }
    
    loadUserData();
}); 