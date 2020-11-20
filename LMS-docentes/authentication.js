// DB firestore
const db = firebase.firestore();

var formIngresoUsuario = document.getElementById('formIngresoUsuario');

var userEnable = false;

//
function logInUser() {
    if (firebase.auth().currentUser) {
        // [START signout]
        // firebase.auth().signOut();
        // [END signout]
      } else {

        var email = formIngresoUsuario['usuarioEmail'].value;
        var password = formIngresoUsuario['usuarioPassword'].value;
        console.log(email,password);
        if (email.length < 4) {
            alert('Por favor ingrese un email válido.');
            return;
        }
        if (password.length < 8) {
            alert('La contraseña debe ser de 8 caracteres mínimo.');
            return;
        }

        //
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            console.log('Log in correcto');
            // location.href='registroDocentes.html';
            
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]

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
            // if (errorCode === 'auth/wrong-password') {
            // alert('Contraseña incorrecta.');
            // } else {
            // alert(errorMessage);
            // }
            console.log(error);
            // document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
    }
}

//
function initApp() {

    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            console.log('User is signed in');
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
            if (userEnable == true) {
                location.href = 'listaDocentes.html';
                
            }else{
                location.href = 'deshabilitado.html';
            }
        } else {
            console.log('User is signed out');
            
               
        }
    });

    //
    formIngresoUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        logInUser();
    });

}

//
// window.onload = function () {
//     initApp();
// };

window.addEventListener('DOMContentLoaded', async (e) => {
    // $(".dropdown-trigger").dropdown();
    initApp();

})