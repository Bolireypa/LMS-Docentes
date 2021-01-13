// portafolio = function (docName, docRef, editPortafolio) {
//   console.log('Ver portafolio de docente', docName, docRef, editPortafolio);
  
// }

// Funcion getDoc() que obtiene, mediante su id, todos los datos del docente registrado en la coleccion 'lms-docentes' de Firebase
const getDoc = (id) => db.collection('lms-docentes').doc(id).get();

// Variable que guarda el valor de numero maximo de imagenes que se mostraran
var numMaxImg = 0;

// Se realiza una consulta a la coleccion 'lms-opciones' mediante la funcion getOptions(), luego se reemplaza la varialble imgMaxNumber que limita las imagenes del portafolio de docente
var imgMaxNumber = getOptions().then(function (numMax) {
  numMaxImg = numMax.docs[0].data().imagesNumber;
  
});

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
            $('.modal').modal('close');
            // modals[0].click();
            // modals[1].click();
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
                $('.modal').modal('close');
                // modals[0].click();
                // modals[1].click();
                
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
        
        console.log("Document successfully updated!");
    }).catch(function(error) {
        // Si los datos de archivo no fueron modificados correctamente se muestra un mensaje de error
        console.error("Error updating document: ", error);
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

        console.log("Image successfully deleted!");
    }).catch(function(error) {
        // Si los datos de la imagen no fueron eliminados correctamente se muestra un mensaje de error
        console.error("Error removing document: ", error);
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
      }
  })
  .catch(function(error) {
      // En caso de error se lo muestra en consola
      console.log("Error getting documents: ", error);
  });
}