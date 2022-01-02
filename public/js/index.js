const registerForm = document.getElementById("register");
const loginForm = document.getElementById("login");


document.addEventListener("DOMContetLoaded", () => {
    registerForm.addEventListener("submit", async () => {
        
    })
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const username = loginForm.getElementById("username");
        const password = loginForm.getElementById("password");
    
        try {
            axios.post("/login", {username, password});
        } catch (error) {
            console.log(error)
        }
    })

})