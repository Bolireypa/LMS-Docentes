// Se inicializa DB firestore
const db = firebase.firestore();
// Funcion savelogRegister() que registra las acciones realizadas por los usuarios respecto al registro, modificacion, eliminacion de docentes y sus archivos como imagenes o pdf, requiere los parametros: userName(nombre del usuario que realiza alguna accion), userId(id del usuario que realiza alguna accion), userAction(la descripcion de la accion realizado por el usuario), userActionId(la id del docente o del archivo al que se le realizo alguna accion)
const savelogRegister = (userName, userId, userAction, userActionId) => 
    db.collection('lms-log').doc().set({
        userName,
        userId,
        userAction,
        userActionId,
        logDate: firebase.firestore.Timestamp.now(),
    }).then(function () {
        console.log('Datos de archivos correctamente guardados');
    }).catch(function (error) {
        console.log('No se pudo registrar correctamente: ', error);
    });

// Funcion logRegister() que es ejecutada desde otros documentos JS para el registro de los Log's y que ejecuta la funcnion savelogRegister()
const logRegister = function (userName, userId, userAction, userActionId) {
    savelogRegister(userName, userId, userAction, userActionId);
}