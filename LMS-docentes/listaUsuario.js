// Se inicializa firesotre
const db = firebase.firestore();

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');

// Se capturan los botones de la barra de navegacion: Lista de usuario, Registrar docente, Lista de docentes, Registrarse y Login
var idListaUsuarios = document.getElementById('idListaUsuarios');
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');
var idRegistrarseBtn = document.getElementById('idRegistrarseBtn');
var idLogin = document.getElementById('idLogin');

// Funcion getUsers() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getUsers = () => db.collection('lms-roles').orderBy('userName').get();

// Funcion updateUser() que modifica los datos del usuario de la coleccion 'lms-roles', que requiere los parametros: id (la id del usuario al que se modificaran los datos), updateUser (los datos que se modificaran del usuario)
const updateUser = (id, updatedUser) => db.collection('lms-roles').doc(id).update(updatedUser).then(async function() {
        // Si se modificaron los datos correctamente se ejecuta lo siguiente
        console.log("Document successfully updated!");
        // Se ejecuta la funcion usersTable() que genera la tabla de usuarios con sus datos
        usersTable();
        // Se cierra el modal de editar usuario
        $('.modal').modal('close');
    }).catch(function(error) {
        // En caso de algun error en la modificacion de usuarios, se lo muestra en consola
        console.error("Error updating document: ", error);
    });

// Funcion delUser() que eliminar al usuario de la coleccion 'lms-roles', que requiere el parametro: id (la id del usuario a eliminar)
const delUser = (id) => db.collection('lms-roles').doc(id).delete().then(function () {
        // Si se elimino los datos del usuario correctamente se ejecuta lo siguiente
        console.log("Ususario eliminado correctamente");
        // Se ejecuta la funcion usersTable() que genera la tabla de usuarios con sus datos
        usersTable();
        // Se cierra el modal de comprobacion de eliminacion de usuario
        $('.modal').modal('close');
    }).catch(function (error) {
        // En caso de algun error en la modificacion de usuarios, se lo muestra en consola
        console.log("Ocurrio un error al momento de eliminar al usuario: ", error);
    });

