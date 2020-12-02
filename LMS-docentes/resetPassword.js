// Se captura el formulario que tiene el campo para ingresar el correo electronico del usuario
var formResetPassword = document.getElementById('formResetPassword');

// Funcion que se ejecuta en el evento 'submit' del formulario para el restablecimiento de contraseña
formResetPassword.addEventListener('submit', (e) => {
    // Evita que el formulario se recargue despues del evento 'submit'
    e.preventDefault();

    var auth = firebase.auth();
    var email = document.getElementById('usuarioEmail').value;
    
    // Si el correo electronico es menor a 8 caracteres, entonces se alerta al usuario que no es un correo electronico valido
    if (email < 8) {
        window.alert('Coloque una email valida');
    } else {
        // Se ejecuta la funcion sendPasswordResetEmail() de firebase que requiere el email del usuario, que envia un correo electronico con el link para el restablecimiento de la contraseña, y comprueba que la contraseña sea correcta o este registrada
        auth.sendPasswordResetEmail(email).then(function () {
            window.alert('Correo electronico enviado')
        }).catch(function (error) {
            // En case de algun error, se alerta al usuario del error
            if (error.code == "auth/user-not-found") {
                alert('Este correo electronico no esta registrado, o fue eliminado')
            }
            console.log(error);
            
        })
    }    
})