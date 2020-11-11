//
const db = firebase.firestore();

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');

//
var idListaUsuarios = document.getElementById('idListaUsuarios');
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');
var idRegistrarseBtn = document.getElementById('idRegistrarseBtn');
var idLogin = document.getElementById('idLogin');

// Funcion getUsers() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getUsers = () => db.collection('lms-roles').get();

const updateUser = (id, updatedUser) => db.collection('lms-roles').doc(id).update(updatedUser).then(async function() {
        
        console.log("Document successfully updated!");
        usersTable();
        $('.modal').modal('close');

    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

    

// Funcion usersTable() que llena la tabla de usuarios mediante una consulta a la coleccion 'lms-roles'
usersTable = async function () {
    // Se ejecuta la funcion getUsers(), y se guarda el resultado en la variable lmsUsers
    const lmsUsers = await getUsers();

    // Se obtiene el lugar donde seran mostrados los datos de los usuarios
    var tableId = document.getElementById('usersTableBody');

    var newTableBody = document.createElement('tbody');
    newTableBody.id = 'usersTableBody';

    var userTable = document.getElementById('table');

    userTable.replaceChild(newTableBody, tableId);

    // Se realiza la funcion forEach que crea las filas en la tabla con los datos de los usuarios, para luego colocarlos en el elemento <tbody> con su id: userTableBody
    lmsUsers.forEach(user => {
        var userData = user.data();
        var tableRow = document.createElement('tr');
        var tableElement1 = document.createElement('td');
        tableElement1.textContent = userData.userName;
        var tableElement2 = document.createElement('td');
        tableElement2.textContent = userData.rolName;
        var tableElement3 = document.createElement('td');
        var editRolBtn = document.createElement('a');
        editRolBtn.className = 'btn modal-trigger';
        editRolBtn.href = '#modal1';
        editRolBtn.textContent = 'Cambiar rol';
        editRolBtn.onclick = function () {
            console.log(user.id);
            var editRolUserSelect = document.getElementById('selectUserRol');
            editRolUserSelect.value = userData.rolName;

            $('select').formSelect();

            var saveUserRolBtn = document.getElementById('saveRolBtn');
            saveUserRolBtn.onclick = async function () {
                console.log(user.id, editRolUserSelect.value);
                await updateUser(user.id, {
                    rolName: editRolUserSelect.value,
                });
            }

        }
        tableElement3.appendChild(editRolBtn);
        tableRow.appendChild(tableElement1);
        tableRow.appendChild(tableElement2);
        tableRow.appendChild(tableElement3);
        newTableBody.appendChild(tableRow);
    });
}

// Funcion initApp() utilizada para verificar si un usuario esta autenticado
function initApp() {
    // var state;
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            document.getElementById('dropdown1Text').textContent = user.displayName;
            idDropdown.setAttribute('style', '');
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

            if (userRol!='Administrador') {
                location.href = 'listaDocentes.html'
            } else {
                idRegistrarDocenteBtn.setAttribute('style', '');
                idListaDocentesBtn.setAttribute('style', '');
                        
            }
            
        } else {
            console.log('User is signed out');
            
            location.href = 'login.html';
        }
    });

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
    // return state;
}

// Funcion que se ejecuta mediante el evento 'DOMContentLoaded' (el documento listaUsuarios.html a sido cargado)
window.addEventListener('DOMContentLoaded', (e) => {
    initApp();
    // Se ejecuta la funcion userTable(), al momento de ser cargada la pagina
    usersTable();
    

    // Inicializa el modal para mostrase despues de presionar el boton 'Cambiar rol'
    $('.modal').modal();
})