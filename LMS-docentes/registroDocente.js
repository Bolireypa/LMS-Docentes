

// Variable docenteForm, guarda el formulario de la vista reigistroDocente.html de la etiqueta <form> para capturar los datos para el registro de docentes nuevos
const docenteForm = document.getElementById("formRegistroDocentes");

// Funcion getDoc() que obtiene todos los datos de los docentes registrados en la coleccion 'lms-docentes' de Firebase
// const getDoc = () => db.collection('lms-docentes').get();

// Se capturan los elementos del DOM mediante sus ID para luego agregar mas elementos o editar los elementos
var btnLogOut = document.getElementById('btnLogOut');
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');
var idListaUsuarios = document.getElementById('idListaUsuarios');
var idOpcionesBtn = document.getElementById('idOpcionesBtn');
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');
var idRegistrarseBtn = document.getElementById('idRegistrarseBtn');
var idLogin = document.getElementById('idLogin');
var idListaUsuariosMovil = document.getElementById('idListaUsuariosMovil');
var idOpcionesBtnMovil = document.getElementById('idOpcionesBtnMovil');
var idListaDocentesBtnMovil = document.getElementById('idListaDocentesBtnMovil');
// Fin de captura de elementos del DOM

// Variable que guarda al usuario con sesion iniciada
var currentUser = '';

// Funcion getCat() que obtiene todos los datos de las categorias registradas en la coleccion 'lms-categorias' de Firebase
const getCat = () => db.collection('lms-categorias').orderBy('nombreCat').get();

// Funcion getType() que obtiene todos los datos de los tipos registradas en la coleccion 'lms-tipos' de Firebase
const getType = () => db.collection('lms-tipos').orderBy('nombreTipo').get();

// Variable c, utilizada como contador para el limite de botones que apareceran en el formulario, para la subida de imagenes del portafolio del docente
var c = 0;

//
var c1 = 0;

//
var c2 = 0;



// Funcion saveUser() que realiza el registro de docentes nuevos en la coleccion 'lms-docentes', requiere de los parametros: name (nombre de docente), email (email de docente), summary (resumen del docente), category (categoria a la que pertenece el docente), type (tipo al que pertenece el docente: Consultor, Docente, Freelancer).
const saveUser = (name, email, summary, category, type) =>
    db.collection('lms-docentes').add({
        name,
        email,
        summary,
        category,
        type,
    }).then(function(docData) {
        console.log("Docente registrado correctamente ",docData.id);

        // Se ejecuta la funcion completedProgressBar() despues del registro exitoso del docente; modifica la barra de progreso 'Registrando docente' y lo coloca al 100%, se envian los siguientes parametros: 'regDocBar' (id del elemento <div> que controla la barra de progreso), '100%' (porcentaje a colocar en la barra de progreso una finalizado el registro de docente)
        completedProgressBar('regDocBar', '100%');

        // Se ejecuta la funcion uploadImg() despues del registro exitoso del docente; sube la imagen en storage de firebase, se envia el parametro: docData.id (la id del docente registrado anteriormente)
        uploadImg(docData.id);

        // Se ejecuta la funcion uploadDocument() despues del registro exitoso del docente; sube el archivo PDF del CV del docente en storage de firebase, se envia el parametro: docData.id (la id del docente registrado anteriormente)
        uploadDocument(docData.id);

        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta registrando a un docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (el nombre del docente que registro), cuarto parametro (la id del docente registrado)
        var log1 = {
            logType: 'Registro',
            lastRegister: '',
            newRegister: name,
            idRegister: docData.id,
        };
        logRegister(currentUser.displayName, currentUser.uid, log1, docData.id);
    }).catch(function(error) {
        console.error("No se pudo registrar correctamente al docente: ", error);
    });

// Funcion saveDocuments() que registra los datos de los archivos en formulario de registro de docentes y guardalos datos en la coleccion 'lms-archivos', requiere los parametros: filename (nombre del archivo), refid (id del docente registrado anteriormente), url (url del archivo ubicado en storage del proyeto), type (tipo del archivo: imagen, pdf)
const saveDocuments = (fileName, refid, url, type, idProgBar) => 
    db.collection('lms-archivos').doc().set({
        fileName,
        refid,
        url,
        type,
    }).then(function () {
        console.log('Datos de archivos correctamente guardados', idProgBar);
        // Se ejecuta la funcion completedProgressBar() despues del registro exitoso de los datos de archivos (imagenes del portafolio del docente y documento CV en formato PDF); modifica la barra de progreso de las imagenes y el documento PDF y lo coloca al 100% una vez finalizado el registro de sus datos en la coleccion 'lms-archivos', se envian los siguientes parametros: 'idProgBar' (id del elemento <div> que controla la barra de progreso), '100%' (porcentaje a colocar en la barra de progreso una finalizado el registro de datos de los archivos)
        completedProgressBar(idProgBar, '100%');

    }).catch(function (error) {
        console.log('No se pudo registrar correctamente: ', error);
    });

