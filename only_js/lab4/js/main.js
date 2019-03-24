$(function () {
    let email_validate = false;
    let password_validate = false;
    $("#id_email").change(function () {
        let email = $(this).val();
        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/)) {
            $(this).css("box-shadow", "0 0 0 0.2rem rgba(0,123,255,.75)");  // .25
            $(this).next().hide();
            email_validate = true;
        } else if (email === "") {
            $(this).css("box-shadow", "none");
            $(this).next().text("Please enter your email address.");
        } else {
            $(this).css("box-shadow", "0 0 0 0.2rem rgba(255,0,0,.75)");
            $(this).next().show().text("Invalid email.");
        }
    });
    $("#id_password").change(function () {
        let password = $(this).val();
        if (password.match(/^[A-Za-z0-9#$^+=!*()@%&]{8,}$/)) {
            $(this).css("box-shadow", "0 0 0 0.2rem rgba(0,123,255,.75)");  // .25
            $(this).next().hide();
            password_validate = true;
        } else if (password === "") {
            $(this).css("box-shadow", "none");
            $(this).next().text("Please enter your password.");
        } else {
            $(this).css("box-shadow", "0 0 0 0.2rem rgba(255,0,0,.75)");
            $(this).next().show().text("Invalid password.");

        }
    });
    $("#id_button").click(function () {
        if (email_validate && password_validate) {
            console.log(`email: ${$("#id_email").val()}; password: ${$("#id_password").val()}`);
        }
    });
});
