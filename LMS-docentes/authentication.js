// Se inicializa firestore
const db = firebase.firestore();

// Se captura el formulario de login
var formIngresoUsuario = document.getElementById('formIngresoUsuario');

// Variable que guarda el estado de un usuario para verificar si el usuario esta habilitado para ingresar a la aplicacion o no
var userEnable = false;

// Funcion logInUser() que realiza el proceso de login a la aplicacion 
function logInUser() {
    // Se verifica si hay un usuario autenticado
    if (firebase.auth().currentUser) {

      } else {
        // Se capturan los valores de email y contraseña del formulario de login
        var email = formIngresoUsuario['usuarioEmail'].value;
        var password = formIngresoUsuario['usuarioPassword'].value;
        // Se conprueba que los datos de email y contraseña sean validos
        if (email.length < 4) {
            alert('Por favor ingrese un email válido.');
            return;
        }
        if (password.length < 8) {
            alert('La contraseña debe ser de 8 caracteres mínimo.');
            return;
        }

        // Se inicia el login con los datos de email y contraseña capturados previamente
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            console.log('Log in correcto');
            // location.href='registroDocentes.html';
            
        }).catch(function(error) {
            // En caso de algun error se realiza el manejo de errores.
            var errorCode = error.code;
            // var errorMessage = error.message;

            // Codigos de error de firebase
            switch (errorCode) {
                case 'auth/wrong-password':
                    alert('Contraseña incorrecta.');
                    
                    break;

                case 'auth/user-not-found':
                    alert('Usuario no encontrado.');

                    break;
            
                case 'auth/invalid-email':
                    alert('Email inválido')
                    break;

                case 'auth/network-request-failed':
                    alert('Ocurrio un error de red')
                    break;

                default:
                    break;
            }
            console.log(error);
        });
    }
}

// Funcion initApp() que se ejecuta al cargar la pagina
function initApp() {
    // Se realiza el proceso de verificacion de autenticacion, si hay un usuario autenticado se verifica que ese usuario este habilitado
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            console.log('User is signed in');
            // Se realiza una consulta a la coleccion 'lms-roles' para obtener el estado del usuario que se autentico
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    userEnable = doc1.data().userEnable;
                });                
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            // Se verifica que el usuario este habilito para rediccionarlo a la pagina 'listaDocentes.html', caso contrario no lo deja ingresar al sistema
            if (userEnable == true) {
                location.href = 'listaDocentes.html';
                
            }else{
                location.href = 'deshabilitado.html';
            }
        } else {
            console.log('User is signed out');
        }
    });

    // Se asigna el evento 'submit' al formulario de login, que ejecuta la funcion logInUser() para la autenticacion
    formIngresoUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        logInUser();
    });

}

window.addEventListener('DOMContentLoaded', async (e) => {
    initApp();
})