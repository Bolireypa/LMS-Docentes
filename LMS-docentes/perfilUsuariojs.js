// Funcion userDataDoc() que realiza una consulta a la coleccion 'lms-docentes' utilizado para verificar si el usuario logeado tiene datos en la coleccion 'lms-docentes', requiere el parametro: userEmail(el email del usuario con el que se verifican sus datos)
const userDataDoc = (userEmail) => db.collection('lms-docentes').where('email', '==', userEmail).get();

// Funcion getCVData() que realiza una consulta a la coleccion 'lms-archivos', utilizado para verificar si el usuario tiene un CV registrado, require el parametro: userID(la id del usuario para verificar si el CV existe)
const getCVData = (userID) => db.collection('lms-archivos').where('refid', '==', userID).get();

// Funcion getCat() que obtiene todos los datos de las categorias registradas en la coleccion 'lms-categorias' de Firebase
const getCat = () => db.collection('lms-categorias').orderBy('nombreCat').get();

// Funcion getType() que obtiene todos los datos de los tipos registradas en la coleccion 'lms-tipos' de Firebase
const getType = () => db.collection('lms-tipos').orderBy('nombreTipo').get();

// Funcion getOptions() que obtiene las opciones guradadas en la coleccion 'lms-opciones'
const getOptions = () => db.collection('lms-opciones').get();

// Funcion saveUser() que realiza el registro de docentes nuevos en la coleccion 'lms-docentes', requiere el parametro: userData(los datos de docente de tipo objeto)
const saveUser = (userData) => db.collection('lms-docentes').add(userData)
    .then(function(docData) {
      // console.log(docData);
      // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta registrando a un docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (el nombre del docente que registro), cuarto parametro (la id del docente registrado)
      var log1 = {
        logType: 'Registro',
        lastRegister: '',
        newRegister: userData.name,
        idRegister: docData.id,
      };
      logRegister(currentUser.displayName, currentUser.uid, log1, docData.id);
      location.reload();
        
    })
    .catch(function (error) {
      console.log(error);
      
    });

