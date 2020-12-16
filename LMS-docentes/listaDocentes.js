// Funcion getDocentes() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getDocentes = () => db.collection('lms-docentes').get();//orderBy('name').

// Funcion getCat() que obtiene todos los datos de las categorias registradas en la coleccion 'lms-categorias' de Firebase
const getCat = () => db.collection('lms-categorias').orderBy('nombreCat').get();//

// Funcion getType() que obtiene todos los datos de los tipos registradas en la coleccion 'lms-tipos' de Firebase
const getType = () => db.collection('lms-tipos').orderBy('nombreTipo').get();//

// Funcion getDoc() que obtiene, mediante su id, todos los datos del docente registrado en la coleccion 'lms-docentes' de Firebase
const getDoc = (id) => db.collection('lms-docentes').doc(id).get();

// Funcion getOptions() que obtiene las opciones guradadas en la coleccion 'lms-opciones'
const getOptions = () => db.collection('lms-opciones').get();

const docGetCategory = (id) => db.collection('lms-categorias').doc(id).get();

const docGetType = (id) => db.collection('lms-tipos').doc(id).get();

// Contador utlizado para contar el numero de cards de docentes, utilizado tambien para las id de los elementos generados para los cards de docentes
var c1 = 0;

// Contador paginas totales, utilizado para la paginacion
var countPages = 0;

// Contador pagina actual, utilizado para la paginacion
var currentPage = 0;

// Contador de items por pagina, utilizado para la paginacion
var pageItems = 6;

// Contador de primer elemento a mostrar en la pagina, utilizado para la paginacion
var firstItem = 0;

// Contador de ultimo elemento a mostrar en la pagina, utilizado para la paginacion
var lastItem = 0;

// Varible que guarda la categoria, utilizada para que se mantenga el filtro en la categoria seleccionada al momento de recargar la lista de docentes en las acciones de editar y eliminar docente
var categoriaGlobal = document.getElementById('docenteCategoria').value;

// Variable que captura el elemento <select> y sus elementos <option> de tipo de docente
var selectBoxType = document.getElementById('docenteTipo');

// Varialbe que guarda el tipo, utiliada para que se mantenga el filtro en el tipo seleccionado al momento de recargar la lista de docentes en las acciones de editar y eliminar docente
var tipoGlobal = selectBoxType.value;

// Variable que guarda los datos de los docentes despues de la consulta a la coleccion 'lms-docentes'
var listaLmsDoc = '';

// Variablel de tipo array que guarda los elementos de las cards de los docentes, esta variable es utilizada para la paginacion
var docentesCards = [];

// Variable que guarda el rol de usuario, utilizada para los permisos de acuerdo al rol de ususario
var userRol = '';

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');

// Variable que captura el elemento del menu de la barra de navegacion que lleva a la vista 'listaUsuarios.html'
var idListaUsuarios = document.getElementById('idListaUsuarios');

// Variable que captura el elemento del menu de la barra de navegacion que lleva a la vista 'opciones.html'
var idOpcionesBtnMovil = document.getElementById('idOpcionesBtnMovil');

// Variable que captura el elemento del menu de la barra de navegacion que lleva a la vista 'registroDocentes.html'
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');

// Variable que captura el elemento del menu de la barra de navegacion que lleva a la vista 'listaDocentes.html'
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');

// Variable que captura el elemento del menu de la barra de navegacion que lleva a la vista 'registroUsuario.html'
var idRegistrarseBtn = document.getElementById('idRegistrarseBtn');

// Variable que captura el elemento del menu de la barra de navegacion que lleva a la vista 'login.html'
var idLogin = document.getElementById('idLogin');

// Variable que captura el elemento del menu responsivo de la barra de navegacion en moviles utilizado para cerrar sesion
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');

// Variable que captura el elemento del menu responsivo de la barra de navegacion en moviles que lleva a la vista 'listaUsuarios.html'
var idListaUsuariosMovil = document.getElementById('idListaUsuariosMovil');

// Variable que captura el elemento del menu responsivo de la barra de navegacion en moviles que lleva a la vista 'opciones.html'
var idOpcionesBtn = document.getElementById('idOpcionesBtn');

// Variable que captura el elemento del menu responsivo de la barra de navegacion en moviles que lleva a la vista 'registroDocentes.html'
var idRegistrarDocenteBtnMovil = document.getElementById('idRegistrarDocenteBtnMovil');

// Variable que guarda al usuario con sesion iniciada
var currentUser = '';

// Variable que guarda el valor de numero maximo de imagenes que se mostraran
var numMaxImg = 0;

var modals = document.getElementsByClassName('modal-close');
console.log(modals);


// Funcion saveFile() que realiza el registro de los datos de los archivos en la coleccion 'lms-archivos', requiere los parametros: fileName (Nombre de archivo a guardar, imagen o PDF), refid (La id del docente al que se vinculara el archivo, imagen o PDF), url (Ubicacion donde sera subido el archivo en el storage del proyecto), type (Tipo de archivo que se esta guardando, imagen - PDF)
const saveFile = (fileName, refid, url, type) => 
    db.collection('lms-archivos').add({
        fileName,
        refid,
        url,
        type,
    }).then(async function (fileData) {
        // Si los datos de archivo se registran correctamente se ejecutara lo siguiente
        console.log('Datos guardados en la coleccion lms-archivos', refid);
        var docente = await getDoc(refid);
        // Se verifica que el archivo guardado sea una imagen o un PDF, en case de ser imagen se recarga el modal de portafolio de docente, caso contrario se recarga la lista de docentes
        if (type == 'imagen') {
            // Se ejecuta la funcion portafolio(), que recarga el modal donde se muestran las imagenes del portafolio de docente
            portafolio(docente.data().name, refid, true);
        } else {
            // Se cierra el modal de Editar CV
            // $('.modal').modal('close');
            modals[0].click();
            modals[1].click();
            //Se verifica que los filtros de categoria y tipo sean distinto a "todos" o "todas", y asi recargar la lista de docentes con los mismos filtros de categoria seleccionados
            if (categoriaGlobal != "todas") {
                if (tipoGlobal != "todos") {
                    // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo y categoria, de acuerdo al filtro selecionado
                    db.collection("lms-docentes").where("category", "==", categoriaGlobal).where("type", "==", tipoGlobal)//.orderBy('name')
                    .get()
                    .then(function(querySnapshot) {
                        // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                        listaDocentes(querySnapshot);
                    })
                    .catch(function(error) {
                        // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a una categoria, de acuerdo al filtro selecionado
                    db.collection("lms-docentes").where("category", "==", categoriaGlobal)//.orderBy('name')
                    .get()
                    .then(function(querySnapshot) {
                        // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                        listaDocentes(querySnapshot);
                    })
                    .catch(function(error) {
                        // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                        console.log("Error getting documents: ", error);
                    });
                }
            } else {
                if (tipoGlobal != "todos") {
                    // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo, de acuerdo al filtro selecionado
                    db.collection("lms-docentes").where("type", "==", tipoGlobal)//.orderBy('name')
                    .get()
                    .then(function(querySnapshot) {
                        // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                        listaDocentes(querySnapshot);
                    })
                    .catch(function(error) {
                        // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    const lmsDocentes = await getDocentes();
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de todos los docentes
                    listaDocentes(lmsDocentes);   
                }
            }
        }

        // Se capturan el nombre de la imagen a registrar y su id
        var log1 = {
            logType: 'Registro de archivo',
            lastRegister: '',
            newRegister: fileName,
            idRegister: refid,
        };
        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta registrando una imagen del portafolio de docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos de la imagen), cuarto parametro (la id de la imagen)
        logRegister(currentUser.displayName, currentUser.uid, log1, fileData.id);
    }).catch(function(error){
        // Si los datos de archivo no se registraron correctamente se mustra un mensaje de error
        console.log('No se pudo registrar correctamente los datos de archivo', error);
        
    });

// Funcion deleteCV() que elimina la referencia del CV de docente de la coleccion 'lms-archivos'
const deleteCV = (id, refId, namefile) => db.collection('lms-archivos').doc(id).delete()
    .then(async function () {
        // Se cierra el modal de Editar CV
        // $('.modal').modal('close');
        modals[0].click();
        modals[1].click();
        // Se capturan el nombre del CV a eliminar y su id
        var log1 = {
            logType: 'Eliminacion de archivo',
            lastRegister: '',
            newRegister: namefile,
            idRegister: refId,
        };
        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta eliminando una imagen del portafolio de docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos de la imagen que se elimino), cuarto parametro (la id de la imagen)
        logRegister(currentUser.displayName, currentUser.uid, log1, id);
        console.log('Datos eliminados correctamente');
        
    })
    .catch(function (error) {
        console.log('Ocurrion un error al intentar borrar el docuento', error);
        
    });

// Funcion deleteDoc() que elimina los datos de docente de la coleccion 'lms-docentes', requiere el parametro: id (Id del docente)
const deleteDoc = (id, nameDelete) => db.collection('lms-docentes').doc(id).delete()
    .then(async function() {
        // Si los datos del docente fueron eliminados correctamente se ejecuta los siguiente
        //Se verifica que los filtros de categoria y tipo sean distinto a "todos" o "todas", y asi recargar la lista de docentes con los mismos filtros de categoria seleccionados, al momento de eliminar los datos de los docentes
        if (categoriaGlobal != "todas") {
            if (tipoGlobal != "todos") {
                // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo y categoria, de acuerdo al filtro selecionado
                db.collection("lms-docentes").where("category", "==", categoriaGlobal).where("type", "==", tipoGlobal)//.orderBy('name')
                .get()
                .then(function(querySnapshot) {
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                    listaDocentes(querySnapshot);
                })
                .catch(function(error) {
                    // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                    console.log("Error getting documents: ", error);
                });
            } else {
                // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a una categoria, de acuerdo al filtro selecionado
                db.collection("lms-docentes").where("category", "==", categoriaGlobal)//.orderBy('name')
                .get()
                .then(function(querySnapshot) {
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                    listaDocentes(querySnapshot);
                })
                .catch(function(error) {
                    // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                    console.log("Error getting documents: ", error);
                });
            }
        } else {
            if (tipoGlobal != "todos") {
                // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo, de acuerdo al filtro selecionado
                db.collection("lms-docentes").where("type", "==", tipoGlobal)//.orderBy('name')
                .get()
                .then(function(querySnapshot) {
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                    listaDocentes(querySnapshot);
                })
                .catch(function(error) {
                    // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                    console.log("Error getting documents: ", error);
                });
            } else {
                const lmsDocentes = await getDocentes();
                // Se ejecuta la funcion listaDocentes() que recarga la lista de todos los docentes
                listaDocentes(lmsDocentes);   
            }
        }

        // Se capturan el nombre del docente a eliminar y su id
        var log1 = {
            logType: 'Eliminacion',
            lastRegister: '',
            newRegister: nameDelete,
            idRegister: id,
        };
        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta modificando a un docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos del docente que se elimino), cuarto parametro (la id del docente registrado)
        logRegister(currentUser.displayName, currentUser.uid, log1, id);
        console.log("Document successfully deleted!", categoriaGlobal);
    }).catch(function(error) {
        // Si los datos del docente no fueron eliminados correctamente se muestra un mensaje de error
        console.error("Error removing document: ", error);
    });

// Funcion deleteImgPortafolio() que elimina la imagen del portafolio de docente de la coleccion 'lms-archivos', requiere los parametros: id (id de los datos de la imagen), refid (id del docente al que pertenece la imagen), imgData (nombre de la imagen que sera eliminada)
const deleteImgPortafolio = (id, refid, imgData) => db.collection('lms-archivos').doc(id).delete()
    .then(async function() {
        // Si los datos de la imagen se elimino correctamente se ejecuta lo siguiente
        // Se ejecuta la funcion portafolio(), que recarga el modal donde se muestran las imagenes del portafolio de docente, despues de eliminar la imagen
        var docente = await getDoc(refid);
        
        portafolio(docente.data().name, refid, true);

        // Se capturan el nombre de la imagen a eliminar y su id
        var log1 = {
            logType: 'Eliminacion de archivo',
            lastRegister: '',
            newRegister: imgData,
            idRegister: refid,
        };
        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta eliminando una imagen del portafolio de docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos de la imagen que se elimino), cuarto parametro (la id de la imagen)
        logRegister(currentUser.displayName, currentUser.uid, log1, id);

        console.log("Image successfully deleted!", categoriaGlobal);
    }).catch(function(error) {
        // Si los datos de la imagen no fueron eliminados correctamente se muestra un mensaje de error
        console.error("Error removing document: ", error);
    });

