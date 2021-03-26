const baseURL = "https://backend-test-js-eovio.ondigitalocean.app/";

const signUpForm = document.forms.signup;
const loginForm = document.forms.login;
const addCourseForm = document.forms.addcourse;
const notification = document.querySelector("div.notification>span");
const closeButton = document.getElementById("close-button");
const signUpButton = document.getElementById("signup-button");
const signUpButton2 = document.getElementById("signup-button2");
const loginButton = document.getElementById("login-button");
const coursesButton = document.getElementById("courses-button");
const logoutButton = document.getElementById("logout-button");

function showMsg(msg) {
    const notification = document.querySelector("div.notification>span");
    notification.textContent = msg;
    notification.parentNode.style.display = "block";
}

if (closeButton) {
    closeButton.addEventListener("click", () => notification.parentNode.style.display = "none");
}
if (signUpButton) {
    signUpButton.addEventListener("click", () => window.location.href = "signup.html");
}
if (signUpButton2) {
    signUpButton2.addEventListener("click", () => window.location.href = "signup.html");
}
if (loginButton) {
    loginButton.addEventListener("click", () => window.location.href = "login.html");
}
if (coursesButton) {
    coursesButton.addEventListener("click", () => window.location.href = "courses.html");
}
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("id");
        showMsg("You have been logged out.");
        setTimeout(()=>{window.location.replace("login.html")}, 2000);
    });   
}

if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = signUpForm.elements.email.value.trim();
        const password = signUpForm.elements.password.value.trim();
        fetch(baseURL + "register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status.toLowerCase().includes("ok")) {
                showMsg("You have been registered.");
                setTimeout(()=>{window.location.replace("login.html")}, 2000);
            } 
            else {
                showMsg(data.status);
            }
        })
       
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const email = loginForm.elements.email.value.trim();
        const password = loginForm.elements.password.value.trim();
        fetch(baseURL + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status.toLowerCase().includes("ok")) {
                showMsg("You have been logged in.");
                localStorage.setItem("id", data.id);
                setTimeout(()=>{window.location.replace("courses.html")}, 2000);
            } 
            else {
                showMsg(data.status);
            }
        })
    });
}

if (addCourseForm) {
    const userid = localStorage.getItem("id");
    if (!userid) {
        showMsg("Please log in.");
        setTimeout(()=>{window.location.replace("login.html")}, 2000);
    }
    addCourseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = addCourseForm.elements.title.value.trim();
        const image = addCourseForm.elements.image.value.trim();
        const price = {};
        price.old = addCourseForm.elements.oldprice.value;
        price.new = addCourseForm.elements.newprice.value; 
        const length = addCourseForm.elements.duration.value;
        const params = {};
        params.game = addCourseForm.elements.game.checked;
        params.beginner = addCourseForm.elements.beginner.checked;
        params.cc = addCourseForm.elements.cc.checked;
        fetch(baseURL + "add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userid, title, image, price, length, params}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status.toLowerCase().includes("ok")) {
                showMsg("You course has been added.");
                addCourseForm.elements.title.value = "";
                addCourseForm.elements.image.value = "";
                addCourseForm.elements.oldprice.value = "";
                addCourseForm.elements.newprice.value = "";
                addCourseForm.elements.length.value = "";
                addCourseForm.elements.game.checked = false;
                addCourseForm.elements.beginner.checked = false;
                addCourseForm.elements.cc.checked = false;
            } 
            else {
                showMsg(data.status);
            }
        })
    });
}

