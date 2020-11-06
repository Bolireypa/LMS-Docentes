//
const db = firebase.firestore();

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

// Funcion que se ejecuta mediante el evento 'DOMContentLoaded' (el documento listaUsuarios.html a sido cargado)
window.addEventListener('DOMContentLoaded', (e) => {
    // Se ejecuta la funcion userTable(), al momento de ser cargada la pagina
    usersTable();
    

    // Inicializa el modal para mostrase despues de presionar el boton 'Cambiar rol'
    $('.modal').modal();
})