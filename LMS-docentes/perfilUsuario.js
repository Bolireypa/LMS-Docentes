// Variable btnLogOut que captura el boton 'Ver perfil' para mostrar los datos del usuario
var btnUserProfile = document.getElementById('btnUserProfile');

// Variable que captura el elemento del menu responsivo de la barra de navegacion en moviles utilizado para mostrar el perfil de usuario
var idUserProfile = document.getElementById('idUserProfile');

// Variable que captura el elemento <input> de nombre de usuario del formulario de perfil de usuario
var userName = document.getElementById('userName');

var labelUserName = document.getElementById('labelUserName');

// Variable que captura el elemento <input> de nombre de usuario del formulario de perfil de usuario
var userEmail = document.getElementById('userEmail');

var labelUserEmail = document.getElementById('labelUserEmail');

// Variable que captura el elemento <input> de nombre de usuario del formulario de perfil de usuario
var userPassword = document.getElementById('userPassword');

var modalProfileTitle = document.getElementById('modalProfileTitle');

var formUserProfile = document.getElementById('formUserProfile');

// Variable que guarda los datos del ususario con sesion activa
var currentUser = '';

const updateUserProfile = (id, updatedUser) => db.collection('lms-roles').doc(id).update(updatedUser).then(async function() {
        
    console.log("Document successfully updated!");
    // usersTable();
    $('#modalProfile').modal('close');

}).catch(function(error) {
    console.error("Error updating document: ", error);
});

function userProfileInit() {
    firebase.auth().onAuthStateChanged(async function(user) {  
        currentUser = user;
    });

    idUserProfile.addEventListener('click', (e) => {
        profileView();
    });
    
    btnUserProfile.addEventListener('click', (e) => {
        profileView();
    });

    formUserProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUser.updateProfile({
            displayName: userName.value,
            email: userEmail.value,
            // photoURL: "https://example.com/jane-q-user/profile.jpg" // Se guarda la imagen de usuario añadiendo una url de imagen
        }).then(async function() {
            console.log('Nombre de usuario modificado correctamente',currentUser.uid);
            var userId = '';           
            db.collection("lms-roles").where("idUser", "==", currentUser.uid)
            .get()
            .then(async function(querySnapshot) {
                querySnapshot.forEach(function(userDoc) {
                    console.log(userDoc.data());
                    userId = userDoc.id;
                });
                await updateUserProfile(userId, {
                    userName: userName.value,
                });
            })
            .catch(function (error) {
                console.log(error);
                
            });
            
        }).catch(function(error) {
            console.log(error);
            
        });
        console.log(userName.value, userEmail.value);
        
    })
}

function profileView() {
    console.log(currentUser);
    modalProfileTitle.textContent = 'Perfil de '+currentUser.displayName;
    userName.value = currentUser.displayName;
    userEmail.value = currentUser.email;
    labelUserName.setAttribute('class', 'active');
    labelUserEmail.setAttribute('class', 'active');
    $('#modalProfile').modal('open');  
}

userProfileInit();
