const baseURL = "https://backend-test-js-eovio.ondigitalocean.app/";

let dataArr = [];

const signUpForm = document.forms.signup;
const loginForm = document.forms.login;
const addCourseForm = document.forms.addcourse;
const titleSearchForm = document.forms.titlesearch;
const notification = document.querySelector("div.notification>span");
const closeButton = document.getElementById("close-button");
const signUpButton = document.getElementById("signup-button");
const signUpButton2 = document.getElementById("signup-button2");
const loginButton = document.getElementById("login-button");
const coursesButton = document.getElementById("courses-button");
const addButton = document.getElementById("add-button");
const logoutButton = document.getElementById("logout-button");
const downButton = document.getElementById("down-button");
const allCoursesButton = document.getElementById("all-courses-button");

function showMsg(msg) {
    const notification = document.querySelector("div.notification>span");
    notification.textContent = msg;
    notification.parentNode.style.display = "block";
}

function coursesHTML(data, cardsWrapper) {
    let html = "";
    data.forEach(item => {
        const game = item.parameters.game ? '<span><img src="img/gamepad2.png"></span>' : '';
        const beginner = item.parameters.beginner ? '<span>Beginner</span>' : '';
        const cc = item.parameters.cc ? '<span>CC</span>' : '';
        const hours = Math.floor(item.parameters.vidlength/60);
        const minutes = item.parameters.vidlength%60;
        const vidlength = '<span>' + hours + ':' + (minutes > 9 ? minutes : '0' + minutes) + '</span>'
        html += `
        <div class="card">
            <div class="img-bkg" style="background: url(${item.url}); background-size: cover;"></div>
            <h2>${item.title}</h2>
            <div class="info">
                ${game}
                ${vidlength}
                ${beginner}
                ${cc}
            </div>
            <div class="price-details">
                <span>&euro;${item.oldprice}</span>
                <span>&euro;${item.newprice}</span>
            </div>
        </div>
        `;
    });
    cardsWrapper.innerHTML = html;
}

function loggedInRedir() {
    const userid = localStorage.getItem("id");
    if (userid) {
        showMsg("You are already logged-in. Redirecting to dashboard.");
        setTimeout(()=>{window.location.replace("courses.html")}, 2000);
    }
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
if (addButton) {
    addButton.addEventListener("click", () => window.location.href = "addcourse.html");
}
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("id");
        showMsg("You have been logged out.");
        setTimeout(()=>{window.location.replace("login.html")}, 2000);
    });   
}

if (downButton) {
    downButton.addEventListener("click", () => {
        const titleWrapper = document.getElementById("title_wrapper");
        titleWrapper.scrollIntoView(true);
    });
}

if (signUpForm) {
    loggedInRedir();
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
    loggedInRedir();
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

if (document.body.getAttribute("id") == "courses") {
    const userid = localStorage.getItem("id");
    if (!userid) {
        showMsg("Please log in.");
        setTimeout(()=>{window.location.replace("login.html")}, 2000);
    }
    const cardsWrapper = document.getElementById("cards-wrapper");
    fetch(baseURL + "getsome/" + userid)
    .then((res) => res.json())
    .then((data) => {
        if (data.length > 0) {
            dataArr = data;
            coursesHTML(data, cardsWrapper);
        } 
        else {
            showMsg("Loading of cources failed.");
        }
    });  
}

if (titleSearchForm) {
    const cardsWrapper = document.getElementById("cards-wrapper");
    let courses = [];
    titleSearchForm.elements.title.addEventListener("keyup", (e) => {
        let titlestring = titleSearchForm.elements.title.value.toLowerCase();
        courses = dataArr.filter(item => item.title.toLowerCase().indexOf(titlestring) != -1);
        coursesHTML(courses, cardsWrapper);
    }); 
}

if (allCoursesButton) {
    const userid = localStorage.getItem("id");
    if (!userid) {
        showMsg("Please log in.");
        setTimeout(()=>{window.location.replace("login.html")}, 2000);
    }
    const cardsWrapper = document.getElementById("cards-wrapper");
    allCoursesButton.addEventListener("click", () => {
        fetch(baseURL + "getall/" + userid)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                dataArr = data;
                coursesHTML(data, cardsWrapper);
            } 
            else {
                showMsg("Loading of cources failed.");
            }
        });
    });
}