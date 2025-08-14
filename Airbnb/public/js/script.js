// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()



// Dark Mode Toggle
const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;
const icon = toggleBtn?.querySelector('i');

// Check for saved preference
if (localStorage.getItem('darkMode') === 'enabled') {
  enableDarkMode();
}

// Toggle function
function enableDarkMode() {
  body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  if (icon) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

function disableDarkMode() {
  body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', 'disabled');
  if (icon) {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

// Toggle on click
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
}