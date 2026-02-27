document.addEventListener("DOMContentLoaded", () => {
  // Form and Input Elements
  const form = document.getElementById('signupForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password');
  const confirmPwdInput = document.getElementById('confirmPassword');
  
  // Error Message Elements
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const pwdError = document.getElementById('pwd-error');
  const confirmPwdError = document.getElementById('confirm-pwd-error');

  // Loader Modal
  const loaderModal = document.getElementById('loaderModal');

  // Helper function to show errors visually
  function showError(input, errorElement, message) {
    input.classList.add('has-error');
    errorElement.querySelector('span').innerText = message;
    errorElement.classList.add('show');
  }

  // Helper function to clear errors visually
  function clearError(input, errorElement) {
    input.classList.remove('has-error');
    errorElement.classList.remove('show');
  }

  // Clear errors the moment the user starts typing to fix them
  fullNameInput.addEventListener('input', () => clearError(fullNameInput, nameError));
  emailInput.addEventListener('input', () => clearError(emailInput, emailError));
  pwdInput.addEventListener('input', () => clearError(pwdInput, pwdError));
  confirmPwdInput.addEventListener('input', () => clearError(confirmPwdInput, confirmPwdError));

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    // 1. THIS IS CRUCIAL: It stops the form from submitting automatically
    e.preventDefault(); 
    
    // We assume the form is valid until we find an error
    let isValid = true; 

    // 2. Validate Full Name
    if (fullNameInput.value.trim() === '') {
      showError(fullNameInput, nameError, 'Please enter your full name.');
      isValid = false; // Form is no longer valid
    }

    // 3. Validate Email
    const emailValue = emailInput.value.trim();
    if (emailValue === '') {
      showError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      showError(emailInput, emailError, 'Please enter a valid email format.');
      isValid = false;
    }

    // 4. Validate Password
    const pwdValue = pwdInput.value.trim();
    if (pwdValue === '') {
      showError(pwdInput, pwdError, 'Please create a password.');
      isValid = false;
    } else if (pwdValue.length < 6) {
      showError(pwdInput, pwdError, 'Password must be at least 6 characters.');
      isValid = false;
    }

    // 5. Validate Confirm Password
    const confirmPwdValue = confirmPwdInput.value.trim();
    if (confirmPwdValue === '') {
      showError(confirmPwdInput, confirmPwdError, 'Please confirm your password.');
      isValid = false;
    } else if (confirmPwdValue !== pwdValue) {
      showError(confirmPwdInput, confirmPwdError, 'Passwords do not match.');
      isValid = false;
    }

    // 6. FINAL CHECK: Only show the success loader if NO errors were found
  // 6. FINAL CHECK: Only show the success loader if NO errors were found
    if (isValid === true) {
      loaderModal.classList.remove('hidden');
      
      // SAVE TO LOCAL STORAGE (Acts like a mini database)
      localStorage.setItem('registeredEmail', emailValue);
      localStorage.setItem('registeredPassword', pwdValue);
      
      // Simulate network request (removes loader after 2 seconds)
      setTimeout(() => {
        loaderModal.classList.add('hidden');
        
        // Redirect directly to the login page (index.html)
        window.location.href = './index.html'; 
      }, 2000);
    }
  });

  // Handle Password Visibility Toggles (Eye icon)
  const toggleBtns = document.querySelectorAll('.toggle-password');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Find the input field right before this button
      const input = this.previousElementSibling;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
    });
  });
});