// Funcion updateDoc() que edita los datos de docente en la coleccion 'lms-docentes', requiere los parametros: id (id del docente), updatedDoc (un objeto que contiene los datos de docente a editar)
const updateDoc = (id, updatedDoc, currentDoc) => db.collection('lms-docentes').doc(id).update(updatedDoc)
    .then(async function() {
        // Si los datos de docente se modificaron correctamente se ejecutara lo siguiente        
        //Se verifica que los filtros de categoria y tipo sean distinto a "todos" o "todas", y asi recargar la lista de docentes con los mismos filtros de categoria seleccionados, al momento de modificar los datos de los docentes
        if (categoriaGlobal != "todas") {
            if (tipoGlobal != "todos") {
                // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo y categoria, de acuerdo al filtro selecionado
                db.collection("lms-docentes").where("category", "==", categoriaGlobal).where("type", "==", tipoGlobal)//.orderBy('name')
                .get()
                .then(function(querySnapshot) {
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                    listaDocentes(querySnapshot);
                })
                .catch(function(error) {
                    // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                    console.log("Error getting documents: ", error);
                });
            } else {
                // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a una categoria, de acuerdo al filtro selecionado
                db.collection("lms-docentes").where("category", "==", categoriaGlobal)//.orderBy('name')
                .get()
                .then(function(querySnapshot) {
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                    listaDocentes(querySnapshot);
                })
                .catch(function(error) {
                    // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                    console.log("Error getting documents: ", error);
                });
            }
        } else {
            if (tipoGlobal != "todos") {
                // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo, de acuerdo al filtro selecionado
                db.collection("lms-docentes").where("type", "==", tipoGlobal)//.orderBy('name')
                .get()
                .then(function(querySnapshot) {
                    // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                    listaDocentes(querySnapshot);
                })
                .catch(function(error) {
                    // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                    console.log("Error getting documents: ", error);
                });
            } else {
                const lmsDocentes = await getDocentes();
                // Se ejecuta la funcion listaDocentes() que recarga la lista de todos los docentes
                listaDocentes(lmsDocentes);   
            }
        }
        // Se realiza una comparacion de los datos antiguos con los datos nuevos del docente a modificar
        var lastReg = '';
        var newReg = '';
        if (currentDoc.name != updatedDoc.name) {
            lastReg = 'Nombre: '+currentDoc.name;
            newReg = 'Nombre: '+updatedDoc.name;
        }
        if (currentDoc.email != updatedDoc.email) {
            lastReg = lastReg+' | '+'Email: '+currentDoc.email;
            newReg = newReg+' | '+'Email: '+updatedDoc.email;
        }
        if (currentDoc.summary != updatedDoc.summary) {
            lastReg = lastReg+' | '+'Resumen: '+currentDoc.summary;
            newReg = newReg+' | '+'Resumen: '+updatedDoc.summary;
        }
        if (currentDoc.experience != updatedDoc.experience) {
            lastReg = lastReg+' | '+'Experiencia laboral: '+currentDoc.experience;
            newReg = newReg+' | '+'Experiencia laboral: '+updatedDoc.experience;
        }
        if (currentDoc.lastWork != updatedDoc.lastWork) {
            lastReg = lastReg+' | '+'Ultimo trabajo: '+currentDoc.lastWork;
            newReg = newReg+' | '+'Ultimo trabajo: '+updatedDoc.lastWork;
        }
        if (currentDoc.phone != updatedDoc.phone) {
            lastReg = lastReg+' | '+'Telefono: '+currentDoc.phone;
            newReg = newReg+' | '+'Telefono: '+updatedDoc.phone;
        }
        if (currentDoc.category != updatedDoc.category) {
            lastReg = lastReg+' | '+'Categoria: '+currentDoc.category;
            newReg = newReg+' | '+'Categoria: '+updatedDoc.category;
        }
        if (currentDoc.type != updatedDoc.type) {
            lastReg = lastReg+' | '+'Tipo: '+currentDoc.type;
            newReg = newReg+' | '+'Tipo: '+updatedDoc.type;
        }
        var log1 = {
            logType: 'Modificacion',
            lastRegister: lastReg,
            newRegister: newReg,
            idRegister: id,
        };
        console.log(log1);
        
        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta modificando a un docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos del docente que se modificaron), cuarto parametro (la id del docente registrado)
        logRegister(currentUser.displayName, currentUser.uid, log1, id);
        console.log("Document successfully updated!", categoriaGlobal);
    }).catch(function(error) {
        // Si los datos del docente no fueron modificados correctamente se muestra un mensaje de error
        console.error("Error updating document: ", error);
    });

// Funcion updateFile() que edita los datos de los archivos del docente (imagenes y PDF) en la coleccion 'lms-archivos', requiere los parametros: id (id del archivo), refid (id del docente al que pertenece el archivo), fileType (el tipo de archivo, image - pdf), updatedFile (un objeto que contiene los datos del archivo a editar)
const updateFile = (id, refid, fileType, updatedFile, currentFile) => db.collection('lms-archivos').doc(id).update(updatedFile)
    .then(async function() {
        // Si los datos del archivo se modificaron correctamente se ejecuta lo siguiente
        // Se capturan el nombre de la imagen a cambiar y su id
        var log1 = {
            logType: 'Cambio de archivo',
            lastRegister: currentFile,
            newRegister: updatedFile.fileName,
            idRegister: refid,
        };
        // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta cambiando una imagen del portafolio de docente o el documento CV, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos del archivo), cuarto parametro (la id del archivo)
        logRegister(currentUser.displayName, currentUser.uid, log1, id);

        // Se verifica el tipo del archivo a editar, si es imagen o pdf
        switch (fileType) {
            // En caso de que el tipo del archivo sea pdf, se recarga la lista de docentes
            case 'pdf':
                // Se cierra el modal de Editar CV
                // $('.modal').modal('close');
                modals[0].click();
                modals[1].click();
                //Se verifica que los filtros de categoria y tipo sean distinto a "todos" o "todas", y asi recargar la lista de docentes con los mismos filtros de categoria seleccionados, al momento de modificar el documento pdf del CV de docente
                if (categoriaGlobal != "todas") {
                    if (tipoGlobal != "todos") {
                        // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo y categoria, de acuerdo al filtro selecionado
                        db.collection("lms-docentes").where("category", "==", categoriaGlobal).where("type", "==", tipoGlobal)//.orderBy('name')
                        .get()
                        .then(function(querySnapshot) {
                            // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                            listaDocentes(querySnapshot);
                        })
                        .catch(function(error) {
                            // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                            console.log("Error getting documents: ", error);
                        });
                    } else {
                        // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a una categoria, de acuerdo al filtro selecionado
                        db.collection("lms-docentes").where("category", "==", categoriaGlobal)//.orderBy('name')
                        .get()
                        .then(function(querySnapshot) {
                            // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                            listaDocentes(querySnapshot);
                        })
                        .catch(function(error) {
                            // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                            console.log("Error getting documents: ", error);
                        });
                    }
                } else {
                    if (tipoGlobal != "todos") {
                        // Se realiza una consulta a la coleccion 'lms-docentes' seleccionando solo los docentes que pertenezcan a un tipo, de acuerdo al filtro selecionado
                        db.collection("lms-docentes").where("type", "==", tipoGlobal)//.orderBy('name')
                        .get()
                        .then(function(querySnapshot) {
                            // Se ejecuta la funcion listaDocentes() que recarga la lista de los docentes de acuerdo a los resultados de la consulta realizada anteriormente
                            listaDocentes(querySnapshot);
                        })
                        .catch(function(error) {
                            // Si la consulta a la coleccion 'lms-docentes' no se ejecuto correctamente, se muestra un mensaje de error
                            console.log("Error getting documents: ", error);
                        });
                    } else {
                        const lmsDocentes = await getDocentes();
                        // Se ejecuta la funcion listaDocentes() que recarga la lista de todos los docentes
                        listaDocentes(lmsDocentes);   
                    }
                }
                break;

            // En caso de que el tipo de archivo sea una imagen solo se recargan las imagenes del portafolio de docente
            case 'image':
                // Se ejecuta la funcion portafolio(), que recarga el modal donde se muestran las imagenes del portafolio de docente
                var docente = await getDoc(refid);
        
                portafolio(docente.data().name, refid, true);
                break;
        
            default:
                break;
        }
        
        console.log("Document successfully updated!", categoriaGlobal);
    }).catch(function(error) {
        // Si los datos de archivo no fueron modificados correctamente se muestra un mensaje de error
        console.error("Error updating document: ", error);
    });

