//
const db = firebase.firestore();

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');

//
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');

var idCurrentImageh5 = document.getElementById('idCurrentImageh5');

var defaultImageForm = document.getElementById('defaultImageForm');

// Funcion getUsers() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getUsers = () => db.collection('lms-roles').get();

// Funcion getOptions() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getOptions = () => db.collection('lms-opciones').get();

// Funcion getLog() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-log'
const getLog = () => db.collection('lms-log').orderBy('logDate', 'desc').get();

// Funcion getDocs() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getDocs = () => db.collection('lms-docentes').orderBy('name', 'desc').get();

// Funcion getCategories() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-categorias'
const getCategories = () => db.collection('lms-categorias').get();

// Funcion getTypes() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-tipos'
const getTypes = () => db.collection('lms-tipos').get();

// Funcion getUserInfo() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getUserInfo = (id) => db.collection('lms-roles').where('idUser', '==', id).get();

// Funcion getDoc() que obtiene, mediante su id, todos los datos del docente registrado en la coleccion 'lms-docentes' de Firebase
const getDoc = (id) => db.collection('lms-docentes').doc(id).get();

const getDefImg = () => db.collection('lms-opciones').get();
    
const saveDefectImage = (defaultImageName, defaultImageUrl) => db.collection("lms-opciones").doc("I15m4a89g618E37rd5WQ").update({
        defaultImageName,
        defaultImageUrl,
    })
    .then(function() {
        console.log("Document successfully written!");
        location.reload();
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

// Funcion que guarda el numero maximo de imagenes para el portafolio de docentes en la coleccion 'lms-opciones' requiere como parametro: imagesNumber(el valor del numero de imagenes que se quierea guardar)
const changeNumberImages = (imagesNumber) => db.collection("lms-opciones").doc("I15m4a89g618E37rd5WQ").update({
        imagesNumber
    }).then(function () {
        console.log("Document successfully written!");
        location.reload();
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

// Funcion saveCategory() que guarda la categoria en la coleccion 'lms-categorias', requiere como parametro: nombreCat(el nombre de la categoria que se quiere agregar)
const saveCategory = (nombreCat) => db.collection("lms-categorias").doc().set({
        nombreCat
    }).then(function () {
        console.log("Categoria registrada correctamente");
        categoryTable();
        $('.modal').modal('close');
    }).catch(function (error) {
        console.log("Error al guardar la categoria: ", error);
    });

// Funcion updateCategory() que edita la categoria de la coleccion 'lms-categorias', requiere como parametros: id(el id de la categoria para editar), nombreCat(el nombre de la categoria que se quiere editar)
const updateCategory = (id, nombreCat) => db.collection('lms-categorias').doc(id).update({
        nombreCat
    }).then(function () {
        console.log("Categoria editada correctamente");
        categoryTable();
        $('.modal').modal('close');
    }).catch(function (error) {
        console.log("Error al editar la categoria: ", error);
    });

// Funcion deleteCategory() que elimina la categoria de la coleccion 'lms-categorias', requiere como parametro: id(la id de la categoria que se quiere eliminar)
const deleteCategory = (id) => db.collection('lms-categorias').doc(id).delete()
    .then(function () {
        console.log("Categoria eliminada correctamenete");
        categoryTable();        
        $('.modal').modal('close');
    }).catch(function (error) {
        console.log("Error al eliminar la categoria: ", error);        
    });

// Funcion saveType() que guarda el tipo en la coleccion 'lms-tipos', requiere como parametro: nombreTipo(el nombre del tipo que se quiere agregar)
const saveType = (nombreTipo) => db.collection("lms-tipos").doc().set({
        nombreTipo
    }).then(function () {
        console.log("Tipo registrado correctamente");
        typeTable();        
        $('.modal').modal('close');
    }).catch(function (error) {
        console.log("Error al guardar el tipo: ", error);
    });

// Funcion updateType() que edita el tipo de la coleccion 'lms-tipos', requiere como parametros: id(el id del tipo para editar), nombreTipo(el nombre del tipo que se quiere editar)
const updateType = (id, nombreTipo) => db.collection('lms-tipos').doc(id).update({
    nombreTipo
    }).then(function () {
        console.log("Tipo editado correctamente");
        typeTable();
        $('.modal').modal('close');
    }).catch(function (error) {
        console.log("Error al editar el tipo: ", error);
    });

// Funcion deleteType() que elimina el tipo de la coleccion 'lms-tipos', requiere como parametro: id(la id del tipo que se quiere eliminar)
const deleteType = (id) => db.collection('lms-tipos').doc(id).delete()
    .then(function () {
        console.log("Tipo eliminado correctamenete");
        typeTable();        
        $('.modal').modal('close');
    }).catch(function (error) {
        console.log("Error al eliminar el tipo: ", error);        
    });

// Fucnion currentImage que muestra el nombre de la imagen por defecto si existe una imagen por defecto
currentImage = async function () {
    const currentDefaultImage = await getOptions();
    if (currentDefaultImage.docs[0]) {
        // console.log('existe registro');
        if (currentDefaultImage.docs[0].data().defaultImageName) {
            // console.log('existe');
            idCurrentImageh5.textContent = currentDefaultImage.docs[0].data().defaultImageName;
        } else {
            // console.log('noexiste');
            idCurrentImageh5.textContent = 'No hay imagen por defecto';
        }
    } else {
        // console.log('no existe registro');
        idCurrentImageh5.textContent = 'No existe registro';
    }
    
}

uploadImageFile = function(){
    var defaultImageFile = defaultImageForm['inputDefaultImage'].files[0];
    console.log(defaultImageFile);
    if (!defaultImageFile) {
        alert('Seleccione una imagen')
    }else{

        var storageDocRef = storage.ref('/lmsImages/'+defaultImageFile.name)
        var uploadFile = storageDocRef.put(defaultImageFile);
        uploadFile.on('state_changed', function (snapshot) {
            
        }, function (error) {
            console.log(error);

        }, function () {
                
            console.log('Documento subido');
            uploadFile.snapshot.ref.getDownloadURL().then(function (url) {
                console.log(url);
                console.log(defaultImageFile.name);

                saveDefectImage(defaultImageFile.name, url);
                // saveDocuments(defaultImageFile.name, refid, url, 'pdf', 'documentCV');
                
            })
        });
    }
};

// Funcion logTable que rellena la tabla de Log de registros con los datos de la coleccion 'lms-log'
logTable = async function () {
    // Se ejecuta la funcion getLog(), y se guarda el resultado en la variable lmsLog
    const lmsLog = await getLog();

    // Se captura el elemento <tbody> donde seran mostrados los registros de log
    var logTableBody = document.getElementById('logTableBody');


    // Se realiza la funcion forEach que crea las filas en la tabla con los datos de los usuarios, para luego colocarlos en el elemento <tbody>
    lmsLog.forEach(logReg => {
        var logRegData = logReg.data();
        var tableRow = document.createElement('tr');

        var tableElement1 = document.createElement('td');
        var aUser = document.createElement('a');
        aUser.textContent = logRegData.userName;
        aUser.className = 'modal-trigger';
        aUser.href = '#modalUserLog';
        aUser.onclick = async function () {
            var modalUser = document.getElementById('modalUser');
            var modalUserLogContent = document.getElementById('modalUserLogContent');
            var newModalUserLogContent = document.createElement('div');
            newModalUserLogContent.className = 'row';
            newModalUserLogContent.id = 'modalUserLogContent';
            modalUser.replaceChild(newModalUserLogContent, modalUserLogContent);
            // Se muestra la informacion del usuario que realizo una accion en el sistema
            var userLogContentTitle = document.createElement('div');
            userLogContentTitle.className = 'col s12';
            var h5Title = document.createElement('h5');
            h5Title.textContent = 'Información del usuario';
            userLogContentTitle.appendChild(h5Title);
            
            var userInfo = await getUserInfo(logRegData.userId);
            var uInfo = userInfo.docs[0].data();

            var divUserName = document.createElement('div');
            divUserName.className = 'col s12';
            var h6Name = document.createElement('h6');
            h6Name.textContent = 'Nombre:';
            var pName = document.createElement('p');
            pName.textContent = uInfo.userName;
            divUserName.appendChild(h6Name);
            divUserName.appendChild(pName);

            var divRolName = document.createElement('div');
            divRolName.className = 'col s12';
            var h6Rol = document.createElement('h6');
            h6Rol.textContent = 'Rol de usuario:';
            var pRol = document.createElement('p');
            pRol.textContent = uInfo.rolName;
            divRolName.appendChild(h6Rol);
            divRolName.appendChild(pRol);

            var divEnable = document.createElement('div');
            divEnable.className = 'col s12';
            var h6Enable = document.createElement('h6');
            h6Enable.textContent = 'Estado:';
            var pEnable = document.createElement('p');
            if (uInfo.userEnable == true) {
                pEnable.textContent = 'Habilitado';
                
            } else {
                pEnable.textContent = 'Deshabilitado';
                
            }
            divEnable.appendChild(h6Enable);
            divEnable.appendChild(pEnable);
            
            newModalUserLogContent.appendChild(userLogContentTitle);divUserName
            newModalUserLogContent.appendChild(divUserName);
            newModalUserLogContent.appendChild(divRolName);
            newModalUserLogContent.appendChild(divEnable);
            // Fin para mostrar los datos del usuario            
        }
        tableElement1.appendChild(aUser);
        
        var tableElement2 = document.createElement('td');
        var aAction = document.createElement('a');
        switch (logRegData.userAction.logType) {
            case 'Registro':
                aAction.className = 'modal-trigger green-text text-darken-4';
                
                break;

            case 'Modificacion':
                aAction.className = 'modal-trigger yellow-text text-darken-4';
                
                break;

            case 'Eliminacion':
                aAction.className = 'modal-trigger red-text text-darken-4';
                
                break;

            case 'Registro de archivo':
                aAction.className = 'modal-trigger green-text text-darken-2';
                
                break;

            case 'Cambio de archivo':
                aAction.className = 'modal-trigger yellow-text text-darken-2';
                
                break;

            case 'Eliminacion de archivo':
                aAction.className = 'modal-trigger red-text text-darken-2';
                
                break;
        
            default:
                break;
        }
        aAction.textContent = logRegData.userAction.logType;
        aAction.href = '#modalActionLog';
        aAction.onclick = async function () {
            var docData = await getDoc(logRegData.userAction.idRegister);
            
            var modalLogTitle = document.getElementById('modalActionLogTitle');
            if (docData.data()) {
                modalLogTitle.textContent = 'Log de '+logRegData.userAction.logType+' en el docente: '+docData.data().name;
                
            } else {
                modalLogTitle.textContent = 'Log de '+logRegData.userAction.logType+' en el docente: (Docente eliminado)';
                
            }
            var modalAction = document.getElementById('modalAction');
            var modalActionLogContent = document.getElementById('modalActionLogContent');
            var newModalActionLogContent = document.createElement('div');
            newModalActionLogContent.className = 'row';
            newModalActionLogContent.id = 'modalActionLogContent';
            modalAction.replaceChild(newModalActionLogContent, modalActionLogContent);

            if (logRegData.userAction.logType == 'Registro') {
                
                if (docData.data()) {
                    console.log(docData.data());
                    var dataD = docData.data();
                    var divCol = document.createElement('div');
                    divCol.className = 'col s12 m6';
                    var dicCard = document.createElement('div');
                    dicCard.className = 'card';
                    var divCardImage = document.createElement('div');
                    divCardImage.className = 'card-image';
                    divCardImage.id = 'divCardImageId_';
                    var cardImage = document.createElement('img');
                    cardImage.id = 'cardImageId_';
                    // Seleccion de la imagen por defecto si el docente no tiene ninguan imagen guardada
                    db.collection("lms-archivos").where("refid", "==", docData.id).where("type", "==", "imagen")
                    .get()
                    .then(async function(querySnapshot) {
                        // console.log(querySnapshot.docs.length);
                        // Se comprueba si el docente tiene una imagen registrada en su portafolio
                        if (querySnapshot.docs.length > 0) {
                            querySnapshot.forEach(function(doc1) {
                                urlImage = doc1.data().url;
                            });
                        } else {
                            var defImg = await getDefImg();
                            urlImage = defImg.docs[0].data().defaultImageUrl;
                        }
                        cardImage.src = urlImage;
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });
                    // fin de seleccion de imagen por defecto
                    
                    divCardImage.appendChild(cardImage);
                    
                    var divCardContent = document.createElement('div');
                    divCardContent.className = 'card-content';
                    divCardContent.id = 'idCardContent_';
                    var spanCardTitle = document.createElement('span');
                    spanCardTitle.className = 'card-title grey-text text-darken-4';
                    spanCardTitle.textContent = dataD.name;

                    var divCardEmail = document.createElement('div');
                    var divCardEmailText = document.createElement('p');
                    var cardEmailIcon = document.createElement('i');
                    cardEmailIcon.className = 'tiny material-icons';
                    cardEmailIcon.textContent = 'email';
                    var cardEmailText = document.createTextNode(' '+dataD.email);
                    divCardEmailText.appendChild(cardEmailIcon);
                    divCardEmailText.appendChild(cardEmailText);
                    divCardEmail.appendChild(divCardEmailText);
                    
                    var divCardLastWork = document.createElement('div');
                    divCardLastWork.className = 'cardLastWork';
                    var divCardLastWorkText = document.createElement('p');
                    var cardLastWorkIcon = document.createElement('i');
                    cardLastWorkIcon.className = 'tiny material-icons';
                    cardLastWorkIcon.textContent = 'business_center';
                    if (dataD.lastWork && dataD.lastWork != '') {
                        var cardLastWorkText = document.createTextNode(' '+dataD.lastWork);
                        
                    } else {
                        var cardLastWorkText = document.createTextNode(' No registrado');
                        
                    }
                    divCardLastWorkText.appendChild(cardLastWorkIcon);
                    divCardLastWorkText.appendChild(cardLastWorkText);
                    divCardLastWork.appendChild(divCardLastWorkText);

                    var divCardPhone = document.createElement('div');
                    var divCardPhoneText = document.createElement('p');
                    var cardPhoneIcon = document.createElement('i');
                    cardPhoneIcon.className = 'tiny material-icons';
                    cardPhoneIcon.textContent = 'phone';
                    if (dataD.phone && dataD.phone != '') {
                        var cardPhoneText = document.createTextNode(' '+dataD.phone);
                        
                    } else {
                        var cardPhoneText = document.createTextNode(' No registrado');
                        
                    }
                    divCardPhoneText.appendChild(cardPhoneIcon);
                    divCardPhoneText.appendChild(cardPhoneText);
                    divCardPhone.appendChild(divCardPhoneText);
                    
                    var divCardExperience = document.createElement('div');
                    divCardExperience.className = 'cardSummary';
                    var divCardExperienceText = document.createElement('p');
                    var cardExperienceIcon = document.createElement('i');
                    cardExperienceIcon.className = 'tiny material-icons';
                    cardExperienceIcon.textContent = 'assignment';
                    var cardExperienceTitle = document.createTextNode('Experiencia laboral:');
                    var pCardExperienceText = document.createElement('p');
                    pCardExperienceText.className = 'pTextContent';
                    if (dataD.experience && dataD.experience != '') {
                        var cardExperienceText = document.createTextNode(' '+dataD.experience);
                    } else {
                        var cardExperienceText = document.createTextNode(' No registrado');
                    }
                    pCardExperienceText.appendChild(cardExperienceText);
                    divCardExperienceText.appendChild(cardExperienceIcon);
                    divCardExperienceText.appendChild(cardExperienceTitle);
                    divCardExperience.appendChild(divCardExperienceText);
                    divCardExperience.appendChild(pCardExperienceText);

                    var divCardSummary = document.createElement('div');
                    divCardSummary.className = 'cardSummary';
                    var divCardContentText = document.createElement('p');
                    var cardSummaryIcon = document.createElement('i');
                    cardSummaryIcon.className = 'tiny material-icons';
                    cardSummaryIcon.textContent = 'assignment';
                    var cardSummaryTitle = document.createTextNode('Resumen:');
                    var pCardSummaryText = document.createElement('p');
                    pCardSummaryText.className = 'pTextContent';
                    var cardContentText = document.createTextNode(dataD.summary);
                    pCardSummaryText.appendChild(cardContentText);
                    divCardContentText.appendChild(cardSummaryIcon);
                    divCardContentText.appendChild(cardSummaryTitle);
                    divCardSummary.appendChild(divCardContentText);
                    divCardSummary.appendChild(pCardSummaryText);

                    var h6CategoryText = document.createElement('div');
                    h6CategoryText.className = 'chip';
                    h6CategoryText.id = 'h6Id_';
                    if (dataD.category) {
                        var categoryText = document.createTextNode(dataD.category);
                        
                    } else {
                        var categoryText = document.createTextNode('Sin categoria');
                        
                    }
                    h6CategoryText.appendChild(categoryText);
                    
                    var typeTag = document.createElement('div');
                    typeTag.className = 'chip';
                    if (dataD.type) {
                        typeTag.textContent = dataD.type;
                    } else {
                        typeTag.textContent = 'Sin tipo';
                    }

                    divCardContent.appendChild(spanCardTitle);
                    divCardContent.appendChild(divCardEmail);
                    divCardContent.appendChild(divCardPhone);
                    divCardContent.appendChild(divCardLastWork);
                    divCardContent.appendChild(divCardExperience);
                    divCardContent.appendChild(divCardSummary);
                    divCardContent.appendChild(h6CategoryText);
                    divCardContent.appendChild(typeTag);

                    dicCard.appendChild(divCardImage);
                    dicCard.appendChild(divCardContent);
                    divCol.appendChild(dicCard);

                    newModalActionLogContent.appendChild(divCol);

                } else {
                    console.log('Docente Eliminado');
                    var divNewRegister = document.createElement('div');
                    divNewRegister.className = 'col s12';
                    var newRegisterTitle = document.createElement('h5');
                    newRegisterTitle.textContent = 'Registro nuevo';
                    var newRegisterContent = document.createElement('p');
                    newRegisterContent.textContent = logRegData.userAction.newRegister;
                    divNewRegister.appendChild(newRegisterTitle);
                    divNewRegister.appendChild(newRegisterContent);

                    newModalActionLogContent.appendChild(divNewRegister);
                }
                
            } else {
                if (logRegData.userAction.logType == 'Modificacion') {
                    var divLastModification = document.createElement('div');
                    divLastModification.className = 'col s12';
                    var lastModificationTitle = document.createElement('h5');
                    lastModificationTitle.textContent = 'Dato(s) anterior(es)';
                    var lastModificationContent = document.createElement('p');
                    lastModificationContent.textContent = logRegData.userAction.lastRegister;
                    divLastModification.appendChild(lastModificationTitle);
                    divLastModification.appendChild(lastModificationContent);
                    newModalActionLogContent.appendChild(divLastModification);
                }
    
                if (logRegData.userAction.logType == 'Cambio de archivo') {
                    var divLastModification = document.createElement('div');
                    divLastModification.className = 'col s12';
                    var lastModificationTitle = document.createElement('h5');
                    lastModificationTitle.textContent = 'Archivo anterior';
                    var lastModificationContent = document.createElement('p');
                    lastModificationContent.textContent = logRegData.userAction.lastRegister;
                    divLastModification.appendChild(lastModificationTitle);
                    divLastModification.appendChild(lastModificationContent);
                    newModalActionLogContent.appendChild(divLastModification);
                }
    
                var divNewRegister = document.createElement('div');
                divNewRegister.className = 'col s12';
                var newRegisterTitle = document.createElement('h5');
    
                switch (logRegData.userAction.logType) {
                    case 'Registro':
                        newRegisterTitle.textContent = 'Registro nuevo';
                        
                        break;
        
                    case 'Modificacion':
                        newRegisterTitle.textContent = 'Dato(s) nuevo(s)';
                        
                        break;
        
                    case 'Eliminacion':
                        newRegisterTitle.textContent = 'Registro eliminado';
    
                        break;
    
                    case 'Registro de archivo':
                        newRegisterTitle.textContent = 'Archivo nuevo';
                        
                        break;
    
                    case 'Cambio de archivo':
                        newRegisterTitle.textContent = 'Archivo cambiado';
                        
                        break;
    
                    case 'Eliminacion de archivo':
                        newRegisterTitle.textContent = 'Archivo eliminado';
                        
                        break;
                
                    default:
                        break;
                }
    
                var newRegisterContent = document.createElement('p');
                newRegisterContent.textContent = logRegData.userAction.newRegister;
                divNewRegister.appendChild(newRegisterTitle);
                divNewRegister.appendChild(newRegisterContent);
                newModalActionLogContent.appendChild(divNewRegister);
            }

            // newModalActionLogContent.textContent = logRegData.userAction.newRegister;
        }
        tableElement2.appendChild(aAction);

        var tableElement3 = document.createElement('td');
        tableElement3.textContent = logRegData.logDate.toDate();
        tableRow.appendChild(tableElement1);
        tableRow.appendChild(tableElement2);
        tableRow.appendChild(tableElement3);
        logTableBody.appendChild(tableRow);
        // console.log(logRegData.logDate.toDate());
        
    });
}

// Funcion categoryTable() que rellena la tabla de categoria con los datos de la coleccion 'lms-categorias'
categoryTable = async function () {
    // Se ejecuta la funcion getCategories(), y se guarda el resultado en la variable lmsCat
    const lmsCat = await getCategories();

    // Se captura el elemento <tbody> donde seran mostrados los registros de las categorias y se captura el elemento <table> utilizado para refrescar la tabla de categorias
    var categoryTableElement = document.getElementById('categoryTableElement');
    var categoryTableBody = document.createElement('tbody');
    categoryTableBody.id = 'categoryTableBody';
    var oldCategoryTableBody = document.getElementById('categoryTableBody');
    categoryTableElement.replaceChild(categoryTableBody, oldCategoryTableBody);

    // Se capturan elementos del modal 
    var imputModalTitle = document.getElementById('imputModalTitle');
    var inputModalLabel = document.getElementById('inputModalLabel');
    var saveInputModalBtn = document.getElementById('saveInputModalBtn');
    var inputModalValue = document.getElementById('inputModalValue');


    // Se realiza la funcion forEach que crea las filas en la tabla con los datos de los usuarios, para luego colocarlos en el elemento <tbody>
    lmsCat.forEach(cat => {
        var catData = cat.data();
        var tableRow = document.createElement('tr');
        var tableElement1 = document.createElement('td');
        tableElement1.textContent = catData.nombreCat;
        var tableElement2 = document.createElement('td');
        // Boton de editar categoria
        var editCategoryBtn = document.createElement('a');
        editCategoryBtn.className = 'btn-floating yellow modal-trigger';
        editCategoryBtn.href = '#inputModal';
        editCategoryBtn.onclick = function () {
            imputModalTitle.textContent = 'Editar categoria';
            inputModalLabel.textContent = 'Nombre de categoria';
            inputModalValue.value = catData.nombreCat;
            inputModalLabel.className = 'active';
            saveInputModalBtn.onclick = function () {
                console.log(cat.id+' '+catData.nombreCat+' '+inputModalValue.value);
                updateCategory(cat.id, inputModalValue.value);
            }   
        }
        var editCategoryIcon = document.createElement('i');
        editCategoryIcon.className = 'material-icons';
        editCategoryIcon.textContent = 'edit';
        editCategoryBtn.appendChild(editCategoryIcon);
        tableElement2.appendChild(editCategoryBtn);
        // Fin boton editar categoria
        // Boton de eliminar categoria
        var deleteCategoryBtn = document.createElement('a');
        deleteCategoryBtn.className = 'btn-floating red modal-trigger';
        deleteCategoryBtn.href = '#modalAlert';
        deleteCategoryBtn.onclick = function () {
            var confirmDelete = document.getElementById('confirmDelete');
            confirmDelete.onclick = function () {
                console.log(cat.id);
                deleteCategory(cat.id);
            }
        }
        var deleteCategoryIcon = document.createElement('i');
        deleteCategoryIcon.className = 'material-icons';
        deleteCategoryIcon.textContent = 'delete';
        deleteCategoryBtn.appendChild(deleteCategoryIcon);
        tableElement2.appendChild(deleteCategoryBtn);
        // Fin boton eliminar categoria
        // Se agregan los elementos creados a la tabla de categorias, como el nombre de la categoria y los botones de editar y eliminar
        tableRow.appendChild(tableElement1);
        tableRow.appendChild(tableElement2);
        categoryTableBody.appendChild(tableRow);
    });

    // Boton de agregar categoria
    var newTableRow = document.createElement('tr');
    var tableElement = document.createElement('td');
    tableElement.colSpan = 2;
    var addCategoryBtn = document.createElement('a');
    addCategoryBtn.className = 'btn-small green modal-trigger w100';
    addCategoryBtn.href = '#inputModal';
    addCategoryBtn.onclick = function () {
        imputModalTitle.textContent = 'Agregar categoria';
        inputModalLabel.textContent = 'Nombre de categoria';
        inputModalValue.value = '';
        inputModalLabel.className = '';
        saveInputModalBtn.onclick = function () {
            saveCategory(inputModalValue.value);
        }
    }
    var addCategoryIcon = document.createElement('i');
    addCategoryIcon.className = 'material-icons';
    addCategoryIcon.textContent = 'add';
    addCategoryBtn.appendChild(addCategoryIcon);
    tableElement.appendChild(addCategoryBtn);
    newTableRow.appendChild(tableElement);
    categoryTableBody.appendChild(newTableRow);
    // Fin de boton agregar categoria
}

// Funcion typeTable() que rellena la tabla de categoria con los datos de la coleccion 'lms-tipos'
typeTable = async function () {
    // Se ejecuta la funcion getTypes(), y se guarda el resultado en la variable lmsType
    const lmsType = await getTypes();

    // Se captura el elemento <tbody> donde seran mostrados los registros de los tipos y se captura el elemento <table> utilizado para refrescar la tabla de tipos
    var typeTableElement = document.getElementById('typeTableElement');
    var typeTableBody = document.createElement('tbody');
    typeTableBody.id = 'typeTableBody';
    var oldTypeTableBody = document.getElementById('typeTableBody');
    typeTableElement.replaceChild(typeTableBody, oldTypeTableBody);

    // Se capturan elementos del modal 
    var imputModalTitle = document.getElementById('imputModalTitle');
    var inputModalLabel = document.getElementById('inputModalLabel');
    var saveInputModalBtn = document.getElementById('saveInputModalBtn');
    var inputModalValue = document.getElementById('inputModalValue');

    // Se realiza la funcion forEach que crea las filas en la tabla con los datos de los usuarios, para luego colocarlos en el elemento <tbody>
    lmsType.forEach(type => {
        var typeData = type.data();

        var tableRow = document.createElement('tr');
        var tableElement1 = document.createElement('td');
        tableElement1.textContent = typeData.nombreTipo;
        var tableElement2 = document.createElement('td');
        // Boton de editar tipo
        var editTypeBtn = document.createElement('a');
        editTypeBtn.className = 'btn-floating yellow modal-trigger';
        editTypeBtn.href = '#inputModal';
        editTypeBtn.onclick = function () {
            imputModalTitle.textContent = 'Editar tipo';
            inputModalLabel.textContent = 'Nombre de tipo';
            inputModalValue.value = typeData.nombreTipo;
            inputModalLabel.className = 'active';
            saveInputModalBtn.onclick = function () {
                console.log(type.id+' '+typeData.nombreCat+' '+inputModalValue.value);
                updateType(type.id, inputModalValue.value);
            }   
        }
        var editTypeIcon = document.createElement('i');
        editTypeIcon.className = 'material-icons';
        editTypeIcon.textContent = 'edit';
        editTypeBtn.appendChild(editTypeIcon);
        tableElement2.appendChild(editTypeBtn);
        // Fin boton editar tipo
        // Boton de eliminar tipo
        var deleteTypeBtn = document.createElement('a');
        deleteTypeBtn.className = 'btn-floating red modal-trigger';
        deleteTypeBtn.href = '#modalAlert';
        deleteTypeBtn.onclick = function () {
            var confirmDelete = document.getElementById('confirmDelete');
            confirmDelete.onclick = function () {
                console.log(type.id);
                deleteType(type.id);
            }
        }
        var deleteTypeIcon = document.createElement('i');
        deleteTypeIcon.className = 'material-icons';
        deleteTypeIcon.textContent = 'delete';
        deleteTypeBtn.appendChild(deleteTypeIcon);
        tableElement2.appendChild(deleteTypeBtn);
        // Fin boton eliminar tipo
        // Se agregan los elementos creados a la tabla de tipos, como el nombre del tipo y los botones de editar y eliminar
        tableRow.appendChild(tableElement1);
        tableRow.appendChild(tableElement2);
        typeTableBody.appendChild(tableRow);
    });
    // Boton de agregar tipo
    var newTableRow = document.createElement('tr');
    var tableElement = document.createElement('td');
    tableElement.colSpan = 2;
    var addTypeBtn = document.createElement('a');
    addTypeBtn.className = 'btn-small green modal-trigger w100';
    addTypeBtn.href = '#inputModal';
    addTypeBtn.onclick = function () {
        imputModalTitle.textContent = 'Agregar tipo';
        inputModalLabel.textContent = 'Nombre de tipo';
        inputModalValue.value = '';
        inputModalLabel.className = '';
        saveInputModalBtn.onclick = function () {
            saveType(inputModalValue.value);
        }
    }
    var addTypeIcon = document.createElement('i');
    addTypeIcon.className = 'material-icons';
    addTypeIcon.textContent = 'add';
    addTypeBtn.appendChild(addTypeIcon);
    tableElement.appendChild(addTypeBtn);
    newTableRow.appendChild(tableElement);
    typeTableBody.appendChild(newTableRow);
    // Fin de boton agregar tipo
}

// Se captura el checkbos "todos" para que los checkbox del panel sean seleccionados o no seleccionados
var formCheckbox = document.getElementById('formCheckbox');
var allCheckbox = document.getElementById('allCheckbox');
allCheckbox.addEventListener('click', (e) => {
    if (allCheckbox.checked) {
        formCheckbox['emailCheckbox'].checked = true;
        formCheckbox['summaryCheckbox'].checked = true;
        formCheckbox['experienceCheckbox'].checked = true;
        formCheckbox['lastWorkCheckbox'].checked = true;
        formCheckbox['phoneCheckbox'].checked = true;
        formCheckbox['categoryCheckbox'].checked = true;
        formCheckbox['typeCheckbox'].checked = true;
    } else {
        formCheckbox['emailCheckbox'].checked = false;
        formCheckbox['summaryCheckbox'].checked = false;
        formCheckbox['experienceCheckbox'].checked = false;
        formCheckbox['lastWorkCheckbox'].checked = false;
        formCheckbox['phoneCheckbox'].checked = false;
        formCheckbox['categoryCheckbox'].checked = false;
        formCheckbox['typeCheckbox'].checked = false;
    }
});

// Se captura el boton para exportar el documento CSV y se asigna una funcion que se ejecuta en el evento 'onclick' del boton, que captura los checkbox seleccionados en el panel, para luego exportarlos
var btnExportEmail = document.getElementById('btnExportEmail');
btnExportEmail.addEventListener('click', async (e) => {
    var docsList = await getDocs();
    // console.log(docsList.docs[0].data());
    var countDocs = 0;
    var data = [];
    
    docsList.forEach(docData => {
        data[countDocs] = {
            name: docData.data().name
        };
        if (formCheckbox['emailCheckbox'].checked) {
            data[countDocs].email = docData.data().email+" ";
        }
        if (formCheckbox['summaryCheckbox'].checked) {
            data[countDocs].summary = docData.data().summary+" ";
        }
        if (formCheckbox['experienceCheckbox'].checked) {
            data[countDocs].experience = docData.data().experience+" ";
        }
        if (formCheckbox['lastWorkCheckbox'].checked) {
            data[countDocs].lastWork = docData.data().lastWork+" ";
        }
        if (formCheckbox['phoneCheckbox'].checked) {
            data[countDocs].phone = docData.data().phone+" ";
        }
        if (formCheckbox['categoryCheckbox'].checked) {
            data[countDocs].category = docData.data().category+" ";
        }
        if (formCheckbox['typeCheckbox'].checked) {
            data[countDocs].type = docData.data().type+" ";
        }
        
        // data.push(docData.data());
        countDocs++;
    });
    console.log(data);
    
    const headers = {
        nombre: 'Nombre'
    };
    if (formCheckbox['emailCheckbox'].checked) {
        headers.correo = 'Correo Electronico'
    }
    if (formCheckbox['summaryCheckbox'].checked) {
        headers.resumen = 'Resumen'
    }
    if (formCheckbox['experienceCheckbox'].checked) {
        headers.experience = 'Experiencia laboral';
    }
    if (formCheckbox['lastWorkCheckbox'].checked) {
        headers.lastWork = 'Ultimo trabajo';
    }
    if (formCheckbox['phoneCheckbox'].checked) {
        headers.phone = 'Telefono';
    }
    if (formCheckbox['categoryCheckbox'].checked) {
        headers.category = 'Categoria';
    }
    if (formCheckbox['typeCheckbox'].checked) {
        headers.type = 'Tipo';
    }

    var CSVFileName = document.getElementById('CSVFileName').value;
    if (CSVFileName == '') {
        CSVFileName = 'Documento';
    }
    exportCSVFile(headers, data, CSVFileName);
})

// Funcion conertToCSV() que convierte los datos que se quiere exportar, a formato CSV, requiere el parametro de los datos a exportar
function convertToCSV(objArray) {
    const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = 'sep=|' + '\r\n\n';
    for (let i = 0; i < array.length; i++) {
        let line = "";
        for (let index in array[i]) {
            if (line != "") line += "|";
            line += array[i][index];
        }
        str += line + "\r\n";
    }
    return str;
}

// Funcion exportCSVFile() que exporta los datos ya converidos a CSV, requiere los parametros: headers(los titulos de cabecera del documento), items(los datos que se quiere exportar), fileName(el nombre del archivo CSV)
function exportCSVFile(headers, items, fileName) {
    if (headers) {
        items.unshift(headers);
    }
    const jsonObject = JSON.stringify(items);
    const csv = convertToCSV(jsonObject);
    console.log(csv);
    
    const exportName = fileName + ".csv" || "export.csv";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
        // console.log('navigator mssaveblob');
        
        navigator.msSaveBlob(blob, exportName);
    } else {
        // console.log('no navigator mssaveblob');

        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}





// Funcion initApp() utilizada para verificar si un usuario esta autenticado
async function initApp() {
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

    // Se realiza el guardado de la imagen por defecto en la coleccion 'lms-opciones'
    defaultImageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadImageFile();
    });

    // Se realiza el guardado del valor para el numero maximo de imagenes del portafolio de docente
    var formImgPort = document.getElementById('formImgPort');
    formImgPort.addEventListener('submit', (e) => {
        e.preventDefault();
        var nImagesPort = formImgPort["nImagesPort"].value;
        console.log(nImagesPort);
        
        changeNumberImages(nImagesPort);
    });

    // Se obtiene el valor guardado en la coleccion 'lms-opciones' del numero maximo de imagenes
    var imgMax = await getDefImg();
    if (imgMax.docs[0].data().imagesNumber && imgMax.docs[0].data().imagesNumber != "") {
        console.log('numero existe', imgMax.docs[0].data().imagesNumber);
        formImgPort["nImagesPort"].value = imgMax.docs[0].data().imagesNumber;
    }else{
        console.log('numero no existe');
    }
}

// Funcion que se ejecuta mediante el evento 'DOMContentLoaded' (el documento listaUsuarios.html a sido cargado)
window.addEventListener('DOMContentLoaded', (e) => {
    initApp();
    
    currentImage();

    logTable();

    categoryTable();

    typeTable();

    // Inicializa el modal para mostrase despues de realizar alguna funcion que requiera del modal
    $('.modal').modal();
})