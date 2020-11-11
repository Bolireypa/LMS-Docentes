// DB firestore
const db = firebase.firestore();

// Variable formRegistroUsuario que captura el formulario de registro de usuarios
var formRegistroUsuario = document.getElementById('formRegistroUsuario');

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
// var btnLogOut = document.getElementById('btnLogOut');

// Variable idDropdown que captura el dropdown de usuario
// var idDropdown = document.getElementById('idDropdown');

// Funcion registrarUsuario() que captura los datos de usuario del formulario de registro y os guarda en Firebase auth
function registrarUsuraio() {
    // Se capturan los datos del formulario de registro de usuario como el nombre, email y contraseña
    var name = formRegistroUsuario['usuarioNombre'].value;
    var email = formRegistroUsuario['usuarioEmail'].value;
    var password = formRegistroUsuario['usuarioPassword'].value;

    if (email.length < 4) {
        console.log('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        console.log('Please enter a password.');
        return;
    }

    // Se utiliza una funcion de firebase para la creacion de usuario que requiere el email y la contraseña, si se registro correctamente se logea automaticamente al sistema
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        console.log('Usuario registrado correctamente');
        
        // Variable user que guarda al usuario actual luego de ser registrado
        var user = firebase.auth().currentUser;

        // Se realiza la actualizacion de los datos del usuario añadiendo su nombre y guardandolo
        user.updateProfile({
            displayName: name,
            // photoURL: "https://example.com/jane-q-user/profile.jpg" // Se guarda la imagen de usuario añadiendo una url de imagen
        }).then(function() {
            console.log('Nombre añadido a la cuenta de usuario',user.uid);
            registerUser(name, 'Lector', user.uid);
        }).catch(function(error) {
            console.log(error);
            
        });
        
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
}

// Funcion registerUser() que realiza el registro de los roles de usuarios en la coleccion 'lms-roles', requiere de los parametros: rolName (nombre de rol: Administrador, Editos, Lector), idUser (usuario al que se asignara un rol dentro del sistema)
const registerUser = (userName, rolName, idUser) =>
    db.collection('lms-roles').add({
        userName,
        rolName,
        idUser,
    }).then(function(rolData) {
        console.log("Rol de usuario registrado correctamente ",rolData.id);

    }).catch(function(error) {
        console.error("No se pudo registrar correctamente al docente: ", error);
    });

function initApp() {

    // Funcion que comprueba si un usuario esta autenticado
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            // document.getElementById('dropdown1Text').textContent = user.displayName;
            // idDropdown.setAttribute('style', '');
            var userRol = '';
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                });                
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            console.log('User is signed in', user.displayName, userRol);
            
            // btnLogOut.setAttribute('style', '');
            // btnLogOut.disabled = false;
        } else {
            // document.getElementById('dropdown1Text').textContent = 'Usuario';
            // idDropdown.setAttribute('style', 'display:none;');
            
            console.log('User is signed out');
            // btnLogOut.setAttribute('style', 'display:none;');
            // btnLogOut.disabled = true;
               
        }
    });

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