/**
 * Authentication Page Scripts
 */

// Dom elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const toggleBtns = document.querySelectorAll(".toggle-btn");

let currentSection = 'login';

const resetErrorState = () => {

};

const handleSectionSwitch = () => {
    if (currentSection === 'login') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        currentSection = 'register';
    } else {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        currentSection = 'login'
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    const { user, password } = loginForm;
    try {
        const body = {
            user: user.value,
            password: password.value,
        };
        const response = await fetch('/api/author/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (response.status >= 400) throw new Error(response);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password } = registerForm;
    try {
        const body = {
            fullName: fullName.value,
            username: username.value,
            password: password.value,
            email: email.value,
        }
        const response = await fetch('/api/author/register', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (response.status >= 400) throw new Error(response);
        const data = await response.json();
    } catch (error) {
        console.log(error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Hide Register Form by default
    registerForm.style.display = 'none';

    // Toggle section functionality
    toggleBtns.forEach(btn => btn.addEventListener('click', handleSectionSwitch));

    // Form event handlers
    registerForm.addEventListener('submit', handleRegister);
    loginForm.addEventListener('submit', handleLogin)
})
