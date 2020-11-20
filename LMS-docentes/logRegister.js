// DB firestore
const db = firebase.firestore();

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

// 
const logRegister = function (userName, userId, userAction, userActionId) {
    // console.log(userId, userAction, userActionId);
    // console.log(firebase.firestore.Timestamp.fromDate(Date.now()));
    savelogRegister(userName, userId, userAction, userActionId);
        
}