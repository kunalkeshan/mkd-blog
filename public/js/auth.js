/**
 * Authentication Page Scripts
 */

// Common Func
import { successModal, errorModal } from './common.js';

// Dom elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const toggleBtns = document.querySelectorAll(".toggle-btn");

const PASSWORD_REGEX = /^(?=.*[A-Z]{1,})(?=.*[!@#$&*])(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,}$/
const REDIRECT_DELAY = 3000; // 3 seconds
let currentSection = 'login';

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
    const { user, password_login } = loginForm;
    try {
        if (user.value.length < 8) {
            errorModal.open('Invalid input', 'Username should me minimum 8 characters long!');
            user.focus();
            return;
        }
        const data = {
            user: user.value,
            password: password_login.value,
        };
        const response = await axios.post('/api/author/login', data);
        if (response.status >= 200) {
            const { user } = response.data.data;
            localStorage.setItem('user', JSON.stringify(user));
            successModal.open('Login successful', 'Redirecting you to your home page shortly');
            setTimeout(() => {
                window.location.href = '/home';
            }, REDIRECT_DELAY);
        }
    } catch (error) {
        errorModal.open('Unable to login!', 'Check username and password are entered correctly!');
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password } = registerForm;
    try {
        if (username.value.length < 8) {
            errorModal.open('Invalid Username', 'Username should be a minimum of 8 characters')
            username.focus();
        } else if (PASSWORD_REGEX.test(password.value.length)) {
            errorModal.open('Invalid Password', 'Password should have minimum 1 upper case, 1 lower case, 1 number and 1 symbol!')
            password.focus();
        } else {
            const data = {
                fullName: fullName.value,
                username: username.value,
                password: password.value,
                email: email.value,
            }
            const response = await axios.post('/api/author/register', data);
            if (response.status >= 200) {
                const { user } = response.data.data;
                localStorage.setItem('user', JSON.stringify(user));
                successModal.open('Login successful', 'Redirecting you to your home page shortly');
                setTimeout(() => {
                    window.location.href = '/home';
                }, REDIRECT_DELAY);
            }
        }
    } catch (error) {
        errorModal.open('Unable to register!', 'An account with the given details might already exist!');
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
