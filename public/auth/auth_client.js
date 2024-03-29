
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

function clearRegisterForm() {
    document.getElementById('txtFirstName').value = "";
    document.getElementById('txtLastName').value = "";
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById('confirm_password').value = "";
}