// Funcion newBtnPortafolio() que agrega un nuevo boton de imagen de portafolio al formulario de registro (con un maximo de 6 botones), requiere el parametro: imgVal (el valor de la imagen que se seleccione)
const newBtnPortafolio = function (imgVal) {

    
    // Se conprueba que el elemento <input> tenga una imagen, si tiene una imagen entonces se agrega un nuevo boton para subir otra imagen
    if (imgVal!="") {
        console.log("nueva imagen "+imgVal);
        c=c+1;
        if (c==6) {
            
        } else {
            //
            createBtnPortafolio(c);
        }
    } else {
        imgVal = 'no hay imagen';
        console.log("nueva imagen "+imgVal);
    }
    // console.log(divPortafolio.childNodes);
}

// Funcion verificarDatos()
// const verificarDatos = function () {
//     var name = docenteForm['docenteNombre'].value;
//     var email = docenteForm["docenteEmail"].value;
//     var summary = docenteForm["docenteResumen"].value;
//     var category = docenteForm["docenteCategoria"].value;
//     var cv = docenteForm["docenteCV"].files[0];
//     var image = docenteForm["docentePortafolio_0"];
//     console.log(name, email, summary, category, cv, image.files[0]);
// }


// Funcion initApp() utilizada para verificar si un usuario esta autenticado
async function initApp() {
    // var state;
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            currentUser = user;
            

            // document.getElementById('dropdown1Text').textContent = user.email;
            // idDropdown.setAttribute('style', '');
            // btnLogOut.disabled = false;
            // state = true;
            document.getElementById('dropdown1Text').textContent = user.displayName;
            idDropdown.setAttribute('style', '');
            idLogin.setAttribute('style', 'display:none;');
            idRegistrarseBtn.setAttribute('style', 'display:none;');
            var userRol = '';
            var userEnable = false;
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                    userEnable = doc1.data().userEnable;
                });                
                switch (userRol) {
                    case 'Lector':
                    
                        break;

                    case 'Editor':
                        idListaDocentesBtn.setAttribute('style', '');
                        idListaDocentesBtnMovil.setAttribute('style', '');
                    
                        break;
                
                    case 'Administrador':
                        idListaUsuarios.setAttribute('style', '');
                        idListaUsuariosMovil.setAttribute('style', '');
                        idOpcionesBtn.setAttribute('style', '');
                        idOpcionesBtnMovil.setAttribute('style', '');
                        idListaDocentesBtn.setAttribute('style', '');
                        idListaDocentesBtnMovil.setAttribute('style', '');
                        break;

                    default:
                        break;
                }   
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            console.log('User is signed in', user.displayName, userRol);
            btnLogOut.setAttribute('style', '');
            if (userEnable == true) {
                if (userRol=='Lector') {
                    location.href = 'listaDocentes.html'
                } else {
                    
                }
                
            }else{
                location.href = 'deshabilitado.html';
            }
            
            
        } else {
            console.log('User is signed out');
            // document.getElementById('formRegistroDocentes').textContent = 'Acceso denegado!!! Inicie sesión o registrese.';
            document.getElementById('formRegistroDocentes').setAttribute('style','');
            // idDropdown.setAttribute('style', 'display:none;');
            // btnLogOut.disabled = true;
            // state = false;
            document.getElementById('dropdown1Text').textContent = 'Usuario';
            idDropdown.setAttribute('style', 'display:none;');
            idLogin.setAttribute('style', '');
            idRegistrarseBtn.setAttribute('style', '');
            btnLogOut.setAttribute('style', 'display:none;');

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

// Funcion asincrona que se ejecuta mediante el evento 'DOMContentLoaded' (el documento registroDocentes.html a sido cargado)
window.addEventListener('DOMContentLoaded', async (e) => {
    initApp();

    // Se inicializa la barra de navegacion y el modal, requerido de acuerdo a la documentacion de materialize
    $('.sidenav').sidenav();
    $('.modal').modal();


    //
    document.getElementById('formRegistroDocentes').setAttribute('style','');

    // Se ejecuta la funcion createBtnPortafolio() que realiza el proceso de creacion de los elementos y estilos del boton que guarda las imagenes del portafolio y el documento CV
    createBtnPortafolio(0);

    // Se realiza la consulta a la coleccion 'lms-categorias' para luego llenar el elemento <select> con las categorias existentes en la coleccion 'lms-categorias', en el formulario de registro 
    var selectCategoryId = document.getElementById("docenteCategoria");
    const lmsCategorias = await getCat();
    lmsCategorias.forEach(docC => {
        console.log(docC.data());
        var optionCat = document.createElement('option');
        optionCat.value = docC.data().nombreCat;
        var optionCatText = document.createTextNode(docC.data().nombreCat);
        optionCat.appendChild(optionCatText);
        selectCategoryId.appendChild(optionCat);
    })

    // Se realiza la consulta a la coleccion 'lms-tipos' para luego llenar el elemento <select> con los tipos existentes en la coleccion 'lms-tipos', en el formulario de registro 
    var selectTypeId = document.getElementById("docenteTipo");
    const lmsTipos = await getType();
    lmsTipos.forEach(docT => {
        console.log(docT.data());
        var optionType = document.createElement('option');
        optionType.value = docT.data().nombreTipo;
        var optionTypeText = document.createTextNode(docT.data().nombreTipo);
        optionType.appendChild(optionTypeText);
        selectTypeId.appendChild(optionType);
    })

    // Se inicializa el elemento <select> despues de tener listas todas opciones de las categorias y tipos
    $(document).ready(function(){
        $('select').formSelect();
    });
    
})

//
docenteForm.addEventListener('submit', async (e) => {
    e.preventDefault();//Impide que el formulario se recargue en el evento submit

    $('#modal1').modal('open');

    const name = docenteForm['docenteNombre'].value;
    const email = docenteForm["docenteEmail"].value;
    const summary = docenteForm["docenteResumen"].value;
    const category = docenteForm["docenteCategoria"].value;
    const type = docenteForm["docenteTipo"].value;

    progressBarElements('Registrando docente', 'regDocBar');

    // Se ejecuta la funcion saveUser() que guarda los datos del docentes en la coleccion 'lms-docentes' en firebase
    await saveUser(name, email, summary, category, type);

});

//
uploadImg = function(ref){
    let imagenesSubidas=[];
    // var docenteArchivos = new Object();
    //contar numero de imagenes, capturar 'n' imagenes y subirlas a firebase
    for (let img = 0; img < 6; img++) {
        const inputImg = document.getElementById('docentePortafolio_'+img);
        if (inputImg) {

            if (inputImg.files[0]) {
                progressBarElements('Guardando imagen '+inputImg.files[0].name, 'imgProgBar_'+img);

                console.log('Imagen:'+img+' existe..... '+inputImg);
                // c1 = img;
                //////(cambiar descripcion) espacio de las lineas de codigo, ubicadas en la funcion uploadImageProccess()
                uploadImageProccess(img, imagenesSubidas, ref);
            }else{
                console.log('Imagen:'+img+' no esxiste');
            }
        } else {
            console.log('Imagen:'+img+' no esxiste');
        }
        // const ;
    }
    // Imprime en consola cuantas imagenes se subiran
    // console.log(c1);
};

//
uploadImageProccess = function (imgNumber, imagenesSubidas, refid) {
    c1=c1+1;

    /////////////////////// -- (Cambiar comnetario) Posible solucion: ejecutaar las siguientes lineas de codigo en una funcion, y utilizar funciones recursivas para subir una imagen luego de otra y asi obtener el nombre de la imagen y la ruta
    var file = docenteForm["docentePortafolio_"+imgNumber].files[0];
    console.log(file);

    if (!file) {
        console.log('No hay imagen existente');
        
    }else{

        // Inicio del proceso de imagenes a subir
        console.log('proceso de subir una imagen');
        
        var storageRef = storage.ref('/portafolioDocente/'+file.name);

        var uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed', function(snapshot){

            // Progreso de la imagen a subir
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(file.name+' subiendo ' + progress + '% completado');

        }, function (error) {
            console.log(error);
            
        }, function () {
            console.log('Imagen '+c1+' '+file.name+' subida');
            
            // var completeProgBar = document.getElementById('imgProgBar_'+imgNumber);
            // completeProgBar.className = 'determinate';
            // completeProgBar.setAttribute('style', 'width: 70%');
            completedProgressBar('imgProgBar_'+imgNumber, '70%');

            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                console.log(url);

                imagenesSubidas.push(file.name);
                console.log(imagenesSubidas, file.name);
                // confirmacionRegistro(imgNumber, c1-1);
                
                // --(posible accion a borrar) Se asigna a las variables los valores de la refernecia al docente que subio sus archivos, y las rutas de los mismos
                // const refid = 'docente1';
                
                // (posible ubicacion distinta) Se ejecuta la funcion saveDocuments() que guarda las rutas de las imagenes y el documento pdf, con una refenrencia hacia el docente al que pertenecen los archivos
                saveDocuments(file.name, refid, url, 'imagen', 'imgProgBar_'+imgNumber);

                /* // -- lineas de codigo a borrar posiblemente
                docenteArchivos.rutaImagen[imgNumber] = url;
                console.log(docenteArchivos);/* */
                
                // insertar imagen subida a un elemento de imagen en html (posible utilizacion para la siguiente pagina que muestre los datos del docente, el cv y su portafolio)
                //   var img = document.getElementById('myimg');
                //   img.src = url;

            })
        });
        
        // Fin de proceso de imagenes a subir
    }/* */
}

