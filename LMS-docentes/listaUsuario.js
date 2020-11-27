//
const db = firebase.firestore();

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');

//
var idListaUsuarios = document.getElementById('idListaUsuarios');
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');
var idRegistrarseBtn = document.getElementById('idRegistrarseBtn');
var idLogin = document.getElementById('idLogin');

// Funcion getUsers() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getUsers = () => db.collection('lms-roles').orderBy('userName').get();

// Funcion updateUser() que modifica los datos del usuario de la coleccion 'lms-roles', que requiere los parametros: id (la id del usuario al que se modificaran los datos), updateUser (los datos que se modificaran del usuario)
const updateUser = (id, updatedUser) => db.collection('lms-roles').doc(id).update(updatedUser).then(async function() {
        
        console.log("Document successfully updated!");
        usersTable();
        $('.modal').modal('close');

    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

// Funcion delUser() que eliminar al usuario de la coleccion 'lms-roles', que requiere el parametro: id (la id del usuario a eliminar)
const delUser = (id) => db.collection('lms-roles').doc(id).delete().then(function () {
        console.log("Ususario eliminado correctamente");
        usersTable();
        $('.modal').modal('close');
        
    }).catch(function (error) {
        console.log("Ocurrio un error al momento de eliminar al usuario: ", error);
        
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
        var tableElement4 = document.createElement('td');
        var userStatus = document.createElement('a');
        userStatus.href = '#modal2';
        var userstateText = '';
        var userState = !userData.userEnable;
        if (userData.userEnable == true) {
            userStatus.textContent = 'Deshabilitar';
            userStatus.className = 'btn red modal-trigger';
            userstateText = 'Deshabilitar';
        } else {
            userStatus.textContent = 'Habilitar';
            userStatus.className = 'btn green modal-trigger';
            userstateText = 'Habilitar';
            
        }
        userStatus.onclick = function () {
            document.getElementById('modalTextH5').textContent = 'Desea '+userstateText+' a '+userData.userName+' ?';
            console.log('hab/des');
            document.getElementById('acceptBtn').onclick = async function () {
                console.log(user.id, userState);
                await updateUser(user.id, {
                    userEnable: userState,
                });
            }
        }
        tableElement4.appendChild(userStatus);

        // Boton de eliminar usuario
        var tableElement5 = document.createElement('td');
        var deleteBtn = document.createElement('a');
        deleteBtn.href = '#modalConfirmation';
        deleteBtn.className = 'btn red modal-trigger';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = function () {
            // Ejecuta la funcion de eliminar usuario
            document.getElementById('acceptDeleteBtn').onclick = async function () {
                console.log(user.id);
                // Se ejecuta la funcion delUser que elimina 
                delUser(user.id);
            }
        }
        tableElement5.appendChild(deleteBtn);
        // Fin de Boton para eliminar usuario

        tableRow.appendChild(tableElement1);
        tableRow.appendChild(tableElement2);
        tableRow.appendChild(tableElement3);
        tableRow.appendChild(tableElement4);
        tableRow.appendChild(tableElement5);
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
            var userEnable = false;
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                    userEnable = doc1.data().userEnable;
                });                
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            console.log('User is signed in', user.displayName, userRol);
            if (userEnable == true) {
                if (userRol!='Administrador') {
                    location.href = 'listaDocentes.html'
                } else {
                    idRegistrarDocenteBtn.setAttribute('style', '');
                    idListaDocentesBtn.setAttribute('style', '');
                            
                }
                
            }else{
                location.href = 'deshabilitado.html';
            }
            
            
        } else {
            console.log('User is signed out');
            
            location.href = 'index.html';
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
    idLogoutBtnMovil.addEventListener('click', (e) => {

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