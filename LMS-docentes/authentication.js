var formIngresoUsuario = document.getElementById('formIngresoUsuario');

var idDropdown = document.getElementById('idDropdown');
var btnLogOut = document.getElementById('bntLogOut');

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
        if (password.length < 4) {
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

    firebase.auth().onAuthStateChanged(function(user) {    
        if (user) {
            console.log('User is signed in');
            document.getElementById('dropdown1Text').textContent = user.email;
            idDropdown.setAttribute('style', '');
            // btnLogOut.disabled = false;
            location.href = 'listaDocentes.html';
        } else {
            console.log('User is signed out');
            document.getElementById('dropdown1Text').textContent = 'Usuario';
            idDropdown.setAttribute('style', 'display:none;');
            // btnLogOut.disabled = true;
               
        }
    });

    //
    formIngresoUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        logInUser();
    });

    //
    btnLogOut.addEventListener('click', (e) => {
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
             // Sign-out successful.
            }).catch(function(error) {
            // An error happened.
        });
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