//
uploadDocument = function(refid){
    var docFile = docenteForm['docenteCV'].files[0];
    console.log(docFile);
    if (!docFile) {
        
    }else{
        progressBarElements('Guardando CV '+docFile.name, 'documentCV');

        var storageDocRef = storage.ref('/cvDocente/'+docFile.name)
        var uploadDoc = storageDocRef.put(docFile);
        uploadDoc.on('state_changed', function (snapshot) {
            
        }, function (error) {
            console.log(error);

        }, function () {
                
            // var completeProgBar = document.getElementById('documentCV');
            // completeProgBar.className = 'determinate';
            // completeProgBar.setAttribute('style', 'width: 100%');
            completedProgressBar('documentCV', '70%');
            console.log('Documento subido');
            uploadDoc.snapshot.ref.getDownloadURL().then(function (url) {
                console.log(url);
                console.log(docFile.name);

                saveDocuments(docFile.name, refid, url, 'pdf', 'documentCV');
                
            })
        });
    }
};

//
// confirmacionRegistro = function (subir, subido) {
//     console.log(subir, subido);
//     if (subir == subido) {
//         console.log("Todas la imagenes subidas");
//         var idModalContent = document.getElementById('modalContent');
//         var idModalProgress = document.getElementById('modalProgress');
//         var newModalProgress = document.createElement('h1');
//         newModalProgress.id = 'modalProgress';
//         var modalProgressText = document.createTextNode('Registrado correctamete!');
//         newModalProgress.appendChild(modalProgressText);
//         idModalContent.replaceChild(newModalProgress, idModalProgress);
//     } else {
        
