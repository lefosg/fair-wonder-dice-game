
async function login() {
    //get username and password from form
    let uname = document.getElementById('username').value;
    let pword = document.getElementById('password').value;

    //send credentials to server
    const response = await fetch('https://localhost:8443/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: uname,
            password: pword
        })
    });

    //the user should be redirected once authenticated
    const r = await response.json();
    console.log(r);
}

function register() {
    //get user info from form
    let fname = document.getElementById('txtFirstName').value;
    let lname = document.getElementById('txtLastName').value;
    let uname = document.getElementById('username').value;
    let pword = document.getElementById('password').value;
    let pword_conf = document.getElementById('confirm_password').value;

    //send credentials to server
    fetch('https://localhost:8443/auth/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            first_name: fname,
            last_name: lname,
            username: uname,
            password: pword,
            confirmed_password: pword_conf
        })
    });
}

var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function show_login() {
    x.style.left = "4px";
    y.style.right = "-520px";
    a.className += " white-btn";
    b.className = "btn";
    x.style.opacity = 1;
    y.style.opacity = 0;
}

function show_register() {
    x.style.left = "-510px";
    y.style.right = "5px";
    a.className = "btn";
    b.className += " white-btn";
    x.style.opacity = 0;
    y.style.opacity = 1;
}

function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if (i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
}