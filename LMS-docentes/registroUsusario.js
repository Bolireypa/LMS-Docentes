var formRegistroUsuario = document.getElementById('formRegistroUsuario');

var btnLogOut = document.getElementById('btnLogOut');

//
function registrarUsuraio() {
    var email = formRegistroUsuario['usuarioEmail'].value;
    var password = formRegistroUsuario['usuarioPassword'].value;
    console.log(email,password);
    if (email.length < 4) {
        console.log('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        console.log('Please enter a password.');
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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

//
function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {    
        if (user) {
            console.log('User is signed in');
            btnLogOut.setAttribute('style', '');
            // btnLogOut.disabled = false;
        } else {
            console.log('User is signed out');
            btnLogOut.setAttribute('style', 'display:none;');
            // btnLogOut.disabled = true;
               
        }
    });

    //
    formRegistroUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        registrarUsuraio();
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
window.onload = function () {
    initApp();
};