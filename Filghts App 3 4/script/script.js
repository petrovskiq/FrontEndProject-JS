$(document).ready(() => {
    //Hardcoded users in object to show login validation
    let Users = [{
            username: "petrovskim",
            password: "mmm"
        },
        {
            username: "kostovd",
            password: "ddd"
        },
        {
            username: "todorovskig",
            password: "ggg"
        }

    ]

    let loginBtn = $("#main-login-btn")
    let usernameLoginInput = $("#main-username-login-input")

    let passwordLoginInput = $("#main-password-login-input")

    //Login validation logic
    loginBtn.on("click", (e) => {
        e.preventDefault();
        let loggedIn = false;
        for (let user of Users) {
            if (user.username === usernameLoginInput.val()) {
                if (user.password === passwordLoginInput.val()) {
                    loggedIn = true;
                    location.href = "flightsHotels.html"
                }
            }
        }
        if (!loggedIn) {
            $("body").append("<p>Incorrect Username or Password</p>")
        }
    })

    $("#register")


})