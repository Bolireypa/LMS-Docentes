// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');

// Funcion initApp() utilizada para verificar si un usuario esta autenticado
function initApp() {
    // var state;
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            if(user.displayName){
                console.log(user.displayName);
                document.getElementById('dropdown1Text').textContent = user.displayName;
                
            }else{
                console.log('Notiene nombre de usuario');
                document.getElementById('dropdown1Text').textContent = "Usuario";
                
            }
            
            // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout
            btnLogOut.addEventListener('click', (e) => {

                // Se ejecuta la funcion signOut() de firebase para el logout del usuario
                firebase.auth().signOut().then(function() {
                    console.log('Log out successful');
                    // Sign-out successful.
                    }).catch(function(error) {
                    // An error happened.
                });
            });
            // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout
            idLogoutBtnMovil.addEventListener('click', (e) => {

                // Se ejecuta la funcion signOut() de firebase para el logout del usuario
                firebase.auth().signOut().then(function() {
                    console.log('Log out successful');
                    // Sign-out successful.
                    }).catch(function(error) {
                    // An error happened.
                });
            });
        } else {
            console.log('User is signed out');
            
            location.href = 'index.html';
        }
    });
}

// Funcion que se ejecuta mediante el evento 'DOMContentLoaded' (el documento listaUsuarios.html a sido cargado)
window.addEventListener('DOMContentLoaded', (e) => {
    initApp();
})