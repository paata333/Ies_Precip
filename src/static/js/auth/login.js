function showLoginError(message) {
    showAlert('alertPlaceholder', 'danger', message || 'ავტორიზაცია ვერ მოხერხდა.');
}

async function readLoginResponse(response) {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    return {};
}

function login(event) {
    event.preventDefault();  // Prevent the form from submitting

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitButton = event.target.querySelector('button[type="submit"]');

    // Create a JSON object with the form values
    const formData = {
        email: email,
        password: password
    };

    submitButton.disabled = true;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await readLoginResponse(response);

        if (!response.ok) {
            throw new Error(data.error || data.message || 'სერვერთან დაკავშირება ვერ მოხერხდა.');
        }

        return data;
    })
    .then(data => {
        if (data.access_token) {
            // JWT ტოკენების შენახვა localStorage-ში
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user_email', email);

            // Redirect to /projects page
            window.location.href = '/filter';
        } else {
            showLoginError(data.error || 'გაუმართავი ავტორიზაცია.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showLoginError(error.message);
    })
    .finally(() => {
        submitButton.disabled = false;
    });
}

// Attach the login function to the form's submit event
document.getElementById('loginForm').onsubmit = login;
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const togglePasswordImg = document.getElementById('togglePasswordImg');

const eyeViewPath = "static/img/eye-view.svg";
const eyehidePath = "static/img/eye-hide.svg";

togglePassword.addEventListener('click', (e) => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);

    if (togglePasswordImg.src.includes(eyeViewPath)) {
        togglePasswordImg.src = eyehidePath;
    } else{
        togglePasswordImg.src = eyeViewPath;
    }

});
