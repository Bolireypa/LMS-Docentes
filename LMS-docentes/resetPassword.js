var formResetPassword = document.getElementById('formResetPassword');

formResetPassword.addEventListener('submit', (e) => {
    e.preventDefault();

    var auth = firebase.auth();
    var email = document.getElementById('usuarioEmail').value;
    
    if (email < 8) {
        window.alert('Coloque una email valida');
    } else {
        auth.sendPasswordResetEmail(email).then(function () {
            window.alert('Correo electronico enviado')
        }).catch(function (error) {
            console.log(error);
            
        })
    }

    console.log(email);
    
})