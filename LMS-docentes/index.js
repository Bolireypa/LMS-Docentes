//
const db = firebase.firestore();

// Se declara la variable taskForm que captura los datos del formulario de registro de docentes
const taskForm = document.getElementById("task-form");

// Funcion saveUser() que captura los datos ingresados en el formulario de registro en la coleccion llamada 'lms-docentes'
const saveUser = (name, email, summary) =>
    db.collection('lms-docentes').doc().set({
        name,
        email,
        summary
    });

// Funcion getTask() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getTask = () => db.collection('lms-docentes').get();

// Se inicia la funcion de recuperacion de los datos guardados, ejecutando la funcion getTask(), de manera asincrona, al momento de recargar la pagina
window.addEventListener('DOMContentLoaded', async (e) => {
    const lmsDocentes = await getTask();
    lmsDocentes.forEach(doc => {

        console.log(doc.data());
        
    })
})
    

// Se inicia la funcion saveUser() que guarda los datos del docente en cada uno de los campos de la base de datos de firebase en la coleccion 'lms-docentes', de manera asincrona
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = taskForm['task-title'].value;
    const email = taskForm['task-email'].value;
    const summary = taskForm['task-summary'].value;

    await saveUser(name, email, summary);

    // Se inicia la funcion uploadImg() que sube la imagen en storage de firebase
    uploadImg();

    //
    uploadDocument();


    //taskForm.reset(); //los campos del formulario se resetean
    //name.focus();   //hace focus al campo de nombre en el formulario

    console.log(name, email, summary);
})

// Funcion uploadImg() que captura la imagen y sus datos, crea una referencia en el storage de firebase, guarda la imagen en la ruta '/portafolioDocente/', y devuelve la ruta de la imagen
uploadImg = function(){
    var file = taskForm['task-portafolio'].files[0];
    console.log(file);

    if (!file) {
        
    }else{
        var storageRef = storage.ref('/portafolioDocente/'+file.name);

        var uploadTask = storageRef.put(file);
        uploadTask.on('state_changed', function(snapshot){

        }, function (error) {
            console.log(error);
            
        }, function () {
            console.log('Imagen subida');
            
            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
              console.log(url);

              /*
              var xhr = new XMLHttpRequest();
              xhr.responseType = 'blob';
              xhr.onload = function(event) {
                var blob = xhr.response;
              };
              xhr.open('GET', url);
              xhr.send();
              */

              var img = document.getElementById('myimg');
              img.src = url;

            })
        });
    }
};

uploadDocument = function(){
    var docFile = taskForm['task-cv'].files[0];
    console.log(docFile);
    if (!docFile) {
        
    }else{
        var storageDocRef = storage.ref('/cvDocente/'+docFile.name)
        var uploadDoc = storageDocRef.put(docFile);
        uploadDoc.on('state_changed', function (snapshot) {
            
        }, function (error) {
            console.log(error);

        }, function () {
            console.log('Documento subido');
            uploadDoc.snapshot.ref.getDownloadURL().then(function (url) {
                console.log(url);
                
            })
        });
    }
};