//     }
    
// }

//
progressBarElements = function (progressTitle, idProgress) {
    var modalProgressBar = document.getElementById('modalProgress');
    var registerDocProgresdBar = document.createElement('div');
    registerDocProgresdBar.className = 'progress';
    var regDocProgBarValue = document.createElement('div');
    regDocProgBarValue.className = 'indeterminate';
    regDocProgBarValue.id = idProgress;
    registerDocProgresdBar.appendChild(regDocProgBarValue);
    var progressBarText = document.createElement('h5');
    progressBarText.textContent = progressTitle;

    var divProgressBar = document.createElement('div');

    divProgressBar.appendChild(progressBarText);
    divProgressBar.appendChild(registerDocProgresdBar);

    modalProgressBar.appendChild(divProgressBar);
}

//
completedProgressBar = function (idProgressBar, widthProgressBar) {
    var completeProgBar = document.getElementById(idProgressBar);
    completeProgBar.className = 'determinate';
    completeProgBar.setAttribute('style', 'width: '+widthProgressBar+'');
}

//
createBtnPortafolio = function (nroBtn) {
    // Variable divPortafolio que guarda el elemento <div> donde se agregaran los botones para subir las imagenes del portafolio, en el documento registroDocentes.html
    var divPortafolio = document.getElementById('idPortafolio');

    var newInput = document.createElement('input');
    newInput.type='file';
    newInput.accept = 'image/*';
    newInput.id='docentePortafolio_'+nroBtn;
    newInput.onchange = function () { 
        newBtnPortafolio(this.value); 
    };
    var newSpan = document.createElement('span');
    var spanText = document.createTextNode('Portafolio');
    newSpan.appendChild(spanText);
    var divBtn = document.createElement('div');
    divBtn.className = 'btn red';
    divBtn.appendChild(newSpan);
    divBtn.appendChild(newInput);
    var newInputText = document.createElement('input');
    newInputText.type = 'text';
    newInputText.className = 'file-path validate';
    newInputText.placeholder = 'Selecciona una imagen';
    var divInputText = document.createElement('div');
    divInputText.className = 'file-path-wrapper';
    divInputText.appendChild(newInputText);
    var divInputFile = document.createElement('div');
    divInputFile.className = 'file-field input-field';
    divInputFile.appendChild(divBtn);
    divInputFile.appendChild(divInputText);
    divPortafolio.appendChild(divInputFile);
}