// Funcion portafolio() que muestra las imagenes del portafolio de docente seleccionado en un modal, requiere los parametros: docName (nombre del docente que se mostrara en el titulo del modal), docRef (id del docente utilizado para obtener las imagenes realizando una colsulta a la coleccion 'lms-archivos'), editPortafolio (de tipo boolean, este parametro es utilizado para determinar si se mostraran los botones de editar y eliminar imagenes en el modal)
portafolio = function (docName, docRef, editPortafolio) {
    document.getElementById('modal1Title').textContent = 'Portafolio de '+docName;
    // Se reemplaza los elementos anteriores del modal con los nuevos elementos utilizando la funcion replaceChild() de javascript
    var idModalBody = document.getElementById('idModalBody');
    var idVerPortafolio = document.getElementById('verPortafolio');
    var pad = document.createElement('div');
    pad.className = 'row';
    pad.id = "verPortafolio";
    idModalBody.replaceChild(pad, idVerPortafolio);
    // Fin para reemplazar los elementos anteriores con los nuevos

    // Contador para el numero de imagenes de portafolio del docente
    var countImagesPortafolio = 0;

    // Se realiza una cosulta a la coleccion 'lms-archivos', que pertenescan al docente del cual se desea ver su portafolio y que sean de tipo imagen
    db.collection("lms-archivos").where("refid", "==", docRef).where("type", "==", "imagen")
    .get()
    .then(function(querySnapshot) {
        // Se realiza la funcion forEach() para el resultado de la consulta, de acuerdo al numero de imagenes que tenga un docente en su portafolio
        querySnapshot.forEach(function(doc1) {
            
            countImagesPortafolio = countImagesPortafolio + 1;

            // Se crea los elementos necesarios para la visualizacion de las imagenes
            var divColImagePortafolio = document.createElement('div');
            divColImagePortafolio.className = 'col s6 m4';
            var divRowEditImageBtn = document.createElement('div');
            divRowEditImageBtn.className = 'row'
            var divColEditImage = document.createElement('div');
            divColEditImage.className = 'col s12 portafolioImg';
            divRowEditImageBtn.appendChild(divColEditImage);

            var imagenPortafolio = document.createElement('img');
            // Se colocar la url de la imagen en la propiedad src del elemento <img> creado, que mostrara las imagenes en pequeños recuadros
            imagenPortafolio.src = doc1.data().url;
            
            divColEditImage.appendChild(imagenPortafolio);
            // Fin de creacion de elementos para la visualizacion de imagenes

            // Si el modal con las imagenes del portafolio se pueden editar entonces se agregan los botones de editar y eliminar a los recuadros de las imagenes
            if (editPortafolio) {
                // Se crean los elementos necesarios para el boton 'Cambiar' para las imagenes en el modal de portafolio de docentes
                var divColEditImageBtn = document.createElement('div');
                divColEditImageBtn.className = 'col s6';
                var divInputField = document.createElement('div');
                divInputField.className = 'file-field input-field divBtnChangeFile';
                var divEditButton = document.createElement('div');
                divEditButton.className = 'btn red btnChangeFile';
                var spanEditBtn = document.createElement('span');
                spanEditBtn.textContent = 'Cambiar';
                var editImageBtn = document.createElement('input');
                editImageBtn.type = 'file';
                editImageBtn.accept = "image/*";
                editImageBtn.className = 'changeFileBtn';
                // Se asigna el evento 'onchange' al boton 'Cambiar' que realiza la captura del archivo para luego subirlo al storage
                editImageBtn.onchange = function () {
                    // Se captura el archivo
                    var docFileCV = this.files[0];
                    if (!docFileCV) {

                    }else{
                        // Se realiza el proceso de subir el archivo al storage
                        var storageDocRef = storage.ref('/portafolioDocente/'+docFileCV.name)
                        var uploadDoc = storageDocRef.put(docFileCV);
                        uploadDoc.on('state_changed', function (snapshot) {
                            
                        }, function (error) {
                            console.log(error);
                
                        }, function () {
                            console.log('Imagen cambiada');
                            // En caso de que se haya subido la imagen se obtiene la url de su ubicacion
                            uploadDoc.snapshot.ref.getDownloadURL().then(async function (url1) {
                                // Luego de subir la imagen al storage se obtiene la url y se modifica la referencia en la coleccion 'lms-archivos', se pasan los parametros: (id de la referencia, id del docente, tipo de archivo que se esta cambiando, el nombre del archivo y la url de su ubicacion, nombre del archivo que sera reemplazado)
                                await updateFile(doc1.id, docRef, 'image', {
                                    fileName: docFileCV.name,
                                    url: url1,
                                }, doc1.data().fileName);
                            })
                        });
                    }
                };
                var newInputText = document.createElement('input');
                newInputText.type = 'text';
                newInputText.setAttribute('style', 'display:none;');
                newInputText.className = 'file-path validate';
                newInputText.placeholder = 'Selecciona una imagen';
                var divInputText = document.createElement('div');
                divInputText.className = 'file-path-wrapper';
                divInputText.appendChild(newInputText);

                divEditButton.appendChild(spanEditBtn);
                divEditButton.appendChild(editImageBtn);
                divInputField.appendChild(divEditButton);
                divInputField.appendChild(divInputText);
                divColEditImageBtn.appendChild(divInputField);
                // Fin para la creacion de elementos del boton 'Cambiar', en el modal de portafolio de docentes

                // Se crean los elementos necesarios para el boton 'Eliminar' para las imagenes en el modal de portafolio de docente
                var divColDeleteImageBtn = document.createElement('div');
                divColDeleteImageBtn.className = 'col s6';
                var deleteImageBtn = document.createElement('a');
                deleteImageBtn.className = 'btn deleteFileBtn';
                deleteImageBtn.textContent = 'Eliminar';
                // Se asigna el evento 'onclick' al boton 'Eliminar' que ejecuta la funcion deleteImgPortafolio() que elimina la referencia de la imagen de la coleccion 'lms-archivos'
                deleteImageBtn.onclick = function () {
                    deleteImgPortafolio(doc1.id, docRef, doc1.data().fileName);
                }
                divColDeleteImageBtn.appendChild(deleteImageBtn);
                // Fin para la creacion de elementos del boton 'Eliminar'

                // Se agregan los botones de 'Cambiar' y 'Eliminar' en el recuadro de imagenes del portafolio de docente
                divRowEditImageBtn.appendChild(divColEditImageBtn);
                divRowEditImageBtn.appendChild(divColDeleteImageBtn);
            }
            // Fin para agregar botones de editar y eliminar en los recuadros de las imagenes 
            
            divColImagePortafolio.appendChild(divRowEditImageBtn);
            pad.appendChild(divColImagePortafolio);
        });
        
        // Se comprueba que las imagenes del portafolio no sobrepasen a n numero de imagenes y que el modal de portafolio de imagenes esten disponibels para su edicion, el valor de editProtafolio deberia ser: true; para agregar mas imagenes al portafolio de docente
        if (countImagesPortafolio < numMaxImg && editPortafolio) {
            // Se realiza la creacion de un boton 'Agregar' y sus elementos, que agrega nuevas imagenes al portafolio de docentes, mientras sean menor a el numero de imagenes escogido
            var divColImagePortafolioEmpty = document.createElement('div');
            divColImagePortafolioEmpty.className = 'col s6 m4';
            var divRowAddImageBtn = document.createElement('div');
            divRowAddImageBtn.className = 'row';
            var divColAddImageEmpty = document.createElement('div');
            divColAddImageEmpty.className = 'col s12 portafolioImg';

            var divInputFieldAdd = document.createElement('div');
            divInputFieldAdd.className = 'file-field input-field';

            var divAddButton = document.createElement('div');
            divAddButton.className = 'btn grey';
            var spanAddBtn = document.createElement('span');
            spanAddBtn.textContent = 'Agregar';
            
            var addImageBtn = document.createElement('input');
            addImageBtn.type = 'file';
            addImageBtn.accept = 'image/*';
            addImageBtn.onchange = function () {
                // Se asigna una funcion al evento onchange del boton de 'Agregar' que realiza el proceso de subir la imagen al storage de Firebase y luego guardar sus datos en la coleccion 'lms-archivos'
                var imageFile = this.files[0];
                if (imageFile) {
                    var storageImageRef = storage.ref('/portafolioDocente/'+imageFile.name)
                    var uploadImage = storageImageRef.put(imageFile);
                    uploadImage.on('state_changed', function (snapshot) {
                        
                    }, function (error) {
                        console.log(error);
            
                    }, function () {
                        console.log('Imagen Guardada');
                        uploadImage.snapshot.ref.getDownloadURL().then(async function (urlImage) {
                            saveFile(imageFile.name, docRef, urlImage, 'imagen');
                        })
                    });
                }else{
                    
                }
            }
            // Fin de funcion que realiza el proceso de subir imagenes al storage de Firebase

            divAddButton.appendChild(spanAddBtn);
            divAddButton.appendChild(addImageBtn);

            // Se crean los elementos necesarios para el elemento <input> para su funcionamiento que contiene la imagen nueva que se guardara
            var addInputText = document.createElement('input');
            addInputText.type = 'text';
            addInputText.setAttribute('style', 'display:none;');
            addInputText.className = 'file-path validate';
            addInputText.placeholder = 'Selecciona una imagen';
            var divInputTextAdd = document.createElement('div');
            divInputTextAdd.className = 'file-path-wrapper';
            // Fin de creacion de los elementos necesarios del elemento <input>

            // Se realiza la inclusion de los elementos en el DOM mediante la funcion appendChild() de javascript
            divInputTextAdd.appendChild(addInputText);

            divInputFieldAdd.appendChild(divAddButton);
            divInputFieldAdd.appendChild(divInputTextAdd);

            divColAddImageEmpty.appendChild(divInputFieldAdd);
            divRowAddImageBtn.appendChild(divColAddImageEmpty);
            divColImagePortafolioEmpty.appendChild(divRowAddImageBtn);
            pad.appendChild(divColImagePortafolioEmpty);
            // Fin de la inclusion de elementos necesarios
        } else {
            
        }
    })
    .catch(function(error) {
        // En caso de error se lo muestra en consola
        console.log("Error getting documents: ", error);
    });
}