// Funcion usersTable() que llena la tabla de usuarios mediante una consulta a la coleccion 'lms-roles'
usersTable = async function () {
    // Se ejecuta la funcion getUsers(), y se guarda el resultado en la variable lmsUsers
    const lmsUsers = await getUsers();
    // Se obtiene el elemento <table> donde seran mostrados los datos de los usuarios
    var tableId = document.getElementById('usersTableBody');
    var newTableBody = document.createElement('tbody');
    newTableBody.id = 'usersTableBody';
    var userTable = document.getElementById('table');
    userTable.replaceChild(newTableBody, tableId);
    // Se realiza la funcion forEach que crea las filas en la tabla con los datos de los usuarios, para luego colocarlos en el elemento <tbody> con su id: userTableBody
    lmsUsers.forEach(user => {
        var userData = user.data();
        // Se crean las celdas de la tabla que muestran los nombres y roles de los usuarios
        var tableRow = document.createElement('tr');
        var tableElement1 = document.createElement('td');
        tableElement1.textContent = userData.userName;
        var tableElement2 = document.createElement('td');
        tableElement2.textContent = userData.rolName;
        // Se crea la celda que muestra el boton de cambiar rol de usuario
        var tableElement3 = document.createElement('td');
        // Se crea el boton de Cambiar rol que habre un modal para cambiar el rol de usuario
        var editRolBtn = document.createElement('a');
        editRolBtn.className = 'btn modal-trigger';
        editRolBtn.href = '#modal1';
        editRolBtn.textContent = 'Cambiar rol';
        // Se asigna el evento onclick al boton Cambiar rol
        editRolBtn.onclick = function () {
            // Se obtiene el elemento <select> con la lista de roles y se asigna el nombre del rol del usuario, al valor del <select>
            var editRolUserSelect = document.getElementById('selectUserRol');
            editRolUserSelect.value = userData.rolName;
            $('select').formSelect();
            // Se captura el boton Guardar
            var saveUserRolBtn = document.getElementById('saveRolBtn');
            // Se asigna el evento onclick al boton Guardar que guarda el nuevo rol del usuario
            saveUserRolBtn.onclick = async function () {
                // Se ejecuta la funcion updateUser() para modificar el rol de usuario en la coleccion 'lms-roles'
                await updateUser(user.id, {
                    rolName: editRolUserSelect.value,
                });
            }
        }
        tableElement3.appendChild(editRolBtn);
        // Se crea la celda que muestra el boton para habilitar o deshabilitar a un usuario
        var tableElement4 = document.createElement('td');
        // Se crea el boton de Habilitar / Deshabilitar que habre un modal para la confirmacion de habilitar o deshabilitar al usuario
        var userStatus = document.createElement('a');
        userStatus.href = '#modal2';
        var userstateText = '';
        var userState = !userData.userEnable;
        // Si el usuario esta deahabilitado, la accion a realizar sera la de habilitar, caso contrario si el usuario esta habilitado la accion a realizar sera la de deshabilitar
        if (userData.userEnable == true) {
            userStatus.textContent = 'Deshabilitar';
            userStatus.className = 'btn red modal-trigger';
            userstateText = 'Deshabilitar';
        } else {
            userStatus.textContent = 'Habilitar';
            userStatus.className = 'btn green modal-trigger';
            userstateText = 'Habilitar';
        }
        // Se asigna el event onclick al boton de Habilitar / Deshabilitar
        userStatus.onclick = function () {
            // Se modifica el mensaje de confirmacion de acuerdo a la accion a realzar
            document.getElementById('modalTextH5').textContent = 'Desea '+userstateText+' a '+userData.userName+' ?';
            // Se asigna el evento onclik a boton de aceptar cambios
            document.getElementById('acceptBtn').onclick = async function () {
                // Se realiza la modificacion del estado de habilitacion del usuario mediante la funcion updateUser()
                await updateUser(user.id, {
                    userEnable: userState,
                });
            }
        }
        tableElement4.appendChild(userStatus);
        // Se crea la celda para el boton de eliminar usuario
        var tableElement5 = document.createElement('td');
        var deleteBtn = document.createElement('a');
        deleteBtn.href = '#modalConfirmation';
        deleteBtn.className = 'btn red modal-trigger';
        deleteBtn.textContent = 'Eliminar';
        // Se asigna el evento onclick al boton Eliminar
        deleteBtn.onclick = function () {
            // Ejecuta la funcion de eliminar usuario
            document.getElementById('acceptDeleteBtn').onclick = async function () {
                console.log(user.id);
                // Se ejecuta la funcion delUser que elimina al usuario seleccionado mediante la funcion delUser() que requiere su id
                delUser(user.id);
            }
        }
        tableElement5.appendChild(deleteBtn);
        // Fin de Boton para eliminar usuario
        // Se agregan las celdas creadas a la tabla de usuarios
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
    // Se comprueba que haya un usuario logeado con la funciones de firebase
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
        // Si el usuario esta logeado se realizan cambios en la barra de navegacion para que se muestre su nombr
            document.getElementById('dropdown1Text').textContent = user.displayName;
            idDropdown.setAttribute('style', '');
            // Variables utilizadas para comprobar la habilitacion del usuario y su rol
            var userRol = '';
            var userEnable = false;
            // Se realiza una consulta a la coleccion 'lms-roles' con la uid del usuario, para obtener el rol del usuario logeado y el estado de habilitacion
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                // Se asignan los datos del rol y el estado de habilitacion del usuario en variables
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                    userEnable = doc1.data().userEnable;
                });                
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            console.log('User is signed in', user.displayName, userRol);
            // Si el usuario esta habilitado se comprueba que sea administrador, en caso de que no sea administrador se le redirecciona a la pagina 'listaDocentes.html'
            if (userEnable == true) {
                if (userRol!='Administrador') {
                    location.href = 'listaDocentes.html'
                } else {
                    idRegistrarDocenteBtn.setAttribute('style', '');
                    idListaDocentesBtn.setAttribute('style', '');
                }
            }else{
                // En el caso de que el usuario no este habilitado se le redirecciona a la pagina 'deshabilitado.html'
                location.href = 'deshabilitado.html';
            }
        } else {
            // En caso de que el usuario no este logeado se le redirecciona a la pagina 'index.html'
            console.log('User is signed out');
            location.href = 'index.html';
        }
    });

    // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout
    btnLogOut.addEventListener('click', (e) => {
        // Se ejecuta la funcion signOut() de firebase para el logout del usuario
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
            }).catch(function(error) {
            console.log('Log out error', error);
        });
    });
    // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout en modo responsivo
    idLogoutBtnMovil.addEventListener('click', (e) => {
        // Se ejecuta la funcion signOut() de firebase para el logout del usuario
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
        }).catch(function(error) {
            console.log('Log out error', error);
        });
    });
}

// Funcion que se ejecuta mediante el evento 'DOMContentLoaded' (el documento listaUsuarios.html a sido cargado)
window.addEventListener('DOMContentLoaded', (e) => {
    initApp();
    // Se ejecuta la funcion userTable(), al momento de ser cargada la pagina
    usersTable();
    // Inicializa el modal para mostrase despues de presionar el boton 'Cambiar rol'
    $('.modal').modal();
})