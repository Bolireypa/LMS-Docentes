// DB firestore
const db = firebase.firestore();

// Variable formRegistroUsuario que captura el formulario de registro de usuarios
var formRegistroUsuario = document.getElementById('formRegistroUsuario');

// Funcion registrarUsuario() que captura los datos de usuario del formulario de registro y os guarda en Firebase auth
function registrarUsuraio() {
    // Se capturan los datos del formulario de registro de usuario como el nombre, email y contraseña
    var name = formRegistroUsuario['usuarioNombre'].value;
    var email = formRegistroUsuario['usuarioEmail'].value;
    var password = formRegistroUsuario['usuarioPassword'].value;

    // Se comprueba que el email y la contraseña sean validas
    if (email.length < 4) {
        console.log('Please enter an email address.');
        return;
    }
    if (password.length < 8) {
        console.log('Please enter a password.');
        return;
    }

    // Se utiliza una funcion de firebase para la creacion de usuario que requiere el email y la contraseña, si se registro correctamente se logea automaticamente al sistema
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        console.log('Usuario registrado correctamente');
        
        // Variable user que guarda al usuario actual luego de ser registrado
        var user = firebase.auth().currentUser;

        // Se realiza la actualizacion de los datos del usuario añadiendo su nombre, luego se guardan sus datos como el nombre, el tipo de rol, la id que lo vincula con su cuentea y un campo para su habilitacion / deshabilitacion del sistema, en la coleccion 'lms-roles'
        user.updateProfile({
            displayName: name,
            // photoURL: "https://example.com/jane-q-user/profile.jpg" // Se guarda la imagen de usuario añadiendo una url de imagen
        }).then(async function() {
            console.log('Nombre añadido a la cuenta de usuario',user.uid);
            await registerUser(name, 'Lector', user.uid, false);
        }).catch(function(error) {
            console.log(error);
            
        });
        
    }).catch(function(error) {
        // En caso de algun error se muestran los mensajes de error
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);

    });
}

// Funcion registerUser() que realiza el registro de los roles de usuarios en la coleccion 'lms-roles', requiere de los parametros: userName (nombre del usuario), rolName (nombre de rol: Administrador, Editos, Lector, valor por defecto: 'Lector'), idUser (usuario al que se asignara un rol dentro del sistema), userEnable (campo de tipo boolean, utilizado para la habilitacion / deshabilitacion del usuario, valor por defecto: false)
const registerUser = (userName, rolName, idUser, userEnable) =>
    db.collection('lms-roles').add({
        userName,
        rolName,
        idUser,
        userEnable,
    }).then(function(rolData) {
        // Si se registro correctamente al usuario se redirecciona al usuario a la ubicacion deshabilitado.html
        console.log("Rol de usuario registrado correctamente ",rolData.id);
        location.href = 'deshabilitado.html';

    }).catch(function(error) {
        console.error("No se pudo registrar correctamente al docente: ", error);
    });

function initApp() {
    // Funcion que se ejecuta cuando se realice un evento 'submit' en el formulario de registro
    formRegistroUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        // Se ejecuta la funcion registrarUsuario() que guarda los datos de usuario en firebase
        registrarUsuraio();
    });   
}

window.onload = function () {
    initApp();
};