// Funcion filtroCategoria() que realiza el filtro de docentes de acuerdo a la categoria seleccionada utilizando el elemento <select> de categoria
async function filtroCategoria(catNom) {
    const lmsDocentes = await getDocentes();
    categoriaGlobal = catNom;
    // Se verifica que los filtros de categoria y tipo sean distinto a "todos" o "todas", y asi recargar la lista de docentes con los mismos filtros de categoria seleccionados, para luego realizar las consultas de solo categoria o categoria y tipo
    if (catNom != 'todas') {
        if (tipoGlobal != 'todos') {
            db.collection("lms-docentes").where("category", "==", catNom).where("type", "==", tipoGlobal)
            .get()
            .then(function(querySnapshot) {
                
                listaDocentes(querySnapshot);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });                
        } else {
            db.collection("lms-docentes").where("category", "==", catNom)
            .get()
            .then(function(querySnapshot) {

                listaDocentes(querySnapshot);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });       
        }
    } else {
        if (tipoGlobal != 'todos') {
            db.collection("lms-docentes").where("type", "==", tipoGlobal)
            .get()
            .then(function(querySnapshot) {
                
                listaDocentes(querySnapshot);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });              
        } else {
            listaDocentes(lmsDocentes);        
        }
    }
}

// Funcion filtroTipo() que realiza el filtro de docentes de acuerdo al tipo seleccionado utilizando el elemento <select> de tipo
async function filtroTipo(typeName) {
    console.log(typeName);
    const lmsDocentes = await getDocentes();
    tipoGlobal = typeName; 
    // Se verifica que los filtros de categoria y tipo sean distinto a "todos" o "todas", y asi recargar la lista de docentes con los mismos filtros de tipo seleccionados, para luego realizar las consultas de solo tipo o categoria y tipo
    if (typeName != 'todos') {
        if (categoriaGlobal != 'todas') {
            db.collection("lms-docentes").where("category", "==", categoriaGlobal).where("type", "==", tipoGlobal)
            .get()
            .then(function(querySnapshot) {
               
                listaDocentes(querySnapshot);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });   
        } else {
            db.collection("lms-docentes").where("type", "==", typeName)
            .get()
            .then(function(querySnapshot) {
                
                listaDocentes(querySnapshot);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }
        
    } else {
        if (categoriaGlobal != 'todas') {
            db.collection("lms-docentes").where("category", "==", categoriaGlobal)//.orderBy('name')
            .get()
            .then(function(querySnapshot) {
                
                listaDocentes(querySnapshot);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });              
        } else {
            listaDocentes(lmsDocentes);   
        }
    }   
}

// Se asigna el evento 'change' al elemento <select> de tipo que ejecuta la funcion filtroTipo() para el filtrado de tipo en el listado de docentes
selectBoxType.addEventListener('change', (e) => {
    filtroTipo(e.target.value);
})

// Funcion listaDocentes() que genera los cards de docentes, requiere los siguientes parametros: lmsDocentes(todos los datos de los docentes que se mostraran en la lista de docentes), 
listaDocentes = async function (lmsDocentes) {
    // Contador de cards que se generaran, con un valor inicial en 0
    c1 = 0;
    // Se obtienen los datos de categorias y tipo de las colecciones 'lms-categorias' y 'lms-tipos' para luego mostrarse en los cards
    const lmsCategorias = await getCat();
    const lmsTipos = await getType();

    // Se obtiene la id del elemento <div> donde se muestran los cards de los docentes, utilizando la funcion replaceChild() se refresca la lista cada vez que se ejecute la funcion listaDocentes()
    var idListaD = document.getElementById('idListaD');
    var idListaDocentes = document.createElement('div');
    idListaDocentes.id = 'idListaDocentes';
    idListaDocentes.className = 'row';
    var idListaDocentes2 = document.getElementById('idListaDocentes');
    idListaD.replaceChild(idListaDocentes, idListaDocentes2);

    var divListaDocentes = document.getElementById('idListaDocentes');
    // Fin de refrescar lista de docentes

    // Array que guarda la lista de docentes, para luego ser utilizada en la paginacion
    docentesCards = [];

    // Se realiza un forEach() para la creacion de los cards de cada docente con sus datos
    lmsDocentes.forEach(docD => {
        var docenteDatos = docD.data();
        
        // Se inicia la creacion de los elementos para los cards de los docentes, utilizando las clases de acuerdo al framework de css Materialize
        var divCol = document.createElement('div');
        divCol.className = 'col s12 m6 l4';
        var dicCard = document.createElement('div');
        dicCard.className = 'card';
        var divCardImage = document.createElement('div');
        divCardImage.className = 'card-image';
        divCardImage.id = 'divCardImageId_'+c1;
        var cardImage = document.createElement('img');
        cardImage.id = 'cardImageId_'+c1;
        // Seleccion de la imagen por defecto si el docente no tiene ninguan imagen guardada
        db.collection("lms-archivos").where("refid", "==", docD.id).where("type", "==", "imagen")
        .get()
        .then(async function(querySnapshot) {
            // console.log(querySnapshot.docs.length);
            // Se comprueba si el docente tiene como minimo una imagen registrada en su portafolio
            if (querySnapshot.docs.length > 0) {
                querySnapshot.forEach(function(doc1) {
                    urlImage = doc1.data().url;
                });
            } else {
                // En caso de que no tenga una imagen registrada, se muestra la imagen por defecto guardada en la coleccion 'lms-opciones'
                var defImg = await getOptions();
                urlImage = defImg.docs[0].data().defaultImageUrl;
            }
            // Se asigna la imagen del portafolio o la imagen por defecto al elemento <img> del card
            cardImage.src = urlImage;
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        // fin de seleccion de imagen por defecto

        // Creacion del boton que habilita la edicion de los datos del docente, mediante un formulario en el mismo card
        var aBtnFloating = document.createElement('a');
        aBtnFloating.className = 'btn-floating activator halfway-fab waves-effect waves-light red';
        
        var optionsIcon = document.createElement('i');
        optionsIcon.className = 'material-icons right';
        var textOptionsIcon = document.createTextNode('more_vert');
        aBtnFloating.appendChild(optionsIcon);
        optionsIcon.appendChild(textOptionsIcon);
        divCardImage.appendChild(cardImage);
        // Se comprueba que el usuario sea Adminstrador o Editor para que se muestre el boton de edicion de datos del docente
        switch (userRol) {
            case 'Administrador':
                divCardImage.appendChild(aBtnFloating);
            
                break;

            case 'Editor':
                divCardImage.appendChild(aBtnFloating);

                break;
        
            default:
                break;
        }
        // Fin de comprobacion y de la creacion del boton de edicion

        // Creacion del contenido del card, que muestra los datos de cada docentes
        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardContent.id = 'idCardContent_'+c1;//

        // Creacion de los elementos para el contenido del card que muestra el nombre del docente
        var spanCardTitle = document.createElement('span');
        spanCardTitle.className = 'card-title grey-text text-darken-4';
        var cardTitle = document.createTextNode(docenteDatos.name);
        spanCardTitle.appendChild(cardTitle);
        // Fin de creacion de elementos para el nombre de docente

        // Creacion de los elementos que muestra el email del docente
        var divCardEmail = document.createElement('div');
        divCardEmail.className = 'cardInfo';
        var divCardEmailText = document.createElement('p');
        var cardEmailIcon = document.createElement('i');
        cardEmailIcon.className = 'tiny material-icons';
        cardEmailIcon.textContent = 'email';
        var cardEmailText = document.createTextNode(' '+docenteDatos.email);
        divCardEmailText.appendChild(cardEmailIcon);
        divCardEmailText.appendChild(cardEmailText);
        divCardEmail.appendChild(divCardEmailText);
        // Fin de creacion de elementos para el email del docente
        
        // Creacion de los elementos que muestra el ultimo trabajo del docente
        var divCardLastWork = document.createElement('div');
        divCardLastWork.className = 'cardLastWork';
        var divCardLastWorkText = document.createElement('p');
        var cardLastWorkIcon = document.createElement('i');
        cardLastWorkIcon.className = 'tiny material-icons';
        cardLastWorkIcon.textContent = 'business_center';
        if (docenteDatos.lastWork && docenteDatos.lastWork != '') {
            var cardLastWorkText = document.createTextNode(' '+docenteDatos.lastWork);
            
        } else {
            var cardLastWorkText = document.createTextNode(' No registrado');
            
        }
        divCardLastWorkText.appendChild(cardLastWorkIcon);
        divCardLastWorkText.appendChild(cardLastWorkText);
        divCardLastWork.appendChild(divCardLastWorkText);
        // Fin de creacion de los elementos que muestra el ultimo trabajo del docente

        // Creacion de los elementos que muestra el telefono del docente
        var divCardPhone = document.createElement('div');
        divCardPhone.className = 'cardInfo';
        var divCardPhoneText = document.createElement('p');
        var cardPhoneIcon = document.createElement('i');
        cardPhoneIcon.className = 'tiny material-icons';
        cardPhoneIcon.textContent = 'phone';
        if (docenteDatos.phone && docenteDatos.phone != '') {
            var cardPhoneText = document.createTextNode(' '+docenteDatos.phone);
            
        } else {
            var cardPhoneText = document.createTextNode(' No registrado');
            
        }
        divCardPhoneText.appendChild(cardPhoneIcon);
        divCardPhoneText.appendChild(cardPhoneText);
        divCardPhone.appendChild(divCardPhoneText);
        // Fin de creacion de los elementos que muestra el telefono del docente

        // Creacion de los elementos que muestra la experiencia laboral del docente
        var divCardExperience = document.createElement('div');
        divCardExperience.className = 'cardSummary';
        var divCardExperienceText = document.createElement('p');
        var cardExperienceIcon = document.createElement('i');
        cardExperienceIcon.className = 'tiny material-icons';
        cardExperienceIcon.textContent = 'assignment';
        var cardExperienceTitle = document.createTextNode('Experiencia laboral:');
        var pCardExperienceText = document.createElement('p');
        pCardExperienceText.className = 'pTextContent';
        if (docenteDatos.experience && docenteDatos.experience != '') {
            var cardExperienceText = document.createTextNode(' '+docenteDatos.experience);
        } else {
            var cardExperienceText = document.createTextNode(' No registrado');
        }
        pCardExperienceText.appendChild(cardExperienceText);
        divCardExperienceText.appendChild(cardExperienceIcon);
        divCardExperienceText.appendChild(cardExperienceTitle);
        divCardExperience.appendChild(divCardExperienceText);
        divCardExperience.appendChild(pCardExperienceText);
        // Fin de creacion de los elementos que muestra la experiencia laboral del docente

        // Creacion de los elementos que muestra el resumen del docente
        var divCardSummary = document.createElement('div');
        divCardSummary.className = 'cardSummary';
        var divCardContentText = document.createElement('p');
        var cardSummaryIcon = document.createElement('i');
        cardSummaryIcon.className = 'tiny material-icons';
        cardSummaryIcon.textContent = 'assignment';
        var cardSummaryTitle = document.createTextNode('Resumen:');
        var pCardSummaryText = document.createElement('p');
        pCardSummaryText.className = 'pTextContent';
        var cardContentText = document.createTextNode(docenteDatos.summary);
        pCardSummaryText.appendChild(cardContentText);
        divCardContentText.appendChild(cardSummaryIcon);
        divCardContentText.appendChild(cardSummaryTitle);
        divCardSummary.appendChild(divCardContentText);
        divCardSummary.appendChild(pCardSummaryText);
        // Fin de creacion de los elementos que muestra el resumen del docente

        // Creacion de los elementos que muestran la categoria y el tipo del docente
        var h6CategoryText = document.createElement('div');
        h6CategoryText.className = 'chip';
        h6CategoryText.id = 'h6Id_'+c1;//
        if (docenteDatos.category) {
            // Se crea una funcion asincrona que realiza una consulta a la coleccion 'lms-categorias' para luego mostrarlo
            async function loadCategory() {
                var getCategory = await docGetCategory(docenteDatos.category);
                if (getCategory.data()) {
                    console.log(getCategory.data().nombreCat);
                    var categoryText = document.createTextNode(getCategory.data().nombreCat);
                    h6CategoryText.appendChild(categoryText);
                } else {
                    var categoryText = document.createTextNode(docenteDatos.category);
                    h6CategoryText.appendChild(categoryText);
                }
            }
            loadCategory();
            // Fin de la funcion de mostrar la categoria del docente 
        } else {
            var categoryText = document.createTextNode('Sin categoria');
            h6CategoryText.appendChild(categoryText);
        }
        
        var typeTag = document.createElement('div');
        typeTag.className = 'chip';
        if (docenteDatos.type) {
            // Se crea una funcion asincrona que realiza una consulta a la coleccion 'lms-tipos' para luego mostrarlo
            async function loadType() {
                var getType = await docGetType(docenteDatos.type);
                if (getType.data()) {
                    console.log(getType.data().nombreTipo);
                    typeTag.textContent = getType.data().nombreTipo;
                    
                } else {
                    typeTag.textContent = docenteDatos.type;
                }
            }
            loadType();
            // Fin de la funcion de mostrar el tipo del docente 
        } else {
            typeTag.textContent = 'Sin tipo';
        }
        // Fin de creacion de los elementos que muestran la categoria y el tipo del docente

        var cardDivider = document.createElement('div');
        cardDivider.className = 'divider dividerClass';

        // Creacion de los elementos para los botones de ver CV y Portafolio del docente
        var divRowCA = document.createElement('div');
        divRowCA.className = 'row divCAButtons';

        // Creacion de los elementos para el boton CV
        var divColCA1 = document.createElement('div');
        divColCA1.className = 'col s5';
        var btnCV = document.createElement('a');
        btnCV.className = 'btn green';
        btnCV.style = 'width: 100%;';

        db.collection("lms-archivos").where("refid", "==", docD.id).where("type", "==", "pdf")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc1) {
                urlCV = doc1.data().url;
                btnCV.setAttribute("href", urlCV);
                btnCV.setAttribute("target", "_blank");
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        var btnCVText = document.createTextNode('CV');
        btnCV.appendChild(btnCVText);
        divColCA1.appendChild(btnCV);
        // Fin de creacion de los elementos para el boton CV

        // Creacion de los elementos para el boton Portafolio
        var divColCA2 = document.createElement('div');
        divColCA2.className = 'col s7';
        var btnPortafolio = document.createElement('a');
        btnPortafolio.className = 'btn red modal-trigger';
        btnPortafolio.href = '#modal1';
        btnPortafolio.style = 'width: 100%;';
        btnPortafolio.onclick = function () {
            console.log('imagenes');
            portafolio(docenteDatos.name, docD.id, false);
        }
        var btnPortafolioText = document.createTextNode('Portafolio');
        // btnPortafolioText.appendChild(btnPortafolioText);
        btnPortafolio.appendChild(btnPortafolioText);
        divColCA2.appendChild(btnPortafolio)
        // Creacion de los elementos para el boton Portafolio

        // Se agregan los elementos creados anteriormente al card mediante la funcion appendChild()
        divRowCA.appendChild(divColCA1);
        divRowCA.appendChild(divColCA2);

        divCardContent.appendChild(spanCardTitle);
        divCardContent.appendChild(divCardEmail);
        divCardContent.appendChild(divCardPhone);
        divCardContent.appendChild(divCardLastWork);
        divCardContent.appendChild(divCardExperience);
        divCardContent.appendChild(divCardSummary);
        divCardContent.appendChild(h6CategoryText);
        divCardContent.appendChild(typeTag);
        divCardContent.appendChild(cardDivider);
        divCardContent.appendChild(divRowCA);
        // Fin de agregar elementos al card

        // Creacion de los elementos para el card-reveal, que es la seccion de edidion de datos de docente
        var divCardReveal = document.createElement('div');
        divCardReveal.className = 'card-reveal';
        var spanTitleCR = document.createElement('span');
        spanTitleCR.className = 'card-title activator grey-text text-darken-4';
        var spanTitleCRText = document.createTextNode('Opciones');
        var closeIconCR = document.createElement('i');
        closeIconCR.className = 'material-icons right';
        var closeIconCRText = document.createTextNode('close');
        closeIconCR.appendChild(closeIconCRText);
        spanTitleCR.appendChild(spanTitleCRText);
        spanTitleCR.appendChild(closeIconCR);
        divCardReveal.appendChild(spanTitleCR);

        var divRowOptionContent = document.createElement('div');
        divRowOptionContent.className = 'row';
        var divColOC1 = document.createElement('div');
        divColOC1.className = 'col s12';
        var divColOC2 = document.createElement('div');
        divColOC2.className = 'col s12';
        // Se crea el formulario de edicion de datos
        var editForm = document.createElement('form');
        editForm.id = 'editFormId_'+c1;
        // Se asigna el evento 'onsubmit' al formulario de edicion de datos, que ejecuta la funcion updateDoc() para que guarde los cambios en la coleccion 'lms-docetes'
        editForm.onsubmit = async function (e) {
            e.preventDefault();
            
            await updateDoc(docD.id, {
                // ref: e.target[0].value,
                name: e.target[0].value,
                email: e.target[1].value,
                summary: e.target[2].value,
                experience: e.target[3].value,
                lastWork: e.target[4].value,
                phone: e.target[5].value,
                category: e.target[6].value,
                type: e.target[7].value,
                // refCatDoc: e.target[0].value,
            },{
                name: docenteDatos.name,
                email: docenteDatos.email,
                summary: docenteDatos.summary,
                experience: docenteDatos.experience,
                lastWork: docenteDatos.lastWork,
                phone: docenteDatos.phone,
                category: docenteDatos.category,
                type: docenteDatos.type,
            });

        }

        var divRowEditForm = document.createElement('div');
        divRowEditForm.className = 'row';

        // Se crean los elementos <input> y <select> para el formulario de edicion
        // Creacion del elemento <input> para el nombre del docente
        var divColInputName = document.createElement('div');
        divColInputName.className = 'input-field divInputField col s12';
        var labelInputName = document.createElement('label');
        labelInputName.className = 'active';
        labelInputName.setAttribute('for', 'inputNameId_'+c1);
        var labelInputNameText = document.createTextNode('Nombre');
        labelInputName.appendChild(labelInputNameText);
        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputNameId_'+c1;
        inputName.value = docenteDatos.name;
        divColInputName.appendChild(inputName);
        divColInputName.appendChild(labelInputName);
        // Fin de creacion del elemento <input> para el nombre del docente

        // Creacion del elemento <input> para el email del docente
        var divColInputEmail = document.createElement('div');
        divColInputEmail.className = 'input-field divInputField col s12';
        var labelInputEmail = document.createElement('label');
        labelInputEmail.className = 'active';
        labelInputEmail.setAttribute('for', 'inputEmailId_'+c1);
        var labelInputEmailText = document.createTextNode('Email');
        labelInputEmail.appendChild(labelInputEmailText);
        var inputEmail = document.createElement('input');
        inputEmail.type = 'text';
        inputEmail.id = 'inputEmailId_'+c1;
        inputEmail.value = docenteDatos.email;
        divColInputEmail.appendChild(inputEmail);
        divColInputEmail.appendChild(labelInputEmail);
        // Fin de creacion del elemento <input> para el email del docente

        // Creacion del elemento <textarea> para el resumen del docente
        var divColInputSummary = document.createElement('div');
        divColInputSummary.className = 'input-field divInputField col s12';
        var labelInputSummary = document.createElement('label');
        labelInputSummary.className = 'active';
        labelInputSummary.setAttribute('for', 'inputSumaryId_'+c1);
        var labelInputSummaryText = document.createTextNode('Resumen');
        labelInputSummary.appendChild(labelInputSummaryText);
        var inputSummary = document.createElement('textarea');
        inputSummary.className = 'materialize-textarea';
        inputSummary.id = 'inputSumaryId_'+c1;
        inputSummary.value = docenteDatos.summary;
        divColInputSummary.appendChild(inputSummary);
        divColInputSummary.appendChild(labelInputSummary);
        // Fin de creacion del elemento <textarea> para el resumen del docente

        // Creacion de elemento <input> para la ecperiencia laboral del docente
        var divColInputExperience = document.createElement('div');
        divColInputExperience.className = 'input-field divInputField col s12';
        var labelInputExperience = document.createElement('label');
        labelInputExperience.className = 'active';
        labelInputExperience.setAttribute('for', 'inputExperienceId_'+c1);
        labelInputExperience.textContent = 'Experiencia laboral';
        var inputExperience = document.createElement('input');
        inputExperience.type = 'text';
        inputExperience.id = 'inputExperienceId_'+c1;
        inputExperience.value = docenteDatos.experience;
        divColInputExperience.appendChild(inputExperience);
        divColInputExperience.appendChild(labelInputExperience);

        // Creacion de elemento <input> para ultimo trabajo de docente
        var divColInputLastWork = document.createElement('div');
        divColInputLastWork.className = 'input-field divInputField col s12';
        var labelInputLastWork = document.createElement('label');
        labelInputLastWork.className = 'active';
        labelInputLastWork.setAttribute('for', 'inputLastWorkId_'+c1);
        labelInputLastWork.textContent = 'Ultimo trabajo';
        var inputLastWork = document.createElement('input');
        inputLastWork.type = 'text';
        inputLastWork.id = 'inputLastWorkId_'+c1;
        inputLastWork.value = docenteDatos.lastWork;
        divColInputLastWork.appendChild(inputLastWork);
        divColInputLastWork.appendChild(labelInputLastWork);

        // Creacion de elemento <input> para el telefono del docente
        var divColInputPhone = document.createElement('div');
        divColInputPhone.className = 'input-field divInputField col s12';
        var labelInputPhone = document.createElement('label');
        labelInputPhone.className = 'active';
        labelInputPhone.setAttribute('for', 'inputPhoneId_'+c1);
        labelInputPhone.textContent = 'Telefono / Celular';
        var inputPhone = document.createElement('input');
        inputPhone.type = 'number';
        inputPhone.id = 'inputPhoneId_'+c1;
        inputPhone.value = docenteDatos.phone;
        divColInputPhone.appendChild(inputPhone);
        divColInputPhone.appendChild(labelInputPhone);

        // Elemento <select> de categoria
        var divColSelectCategory = document.createElement('div');
        divColSelectCategory.className = 'divInputField col s12';
        var selectCategory = document.createElement('select');
        selectCategory.className = 'browser-default';
        selectCategory.id = 'selectCategoryId_'+c1;
        // Se crean las opciones del select de categoria
        lmsCategorias.forEach(docC => {
            var optionSelectCat = document.createElement('option');
            optionSelectCat.value = docC.id;
            optionSelectCat.textContent = docC.data().nombreCat;
            selectCategory.appendChild(optionSelectCat);
        })
        selectCategory.value = docenteDatos.category;
        var labelSelectCategory = document.createElement('label');
        labelSelectCategory.textContent = 'Categoria';
        
        divColSelectCategory.appendChild(labelSelectCategory);
        divColSelectCategory.appendChild(selectCategory);
        // Final de elemento select de categoria

        

        // Elemento <select> de tipo
        var divColSelectType = document.createElement('div');
        divColSelectType.className = 'divInputField col s12';
        var selectType = document.createElement('select');
        selectType.className = 'browser-default';
        selectType.id = 'selectTypeId_'+c1;
        // Se crean las opciones del select de tipo
        lmsTipos.forEach(docC => {
            var optionSelectType = document.createElement('option');
            optionSelectType.value = docC.id;
            optionSelectType.textContent = docC.data().nombreTipo;
            selectType.appendChild(optionSelectType);
        })
        selectType.value = docenteDatos.type;
        var labelSelectType = document.createElement('label');
        labelSelectType.textContent = 'Tipo';

        divColSelectType.appendChild(labelSelectType);
        divColSelectType.appendChild(selectType);
        //Final de elemento <select> de tipo

        // Se crean los botones de Editar CV y Editar Portafolio
        var divColEditDocument = document.createElement('div');
        divColEditDocument.className = 'col s12';
        var divRowEditDocuments = document.createElement('div');
        divRowEditDocuments.className = 'row';
        divColEditDocument.appendChild(divRowEditDocuments);
        var divColEditCV = document.createElement('div');
        divColEditCV.className = 'col s6';
        // Creacion de los elementos para el boton Cambiar CV
        var editCVButton = document.createElement('a');
        editCVButton.href = '#modal2';
        editCVButton.className = 'btn green editButton modal-trigger';
        editCVButton.textContent = 'Cambiar CV';
        // Se asigna el evento onclick al boton Cmabiar CV
        editCVButton.onclick = function () {
            document.getElementById('modal2Title').textContent = 'Documento CV de '+docenteDatos.name;

            // Se refresca el contenido del modal que muestra el nombre del CV actual del docente, utilizando la funcion replaceChild()
            var idModalBody2 = document.getElementById('idModalBody2');
            var oldModalbody2 = document.getElementById('editModal');
            var modalbody2 = document.createElement('div');
            modalbody2.id = 'editModal';
            idModalBody2.replaceChild(modalbody2, oldModalbody2);
            // Fin de refrescar contenido

            // Se realiza una consulta a la coleccion 'lms-archivos' para obtener el nombre del CV actual del docente y su referencia
            db.collection("lms-archivos").where("refid", "==", docD.id).where("type", "==", "pdf")
            .get()
            .then(function(querySnapshot) {
                // Se verifica que el docente tenga el documento CV guardado
                if (querySnapshot.docs.length) {
                    querySnapshot.forEach(function(doc1) {
                        // Se crean los elementos necesarios para el mostrar el nombre del CV actual del docente
                        var divRowModalBody2 = document.createElement('div');
                        divRowModalBody2.className = 'row';
                        var divCol1ModalBody2 = document.createElement('div');
                        divCol1ModalBody2.className = 'col s12';
                        var newH51Modal2 = document.createElement('h5');
                        newH51Modal2.textContent = 'Documento actual';
                        divCol1ModalBody2.appendChild(newH51Modal2);
                        var divRowActualCV = document.createElement('div');
                        divRowActualCV.className = 'row';
                        var divColCVName = document.createElement('div');
                        divColCVName.className = 'col s8';
                        var h6ActualDocumentName = document.createElement('h6');
                        h6ActualDocumentName.textContent = doc1.data().fileName;
                        divColCVName.appendChild(h6ActualDocumentName);
                        // Se crean los elementos necesarios para el boton de ver el CV actual
                        var divColCVBtn = document.createElement('div');
                        divColCVBtn.className = 'col s4';
                        var btnActualCV = document.createElement('a');
                        btnActualCV.className = 'btn green';
                        btnActualCV.textContent = 'Ver';
                        btnActualCV.setAttribute("href", doc1.data().url);
                        btnActualCV.setAttribute("target", "_blank");
                        divColCVBtn.appendChild(btnActualCV);
                        divRowActualCV.appendChild(divColCVName);
                        divRowActualCV.appendChild(divColCVBtn);
                        divCol1ModalBody2.appendChild(divRowActualCV);
                        // Se crean los elementos necesarios para el boton de Documento nuevo, que reemplaza el CV del docente por uno nuevo
                        var divCol2ModalBody2 = document.createElement('div');
                        divCol2ModalBody2.className = 'col s12';
                        var newH52Modal2 = document.createElement('h5');
                        newH52Modal2.textContent = 'Documento nuevo';
                        divCol2ModalBody2.appendChild(newH52Modal2);
                        var divRowNewCV = document.createElement('div');
                        divRowNewCV.className = 'row';
                        var divColNewCVBtn = document.createElement('div');
                        divColNewCVBtn.className = 'col s12';
                        // Se crean los elementos necesarios para el elemento <input> de tipo file que guarda el archivos, en este caso el PDF, para luego subirlo al storage de Firebase
                        var newCVInputFile = document.createElement('input');
                        newCVInputFile.type = 'file';
                        newCVInputFile.id = 'docenteNewCV_';
                        newCVInputFile.accept = "application/pdf";
                        newCVInputFile.onchange = function () { console.log(this.files[0]); };
                        var newCVSpan = document.createElement('span');
                        var spanCVText = document.createTextNode('Portafolio');
                        newCVSpan.appendChild(spanCVText);
                        var divBtnNewCV = document.createElement('div');
                        divBtnNewCV.className = 'btn green';
                        divBtnNewCV.appendChild(newCVSpan);
                        divBtnNewCV.appendChild(newCVInputFile);
                        var newInputCVText = document.createElement('input');
                        newInputCVText.type = 'text';
                        newInputCVText.className = 'file-path validate';
                        newInputCVText.placeholder = 'Selecciona una imagen';
                        var divInputCVText = document.createElement('div');
                        divInputCVText.className = 'file-path-wrapper';
                        divInputCVText.appendChild(newInputCVText);
                        var divInputCVFile = document.createElement('div');
                        divInputCVFile.className = 'file-field input-field';
                        divInputCVFile.appendChild(divBtnNewCV);
                        divInputCVFile.appendChild(divInputCVText);
                        // Se crean los elementos necesarios para el boton Guardar, que guarda el nuevo CV del docente
                        var saveCVBtn = document.createElement('button');
                        saveCVBtn.className = 'btn blue';
                        saveCVBtn.type = 'button';
                        saveCVBtn.textContent = 'Guardar';
                        // Se asigna el evento onclick al boton Guardar que realiza el proceso de subir el PDF al storage
                        saveCVBtn.onclick = function () {
                            var docFileCV = newCVInputFile.files[0];
                            // Conprueba que la imagen exista
                            if (!docFileCV) {
            
                            }else{
                                // Sube el PDF al storage
                                var storageDocRef = storage.ref('/cvDocente/'+docFileCV.name);
                                var uploadDoc = storageDocRef.put(docFileCV);
                                uploadDoc.on('state_changed', function (snapshot) {
                                    
                                }, function (error) {
                                    console.log(error);
                        
                                }, function () {
                                    console.log('Documento subido');
                                    // Se obtiene la url de la ubicacion del PDF subido al storage
                                    uploadDoc.snapshot.ref.getDownloadURL().then(async function (url1) {
                                        // Se guarda la url y el nombre del PDF en la coleccion 'lms-archivos' mediante la funcion updateFile()
                                        await updateFile(doc1.id, docD.id, 'pdf', {
                                            fileName: docFileCV.name,
                                            url: url1,
                                        }, doc1.data().fileName);
                                    })
                                });
                            }
                        }
                        // Fin de asignar el evento onclick en el boton Guardar
                        divColNewCVBtn.appendChild(divInputCVFile);
                        divColNewCVBtn.appendChild(saveCVBtn);
                        // Fin de creacion de los elementos para el boton Guardar

                        // Se agrega el boton para eliminar el CV del docente en el modal de cambiar CV
                        var divDeleteCVBtn = document.createElement('div');
                        divDeleteCVBtn.className = 'col s12';
                        divDeleteCVBtn.style = 'padding-top: 5px; padding-left: 0px;';

                        var deleteCVBtn = document.createElement('button');
                        deleteCVBtn.className = 'btn red';
                        deleteCVBtn.type = 'button';
                        deleteCVBtn.textContent = 'Eliminar';
                        // Se asigna el evento onclick al boton Eliminar, que realiza el proceso de eliminar la referencia al PDF en la coleccion 'lms-archivos' 
                        deleteCVBtn.onclick = async function () {
                            // Se elimina los datos de la referencia al PDF del CV del docente mediante la funcion deleteCV()
                            await deleteCV(doc1.id, docD.id, doc1.data().fileName);
                        }

                        divDeleteCVBtn.appendChild(deleteCVBtn);
                        divColNewCVBtn.appendChild(divDeleteCVBtn);
                        // Fin de agregar boton para eliminar CV del docente
    
                        divRowNewCV.appendChild(divColNewCVBtn);
                        divCol2ModalBody2.appendChild(divRowNewCV);
    
                        divRowModalBody2.appendChild(divCol1ModalBody2);
                        divRowModalBody2.appendChild(divCol2ModalBody2);
                        modalbody2.appendChild(divRowModalBody2);
                        urlCV = doc1.data().url;
                        
                    });                    
                } 
                // Si no tiene CV se genera los elementos en el modal 
                else {
                    // Se crean los elementos necesarios para el titulo del contenido del modal de CV de docente
                    var divRowModalBody2 = document.createElement('div');
                    divRowModalBody2.className = 'row';
                    var divCol2ModalBody2 = document.createElement('div');
                    divCol2ModalBody2.className = 'col s12';
                    var newH52Modal2 = document.createElement('h5');
                    newH52Modal2.textContent = 'Documento nuevo';
                    divCol2ModalBody2.appendChild(newH52Modal2);
                    var divRowNewCV = document.createElement('div');
                    divRowNewCV.className = 'row';
                    var divColNewCVBtn = document.createElement('div');
                    divColNewCVBtn.className = 'col s12';
                    // Creacion de los elementos para el elemento <input> que guarda el archivo PDF que se quiere agregar
                    var newCVInputFile = document.createElement('input');
                    newCVInputFile.type = 'file';
                    newCVInputFile.id = 'docenteNewCV_';
                    newCVInputFile.accept = "application/pdf";
                    newCVInputFile.onchange = function () { console.log(this.files[0]); };
                    var newCVSpan = document.createElement('span');
                    var spanCVText = document.createTextNode('Portafolio');
                    newCVSpan.appendChild(spanCVText);
                    var divBtnNewCV = document.createElement('div');
                    divBtnNewCV.className = 'btn green';
                    divBtnNewCV.appendChild(newCVSpan);
                    divBtnNewCV.appendChild(newCVInputFile);
                    var newInputCVText = document.createElement('input');
                    newInputCVText.type = 'text';
                    newInputCVText.className = 'file-path validate';
                    newInputCVText.placeholder = 'Selecciona una imagen';
                    var divInputCVText = document.createElement('div');
                    divInputCVText.className = 'file-path-wrapper';
                    divInputCVText.appendChild(newInputCVText);
                    var divInputCVFile = document.createElement('div');
                    divInputCVFile.className = 'file-field input-field';
                    divInputCVFile.appendChild(divBtnNewCV);
                    divInputCVFile.appendChild(divInputCVText);
                    // Creacion de los elementos necesarios para el boton Guardar
                    var saveCVBtn = document.createElement('button');
                    saveCVBtn.className = 'btn blue';
                    saveCVBtn.type = 'button';
                    saveCVBtn.textContent = 'Guardar';
                    // Se asigna el evento onclick al boton guardar
                    saveCVBtn.onclick = function () {
                        var docFileCV = newCVInputFile.files[0];
                        // Se comprueba que el archivo exista
                        if (!docFileCV) {
        
                        }else{
                            // Se sube el PDF al storage
                            var storageDocRef = storage.ref('/cvDocente/'+docFileCV.name);
                            var uploadDoc = storageDocRef.put(docFileCV);
                            uploadDoc.on('state_changed', function (snapshot) {
                                
                            }, function (error) {
                                console.log(error);
                    
                            }, function () {
                                console.log('Documento subido');
                                // Se obtiene la url de PDF nuevo
                                uploadDoc.snapshot.ref.getDownloadURL().then(async function (url1) {
                                    // Funcion que guarda la referencia al nuevo CV en la coleccion 'lms-archivos' 
                                    await saveFile(docFileCV.name, docD.id, url1, 'pdf');
                                })
                            });
                        }
                    }

                    divColNewCVBtn.appendChild(divInputCVFile);
                    divColNewCVBtn.appendChild(saveCVBtn);
                    // Fin de creacion de los elementos necesarios para el boton Guardar
                    divRowNewCV.appendChild(divColNewCVBtn);
                    divCol2ModalBody2.appendChild(divRowNewCV);

                    divRowModalBody2.appendChild(divCol2ModalBody2);
                    modalbody2.appendChild(divRowModalBody2);
                }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }
        // Creacion del boton Editar portafolio que muestra un modal para agregar, cambiar o eliminar una imagen del portafolio de docente
        divColEditCV.appendChild(editCVButton);
        var divColEditPortafolio = document.createElement('div');
        divColEditPortafolio.className = 'col s6';
        var editPortafolioButton = document.createElement('a');
        editPortafolioButton.href = '#modal1';
        editPortafolioButton.className = 'btn red editButton modal-trigger';
        editPortafolioButton.textContent = 'Editar Portafolio';
        // Se asigna el evento onclick que muestra el modal con las imagenes del portafolio, y sus opciones de agregar, cmabiar o eliminar imagenes
        editPortafolioButton.onclick = function () {
            portafolio(docenteDatos.name, docD.id, true);
        }
        divColEditPortafolio.appendChild(editPortafolioButton);
        divRowEditDocuments.appendChild(divColEditCV);
        divRowEditDocuments.appendChild(divColEditPortafolio);
        // Fin de creacion del boton Editar Portafolio

        // Se agregan los elementos <input> creados anteriormente para el formulario de edicion de docente
        divRowEditForm.appendChild(divColInputName);
        divRowEditForm.appendChild(divColInputEmail);
        divRowEditForm.appendChild(divColInputSummary);
        divRowEditForm.appendChild(divColInputExperience);
        divRowEditForm.appendChild(divColInputLastWork);
        divRowEditForm.appendChild(divColInputPhone);
        divRowEditForm.appendChild(divColSelectCategory);
        divRowEditForm.appendChild(divColSelectType);
        divRowEditForm.appendChild(divColEditDocument);

        // Creacion del boton Guardar, que guarda los datos que se quiere modificar del docente
        var editButton = document.createElement('button');
        editButton.className = 'btn blue changeStateBtn';
        editButton.type = 'submit';
        var editButtonText = document.createTextNode('Guardar');
        editButton.appendChild(editButtonText);
        // Creacion del boton Eliminar docente, que elimina al docente
        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn red changeStateBtn';
        // Se asigna el evento onclick al boton Eliminar docente
        deleteButton.onclick = async function () {
            // Confirmar la eliminacion del docente
            var oldConfirmDelete = document.getElementById('confirmDelete');
            var colConfirmDelete = document.getElementById('colConfirmDelete');
            var confirmDelete = document.createElement('a');
            confirmDelete.className = 'btn green modal-close';
            confirmDelete.style = 'width: 50%';
            confirmDelete.textContent = 'Si';
            confirmDelete.id = 'confirmDelete';
            confirmDelete.onclick = function () {
                // Elimina al docente seleccionado mediante la funcion deleteDoc() que requiere la id del docente y su nombre
                deleteDoc(docD.id, docenteDatos.name);
            }
            colConfirmDelete.replaceChild(confirmDelete, oldConfirmDelete);
            colConfirmDelete.appendChild(confirmDelete);

            $('#modalAlert').modal('open');
            // Fin confirmar eliminacion de docente
        }
        var deleteButtonText = document.createTextNode('Eliminar Docente');
        deleteButton.appendChild(deleteButtonText);
        // Fin de creacion del boton Eliminar docente

        editForm.appendChild(divRowEditForm);
        editForm.appendChild(editButton);
        divColOC1.appendChild(editForm);
        divColOC2.appendChild(deleteButton);
        divCardReveal.appendChild(divColOC1);
        divCardReveal.appendChild(divColOC2);

        dicCard.appendChild(divCardImage);
        dicCard.appendChild(divCardContent);
        dicCard.appendChild(divCardReveal);
        divCol.appendChild(dicCard);
        docentesCards[c1] = divCol;
        c1=c1+1;

    })
    // Se realiza el calculo de los cards a mostrar en cada pagina y las paginas totales, utilizado para la paginacion
    currentPage = 1;
    lastItem = pageItems * currentPage;

    firstItem = lastItem - pageItems;
    // Se ejecuta la funcion pagination() que realiza la paginacion de los cards en la lista de docentes
    pagination(docentesCards, divListaDocentes);

    countPages = Math.ceil(docentesCards.length / pageItems);

    // Se ejecuta la funcion paginationNumbers() que agrega los numeros en el pie de la pagina para la paginacion
    paginationNumbers(countPages, divListaDocentes);
}

// Funcion pagination() que realiza la paginacion de los cards en la lista de docentes, requiere el parametro: docCards(los cards generados para luego repartirlos en paginas)
pagination = function (docCards, divListaDoc) {
    // Obtiene el elemento <div> donde se muestran los cards de los docentes para luego refrescarlos y mostrar los nuevos cards de los docentes
    var idList = document.getElementById('idListaD');
    var idListaDoc = document.getElementById('idListaDocentes');
    var divpageItem = document.createElement('div');
    divpageItem.className = 'row';
    divpageItem.id = 'idListaDocentes';
    // Se agregan los cards de los docentes en el elemento <div> de la lista de docentes, de 6 elementos por pagina
    for (let index = firstItem; index < lastItem; index++) {
        if (docCards[index]) {
            divpageItem.appendChild(docCards[index]);
        }
    }
    idList.replaceChild(divpageItem, idListaDoc);
    $(document).ready(function(){
        $('select').formSelect();
    });
}

// Funcion paginationNumbers() que realiza la creacion de los numeros de la paginacion, los botones siguiente y anterior
paginationNumbers = function (countPages, divListaDocentes) {
    // Se capturan los elementos que contienen la paginacion
    var paginationContainer = document.getElementById('paginationContainer');
    var leftArrow = document.getElementById('leftArrow');
    var rightArrow = document.getElementById('rightArrow');
    var paginationItem = document.getElementById('pagination');
    var newPaginationItem = document.createElement('div');
    newPaginationItem.className = 'pagination';
    newPaginationItem.id = 'pagination';
    paginationContainer.replaceChild(newPaginationItem, paginationItem);
    // Se asigna el evento onclick al boton Anterior, que realiza el proceso de ir a una pagina anterior
    leftArrow.children[0].onclick = function (){
        // Comprueba que la pagina actual sea mayor a 1 para retroceder la pagina, caso contrario no pasara nada
        if (currentPage > 1) {
            // Cada vez que se cambia de pagina, la pantalla se ubica al principio
            window.scrollTo(0,0);
            // Se resta en 1 el contador de la pagina actual y se realizan calculos para cambiar el primer elemento de la pagina y el ultimo
            currentPage = currentPage - 1;
            lastItem = pageItems * currentPage;
            firstItem = lastItem - pageItems;
            // Se ejecuta la funcion pagination() que muestra los cards de los docentes, correspondientes a la pagina
            pagination(docentesCards, divListaDocentes);
            // Se capturan todos los numeros de la paginacion
            var btnPaginationNumbers = document.getElementsByClassName('btnNro');
            // Se realiza el proceso para marcar el numero de la pagina actual en la paginacion
            for (let k = 0; k < btnPaginationNumbers.length; k++) {
                // Cuando el numero de paginacion conicida con la pagina actual se cambia su atributo class para que ese numero sea marcado
                if ((currentPage-1)==k) {
                    btnPaginationNumbers[k].setAttribute('class', 'active btnNro');                
                } else {
                    btnPaginationNumbers[k].setAttribute('class', 'waves-effect btnNro');
                }
            }
        }        
    }

    // Se asigna el evento onclick al boton Siguiente, que realiza el proceso de ir a una pagina siguiente
    rightArrow.children[0].onclick = function () {
        // Comprueba que la pagina actual sea menor al numero de paginas totales para avanzar a la siguiente pagina, caso contrario no pasara nada
        if (currentPage < countPages) {
            // Cada vez que se cambia de pagina, la pantalla se ubica al principio
            window.scrollTo(0,0);
            // Se suma en 1 el contador de la pagina actual y se realizan calculos para cambiar el primer elemento de la pagina y el ultimo
            currentPage = currentPage + 1;
            lastItem = pageItems * currentPage;
            firstItem = lastItem - pageItems;
            // Se ejecuta la funcion pagination() que muestra los cards de los docentes, correspondientes a la pagina
            pagination(docentesCards, divListaDocentes);
            // Se capturan todos los numeros de la paginacion
            var btnPaginationNumbers = document.getElementsByClassName('btnNro');
            // Se realiza el proceso para marcar el numero de la pagina actual en la paginacion
            for (let k = 0; k < btnPaginationNumbers.length; k++) {
                if ((currentPage-1)==k) {
                    btnPaginationNumbers[k].setAttribute('class', 'active btnNro');
                } else{
                    btnPaginationNumbers[k].setAttribute('class', 'waves-effect btnNro');
                }
            }
        }
    }

    // Se realiza el calculo y la creacion de los numeros de la paginacion, se agregan los botones Anterior, Siguiente, y los numeros de la paginacion al DOM
    newPaginationItem.appendChild(leftArrow);
    for (let j = 1; j <= countPages; j++) {
        // const element = countPages;
        // Se crean elementos <li> que contienes los nuemros de la paginacion
        var liPage = document.createElement('li');
        // Se asigna el evento onclick a los elementos <li> que cambia su atributo de clase para que quede marcado al momento de presionarlo, desmarcar los otros numeros
        liPage.onclick = function () {
            var btnPaginationNumbers = document.getElementsByClassName('btnNro');
            for (let k = 0; k < btnPaginationNumbers.length; k++) {
                btnPaginationNumbers[k].setAttribute('class', 'waves-effect btnNro');                
            }
            this.setAttribute('class', 'active btnNro');
        }
        if (j==1) {
            liPage.className = 'active btnNro';        
        } else {
            liPage.className = 'waves-effect btnNro';        
        }
        // Se crean los botones de los numeros de la paginacion
        var aNumberPage = document.createElement('a');
        aNumberPage.href = '#!';
        // Se asigna el evento onclick a los numeros para que salte al numero de pagina que se seleccione
        aNumberPage.onclick = function () {
            // Cada vez que se cambia de pagina, la pantalla se ubica al principio
            window.scrollTo(0,0);
            // Se cambia el valor del contador de la pagina actual al valor de la pagina a la que se quiera ir y se realizan calculos para cambiar el primer elemento de la pagina y el ultimo
            currentPage = j;
            lastItem = pageItems * currentPage;
            firstItem = lastItem - pageItems;
            // Se ejecuta la funcion pagination() que muestra los cards de los docentes, correspondientes a la pagina
            pagination(docentesCards, divListaDocentes);
        }
        // Se agregan los numero de la paginacion al DOM
        aNumberPage.textContent = j;
        liPage.appendChild(aNumberPage);
        newPaginationItem.appendChild(liPage);     
    }
    newPaginationItem.appendChild(rightArrow);
}

// Funcion initApp() utilizada para verificar si un usuario esta autenticado
async function initApp() {
    // Se comprueba que haya un usuario logeado con la funciones de firebase
    firebase.auth().onAuthStateChanged(async function(user) {  
        // Se guarda el valor del usuario actual en la variable currentUser
        currentUser = user;
        if (user) {
        // Si el usuario esta logeado se realizan cambios en la barra de navegacion para que se muestre su nombre, y para que se muestre el boton de logout, ademas de ocultar los botones de Inicar sesion y Registrase
            document.getElementById('dropdown1Text').textContent = user.displayName;
            idDropdown.setAttribute('style', '');
            idLogin.setAttribute('style', 'display:none;');
            idRegistrarseBtn.setAttribute('style', 'display:none;');
            // Variables utilizadas para comprobar la habilitacion del usuario y su rol
            var userEnable = false;
            userRol = '';
            // Se realiza una consulta a la coleccion 'lms-roles' con la uid del usuario, para obtener el rol del usuario logeado y el estado de habilitacion
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                // Se asignan los datos del rol y el estado de habilitacion del usuario en variables
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                    userEnable = doc1.data().userEnable;
                });
                // Si el usuario no esta habilitado se le redirecciona a la pagina 'deshabilitado.html'
                if (userEnable != true) {
                    location.href = 'deshabilitado.html';   
                }
                // Se realiza la comprobacion del rol de usuario para mostrar los botones de la barra de navegacion, de acuerdo a su rol, el boton Lista de docentes es visible para todos
                switch (userRol) {
                    case 'Editor':
                    // Si es Editor solo se mostraran los botones de Registrar docente
                        idRegistrarDocenteBtn.setAttribute('style', '');
                        idRegistrarDocenteBtnMovil.setAttribute('style', '');
                        break;
                    
                    case 'Administrador':
                    // Si es Adiminstrador se le mostraran todos los botones, que son: Panel de control, Lista de usuarios, Registrar docentes
                        idOpcionesBtnMovil.setAttribute('style', '');
                        idOpcionesBtn.setAttribute('style', '');
                        idListaUsuarios.setAttribute('style', '');
                        idListaUsuariosMovil.setAttribute('style', '');
                        idRegistrarDocenteBtn.setAttribute('style', '');
                        idRegistrarDocenteBtnMovil.setAttribute('style', '');
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
            
        } else {
            // Si el usuario no esta logeado se cambian los atributos de los botones Registrase y Login para que sean visibles
            document.getElementById('dropdown1Text').textContent = 'Usuario';
            idDropdown.setAttribute('style', 'display:none;');
            idLogin.setAttribute('style', '');
            idRegistrarseBtn.setAttribute('style', '');
            console.log('User is signed out');
            btnLogOut.setAttribute('style', 'display:none;');
            // Se redirecciona al usuario a la pagina 'index.html'
            location.href = 'index.html';
        }
    });

    // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout
    btnLogOut.addEventListener('click', (e) => {

        // Se ejecuta la funcion signOut() de firebase para el logout del usuario
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
        }).catch(function(error) {
            console.log('Error in log out', error);
        });
    });
    // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout en el modo responsivo
    idLogoutBtnMovil.addEventListener('click', (e) => {
        // Se ejecuta la funcion signOut() de firebase para el logout del usuario
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
        }).catch(function(error) {
            console.log('Error in log out', error);
        });
    });

    // Se realiza una consulta a la coleccion 'lms-opciones' mediante la funcion getOptions(), luego se reemplaza la varialble imgMaxNumber que limita las imagenes del portafolio de docente
    var imgMaxNumber = await getOptions();
    numMaxImg = imgMaxNumber.docs[0].data().imagesNumber;
}

window.addEventListener('DOMContentLoaded', async (e) => {
    initApp();

    // Se realiza la consulta a la coleccion 'lms-categorias' para luego llenar el elemento <select> con las categorias existentes en la coleccion 'lms-categorias', en el formulario de registro 
    var selectCategoryId = document.getElementById("docenteCategoria");
    const lmsCategorias = await getCat();
    lmsCategorias.forEach(docC => {
        var optionCat = document.createElement('option');
        optionCat.value = docC.id;
        var optionCatText = document.createTextNode(docC.data().nombreCat);
        optionCat.appendChild(optionCatText);
        selectCategoryId.appendChild(optionCat);
    })

    // Se realiza la consulta a la coleccion 'lms-tipos' para luego llenar el elemento <select> con los tipos existentes en la coleccion 'lms-tipos', en el formulario de registro 
    var selectTypeId = document.getElementById("docenteTipo");
    const lmsTipos = await getType();
    lmsTipos.forEach(docT => {
        var optionType = document.createElement('option');
        optionType.value = docT.id;
        var optionTypeText = document.createTextNode(docT.data().nombreTipo);
        optionType.appendChild(optionTypeText);
        selectTypeId.appendChild(optionType);
    })
    // Se inicializan los elementos <select> de acuerdo a la documentacion del framework Materialize
    $(document).ready(function(){
        $('select').formSelect();
    });
    // Se realiza una consulta a la coleccion 'lms-docentes' mediante la funcion getDocentes()
    const lmsDocentes = await getDocentes();
    listaLmsDoc = lmsDocentes;
    // Se ejecuta la funcion listaDocentes() que genera los cards de los docentes y los muestra en la lista de docentes
    listaDocentes(lmsDocentes);
})