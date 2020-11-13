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
            console.log('Please enter an email address.');
            return;
        }
        if (password.length < 8) {
            console.log('Please enter a password.');
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
            if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
            } else {
            alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
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