// Funcion updateDoc() que edita los datos de docente en la coleccion 'lms-docentes', requiere los parametros: id (id del docente), updatedDoc (un objeto que contiene los datos de docente a editar)
const updateDoc = (id, updatedDoc, currentDoc) => db.collection('lms-docentes').doc(id).update(updatedDoc)
    .then(async function() {
      console.log('editado correctamente');
      // Se realiza una comparacion de los datos antiguos con los datos nuevos del docente a modificar
      var lastReg = '';
      var newReg = '';
      // if (currentDoc.name != updatedDoc.name) {
      //     lastReg = 'Nombre: '+currentDoc.name;
      //     newReg = 'Nombre: '+updatedDoc.name;
      // }
      // if (currentDoc.email != updatedDoc.email) {
      //     lastReg = lastReg+' | '+'Email: '+currentDoc.email;
      //     newReg = newReg+' | '+'Email: '+updatedDoc.email;
      // }
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
      if (currentDoc.specialism != updatedDoc.specialism) {
        lastReg = lastReg+' | '+'Especialidad: '+currentDoc.specialism;
        newReg = newReg+' | '+'Especialidad: '+updatedDoc.specialism;
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
      location.reload();
    }).catch(function (error) {
      console.log(error);
      
    });

// Funcion deleteDoc() que elimina los datos de docente de la coleccion 'lms-docentes', requiere el parametro: id (Id del docente), y el nombre del docente eliminado
const deleteDoc = (id, nameDelete) => db.collection('lms-docentes').doc(id).delete()
    .then(async function() {
      // Se capturan el nombre del docente a eliminar y su id
      var log1 = {
        logType: 'Eliminacion',
        lastRegister: '',
        newRegister: nameDelete,
        idRegister: id,
      };
      // Se ejecuta la funcion logRegister() que guarda un registro de que usuario esta modificando a un docente, en la coleccion 'lms-log', se envia los parametros: Primer parametro (el nombre del usuario que realiza la accion de registrar), segundo parametro (la id del usuario que realiza la accion de registrar), tercer parametro (los datos del docente que se elimino), cuarto parametro (la id del docente registrado)
      logRegister(currentUser.displayName, currentUser.uid, log1, id);
      console.log("Document successfully deleted!");
      location.reload();
    }).catch(function(error) {
      // Si los datos del docente no fueron eliminados correctamente se muestra un mensaje de error
      console.error("Error removing document: ", error);
    });

// Funcion deleteCV() que elimina la referencia del CV de docente de la coleccion 'lms-archivos'
const deleteCV = (id, refId, namefile) => db.collection('lms-archivos').doc(id).delete()
    .then(async function () {
        // Se cierra el modal de Editar CV
        $('.modal').modal('close');
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

// Se capturan los elementos del formulario de datos de usuario
var profileUserName = document.getElementById('userName');
var labelUserName = document.getElementById('labelUserName');
var profileUserEmail = document.getElementById('userEmail');
var labelUserEmail = document.getElementById('labelUserEmail');
var profileUserPassword = document.getElementById('userPassword');
var userPasswordConfirm = document.getElementById('userPasswordConfirm');
// Se captura el boton de Guardar datos de usuario
var saveUserData = document.getElementById('saveUserData');
// Se capturan los elementos del formulario de datos de docente
var docenteResumen = document.getElementById('docenteResumen');
var docenteResumenLabel = document.getElementById('docenteResumenLabel');
var docenteExperiencia = document.getElementById('docenteExperiencia');
var docenteExperienciaLabel = document.getElementById('docenteExperienciaLabel');
var docenteTrabajo = document.getElementById('docenteTrabajo');
var docenteTrabajoLabel = document.getElementById('docenteTrabajoLabel');
var docenteTelefono = document.getElementById('docenteTelefono');
var docenteTelefonoLabel = document.getElementById('docenteTelefonoLabel');
var docenteEspecialidad = document.getElementById('docenteEspecialidad');
var docenteEspecialidadLabel = document.getElementById('docenteEspecialidadLabel');
var selectTypeId = document.getElementById("docenteTipo");
var selectCategoryId = document.getElementById("docenteCategoria");
var btnSaveDocData = document.getElementById('btnSaveDocData');
// Se captura el boton de confirmacion de eliminacion de datos de docente
var btnDeleteDocModal = document.getElementById('btnDeleteDocModal');
var confirmDelete = document.getElementById('confirmDelete');
// Se capturan botones para los modales de CV y portafolio
var showPortfolio = document.getElementById('showPortfolio');
var showCV = document.getElementById('showCV');
var saveCVModalBtn = document.getElementById('saveCVModalBtn');
var modalCVContent =  document.getElementById('modalCVContent');
var docenteImagenPerfil = document.getElementById('docenteImagenPerfil');
var ProfileImageDoc = document.getElementById('ProfileImageDoc');

// Funcion getDefaultProfileImage() que obtiene la imagen de perfil por defecto a mostrar en los cards de los docentes
getDefaultProfileImage = async function () {
  var getOptionsProf = await getOptions();
  ProfileImageDoc.src = getOptionsProf.docs[0].data().defaultProfileImageUrl;
}
getDefaultProfileImage();

// Funcion showCurrentCV() que realiza una consulta a la coleccion 'lms-archivos' para verificar si el usuario tiene un CV registrado, requiere los parametros: userName(el nombre del usuario), userId(la id del usuario)
showCurrentCV = async function (userName, userId) {
  while (modalCVContent.firstChild) {
    modalCVContent.removeChild(modalCVContent.firstChild);
  }
  var currentCV = await getCVData(userId);
  if (currentCV.docs[0]) {
    console.log(userName, userId, currentCV);
    var currentCVTitle = createElementFunction('h5', '', 'CV actual', '');
    modalCVContent.appendChild(currentCVTitle);
    var currentCVName = createElementFunction('h6', '', currentCV.docs[0].data().fileName, '');
    modalCVContent.appendChild(currentCVName);
    var buttonModalRow = createElementFunction('div', 'row', '', '');
    var currentCVShowBtnCol = createElementFunction('div', 'col s12 m6');
    var currentCVShowBtn = createElementFunction('a', 'btn green w100', 'Ver', '');
    currentCVShowBtn.href = currentCV.docs[0].data().url;
    currentCVShowBtn.target = '_blank';
    currentCVShowBtnCol.appendChild(currentCVShowBtn);
    buttonModalRow.appendChild(currentCVShowBtnCol);
    var currentCVDeleteBtnCol = createElementFunction('div', 'col s12 m6');
    var currentCVDeleteBtn = createElementFunction('a', 'btn red w100', 'Eliminar', '');
    currentCVDeleteBtn.onclick = function () {
      console.log(currentCV.docs[0].id);
      deleteCV(currentCV.docs[0].id, userId, currentCV.docs[0].data().fileName);
    }
    currentCVDeleteBtnCol.appendChild(currentCVDeleteBtn);
    buttonModalRow.appendChild(currentCVDeleteBtnCol);
    modalCVContent.appendChild(buttonModalRow);
  } else {
    
  }
  
}

document.addEventListener('DOMContentLoaded',async (e) => {
  // Se realiza la consulta a la coleccion 'lms-categorias' para luego llenar el elemento <select> con las categorias existentes en la coleccion 'lms-categorias', en el formulario de registro 
  const lmsCategorias = await getCat();
  lmsCategorias.forEach(docC => {
      var optionCat = document.createElement('option');
      optionCat.value = docC.id;
      var optionCatText = document.createTextNode(docC.data().nombreCat);
      optionCat.appendChild(optionCatText);
      selectCategoryId.appendChild(optionCat);
  })

  // Se realiza la consulta a la coleccion 'lms-tipos' para luego llenar el elemento <select> con los tipos existentes en la coleccion 'lms-tipos', en el formulario de registro 
  const lmsTipos = await getType();
  lmsTipos.forEach(docT => {
      var optionType = document.createElement('option');
      optionType.value = docT.id;
      var optionTypeText = document.createTextNode(docT.data().nombreTipo);
      optionType.appendChild(optionTypeText);
      selectTypeId.appendChild(optionType);
  })

  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      console.log('user signed in');
      var userDocData = await userDataDoc(user.email); // user.email   'docente03@gmail.com'
      // Se llenan los datos del usuario en el formulario de perfil de usuario
      profileUserName.value = user.displayName;
      labelUserName.className = 'active';
      profileUserEmail.value = user.email;
      labelUserEmail.className = 'active';
      if (userDocData.docs.length) {
        console.log(userDocData.docs[0].data());
        var userDoc = userDocData.docs[0].data();
        // En caso de que existan los datos del usuario en la coleccion 'lms-docentes', se muestran sus datos en el formulario
        docenteResumen.value = userDoc.summary;
        docenteResumenLabel.className = 'active';
        docenteExperiencia.value = userDoc.experience;
        docenteExperienciaLabel.className = 'active';
        docenteTrabajo.value = userDoc.lastWork;
        docenteTrabajoLabel.className = 'active';
        docenteTelefono.value = userDoc.phone;
        docenteTelefonoLabel.className = 'active';
        docenteEspecialidad.value = userDoc.specialism;
        docenteEspecialidadLabel.className = 'active';
        selectCategoryId.value = userDoc.category;
        selectTypeId.value = userDoc.type;
        if (userDoc.profImageUrl) {
          ProfileImageDoc.src = userDoc.profImageUrl;
        }

        btnDeleteDocModal.setAttribute('style', '');
        btnSaveDocData.value = 'Guardar';

        // Se asigna la id de los datos de docente del usuario, al boton de cofirmacion de eliminar datos, mediante el evento onclick del boton de confirmacion de eliminar datos, y se ejecuta la funcion deleteDoc(), y elimina los datos del docente de la coleccion 'lms-docentes'
        confirmDelete.onclick = function () {
          deleteDoc(userDocData.docs[0].id, userDoc.name);
        }
        // Se asigna el evento click al boton de Guardar, que ejecuta la funcion updateDoc() que modifica los datos del docente en la coleccion 'lms-docentes'
        btnSaveDocData.addEventListener('click', (e) => {
          e.preventDefault();
          btnSaveDocData.className = 'btn disabled';
          console.log('Editar cambios', userDocData.docs[0].id);
          var profImgDoc = docenteImagenPerfil.files[0];
            if (profImgDoc) {
                var storageRef = storage.ref('/ImagenPerfil/'+profImgDoc.name);
    
                var uploadTask = storageRef.put(profImgDoc);
                
                uploadTask.on('state_changed', function(snapshot){
    
                    // Progreso de la imagen a subir
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(profImgDoc.name+' subiendo ' + progress + '% completado');
    
                }, function (error) {
                    console.log(error);
                    
                }, function () {
                    // console.log('Imagen '+c1+' '+profImgDoc.name+' subida');
    
                    uploadTask.snapshot.ref.getDownloadURL().then(async function (url) {
                        console.log(url);
                        await updateDoc(userDocData.docs[0].id, {
                            // ref: e.target[0].value,
                            summary: docenteResumen.value,
                            experience: docenteExperiencia.value,
                            lastWork: docenteTrabajo.value,
                            phone: docenteTelefono.value,
                            specialism: docenteEspecialidad.value,
                            category: selectCategoryId.value,
                            type: selectTypeId.value,
                            profImageName: profImgDoc.name,
                            profImageUrl: url
                            // refCatDoc: e.target[0].value,
                        },{
                            summary: userDoc.summary,
                            experience: userDoc.experience,
                            lastWork: userDoc.lastWork,
                            phone: userDoc.phone,
                            specialism: userDoc.specialism,
                            category: userDoc.category,
                            type: userDoc.type,
                            profImageName: userDoc.profImageName,
                            profImageUrl: userDoc.profImageUrl
                        });
                    })
                });
    
                console.log('Imagen:'+profImgDoc);
                
            }else{
              updateDoc(userDocData.docs[0].id, {
                summary: docenteResumen.value,
                experience: docenteExperiencia.value,
                lastWork: docenteTrabajo.value,
                phone: docenteTelefono.value,
                specialism: docenteEspecialidad.value,
                category: selectCategoryId.value,
                type: selectTypeId.value
              },{
                summary: userDoc.summary,
                experience: userDoc.experience,
                lastWork: userDoc.lastWork,
                phone: userDoc.phone,
                specialism: userDoc.specialism,
                category: userDoc.category,
                type: userDoc.type,
              });
            }
        })
        // Se asigna el evento click al boton de Portafolio, que muestra un modal con las opciones de agregar, cambiar o eliminar imagenes del portafolio de docente
        showPortfolio.onclick = function () {
          portafolio(userDoc.name, userDocData.docs[0].id, true);
        }

        // Se asigna el evento click al boton de CV, que muestra el CV actual registrado si existe, para luego cambiarlo o eliminarlo
        showCV.onclick = function () {
          showCurrentCV(userDoc.name, userDocData.docs[0].id);
        }
        // Se asigna el evento click al boton de Guardar CV que guarda o modifica el CV actual
        saveCVModalBtn.onclick = function () {
          console.log(userDocData.docs[0].id);
          var docCVFile = document.getElementById('docenteCV').files[0];
          if (docCVFile) {
            console.log('documento encontrado');
            var storageDocRef = storage.ref('/cvDocente/'+docCVFile.name)
            var uploadDoc = storageDocRef.put(docCVFile);
            uploadDoc.on('state_changed', function (snapshot) {
                
            }, function (error) {
                console.log(error);
            }, function () {
                console.log('Documento subido');
                uploadDoc.snapshot.ref.getDownloadURL().then(async function (url) {
                    console.log(url);
                    console.log(docCVFile.name);
                    var CVData = await getCVData(userDocData.docs[0].id);
                    console.log(CVData);
                    if (CVData.docs.length > 0) {
                      console.log('CV ya registrado');
                      updateFile(CVData.docs[0].id, userDocData.docs[0].id, 'pdf', {
                        fileName: docCVFile.name,
                        url: url,
                      }, CVData.docs[0].data().fileName);
                    } else {
                      console.log('CV no registrado');
                      saveFile(docCVFile.name, userDocData.docs[0].id, url, 'pdf');
                    }
                })
            });
          } else {
            console.log('no existe documento');
          }
        }
      } else {
        console.log("No existe");
        // En caso de que no existan los datos del usuario en la coleccion 'lms-docentes'
        showPortfolio.className = 'btn red w100 modal-trigger disabled';
        showCV.className = 'btn green w100 modal-trigger'; // disabled';
        btnSaveDocData.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Registrar nuevo');
          var profImgDoc = docenteImagenPerfil.files[0];
          if (profImgDoc) {
              var storageRef = storage.ref('/ImagenPerfil/'+profImgDoc.name);

              var uploadTask = storageRef.put(profImgDoc);
              
              uploadTask.on('state_changed', function(snapshot){

                  // Progreso de la imagen a subir
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(profImgDoc.name+' subiendo ' + progress + '% completado');

              }, function (error) {
                  console.log(error);
                  
              }, function () {
                  // console.log('Imagen '+c1+' '+profImgDoc.name+' subida');

                  uploadTask.snapshot.ref.getDownloadURL().then(async function (url) {
                      console.log(url);
                      saveUser({
                        name: profileUserName.value,
                        email: profileUserEmail.value,
                        summary: docenteResumen.value,
                        experience: docenteExperiencia.value,
                        lastWork: docenteTrabajo.value,
                        phone: docenteTelefono.value,
                        specialism: docenteEspecialidad.value,
                        category: selectCategoryId.value,
                        type: selectTypeId.value,
                        profImageName: profImgDoc.name,
                        profImageUrl: url
                      });  
                  })
              });

              console.log('Imagen:'+profImgDoc);
              
          }else{
              console.log('Imagen: no esxiste');
          }
          
        })
      }      
    } else {
      console.log('no user signed in');
      
    }

    saveUserData.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("guardar datos de usuario, correo y contraseña", profileUserName.value, profileUserEmail.value, profileUserPassword.value);
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        userPasswordConfirm.value
      );

      // Prompt the user to re-provide their sign-in credentials

      user.reauthenticateWithCredential(credential).then(function() {
        // User re-authenticated.
        console.log('Reautenticado');
        user.updateProfile({
          displayName: profileUserName.value
        }).then(function() {
          // Update successful.
          console.log('NOmbre de usuario modificado corretamente');
          user.updateEmail(profileUserEmail.value).then(function() {
            // Update successful.
            console.log('Cambio de email realizado correctamente');
            if (profileUserPassword.value != '') {
              console.log('cambio de contraseña');
              user.updatePassword(profileUserPassword.value).then(function() {
                // Update successful.
                console.log('Contraseña cambiad correctamete');
                location.reload();
              }).catch(function(error) {
                // An error happened.
                console.log('Ocurrio un error en el cambio de contraseña', error);
              });
            } 
            else {
              location.reload();
            }
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          });
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });        
      }).catch(function(error) {
        // An error happened.
        console.log(error);
        switch (error.code) {
          case 'auth/wrong-password':
            alert('Contraseña incorrecta');
            break;
        
          default:
            break;
        }
      });
    })

  });
  
  docenteImagenPerfil.addEventListener('change', (e) => {
    var reader = new FileReader();
    reader.onload = function (e) {
        ProfileImageDoc.src = e.target.result;
    }
    reader.readAsDataURL(this.docenteImagenPerfil.files[0]);
  })

  // $('.tabs').tabs();
  // $(".dropdown-trigger").dropdown({ hover: false });
  var dropdown = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(dropdown);
  var collapsibles = document.querySelectorAll('.collapsible.expandable');
  M.Collapsible.init(collapsibles, {
    accordion: false
  });
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  
})


/**
 * lineas de codigo en lista de docentes portafolio de imagenes linea 671 aprox
 * var divAddImageDescription = document.createElement('div');
            divAddImageDescription.className = 'input-field';
            var addImageDescription = document.createElement('input');
            addImageDescription.type = 'text';
            divAddImageDescription.appendChild(addImageDescription);
            divColAddImageEmpty.appendChild(divAddImageDescription);
 * 
 */