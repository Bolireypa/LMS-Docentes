//
const db = firebase.firestore();

// Se declara la variable taskForm que captura los datos del formulario de registro de docentes
const taskForm = document.getElementById("task-form");

// Se declara la variable newPortafolio que obtiene el boton que agregara mas elementos input de tipo file al formulario de registro
const newPortafolio = document.getElementById('new-portafolio');

// Contador que aumenta su valor en 1 cada vez que se aprete el boton 'Nueva imagen' en la funcion newImage()
var c = 0;

// Contador
var c1 = 0;


// const saveCategory = (refCat, nombreCat) =>
//     db.collection('lms-categorias').doc().set({
//         refCat,
//         nombreCat,
//     });

// saveCategory("categoria1301Desarrollo5137","Desarrollo");
// saveCategory("categoria1301Administracion7914","Administracion");
// saveCategory("categoria1301Inteligenciaartificial6652","Inteligencia artificial");
/* */

// Funcion saveUser() que captura los datos ingresados en el formulario de registro en la coleccion llamada 'lms-docentes'
const saveUser = (ref, name, email, summary, refCatDoc) =>
    db.collection('lms-docentes').doc().set({
        ref,
        name,
        email,
        summary,
        refCatDoc,
    });

// Funcion saveDocuments() que captura los dotos del los archivos del formulario en la coleccion llamada 'lms-archivos'
const saveDocuments = (refid, url, type) => 
    db.collection('lms-archivos').doc().set({
        refid,
        url,
        type,
    });/* */

// Funcion getTask() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getTask = () => db.collection('lms-docentes').get();

const getCat = () => db.collection('lms-categorias').get();

// fillCategory = function () {
//     var selectId = document.getElementById("categorySelect");
//     const lmsCategorias = getCat();
//     lmsCategorias.forEach(docC => {
//         console.log(docC.data());
        
//     })
// }

// fillCategory();

// Se inicia la funcion de recuperacion de los datos guardados, ejecutando la funcion getTask(), de manera asincrona, al momento de recargar la pagina
window.addEventListener('DOMContentLoaded', async (e) => {
    const lmsDocentes = await getTask();
    lmsDocentes.forEach(doc => {

        console.log(doc.data());
        
    })


    var selectId = document.getElementById("categorySelect");
    const lmsCategorias = await getCat();
    lmsCategorias.forEach(docC => {
        console.log(docC.data());
        var optionCat = document.createElement('option');
        optionCat.value = docC.data().refCat;
        var optionCatText = document.createTextNode(docC.data().nombreCat);
        optionCat.appendChild(optionCatText);
        selectId.appendChild(optionCat);
    })
})

// Funcion que agrega un nuevo elemento de tipo input en el formulario de registro que posibilita al docente subir mas imagenes de su portafolio
newImage = function () {
    c=c+1;
    console.log('nueva fila para agrgar imagen');
    var divPortafolio = document.getElementById('img-portafolio');
    var newInput = document.createElement('input');
    newInput.type='file';
    newInput.id='task-portafolio_'+c;
    newInput.className='btn btn-danger';
    // divPortafolio.innerHTML = '<input type="file" class="btn btn-danger">';
    divPortafolio.appendChild(newInput);

    if (c==5) {
        newPortafolio.hidden=true;
    }
}

function refGenerada(name, mail) {
    var fecha = new Date();
    var primerNombre = name.split(" ");
    var nombre = primerNombre[0];
    var numero = Math.floor(Math.random() * 1000);
    var emailParcial = mail.split("@");
    var email = emailParcial[0];
    const idReferencia = 'docente'+fecha.getDate()+fecha.getMonth()+nombre+numero+email;
    return idReferencia;
}

// Se ejecuta el evento submit del formulario de registro de docentes que ejecuta la funciones de guardado de datos y archivos de los docentes en firebase
// **Se inicia la funcion saveUser() que guarda los datos del docente en cada uno de los campos de la base de datos de firebase en la coleccion 'lms-docentes', de manera asincrona
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Se asigna a las variables los valores de los campos del formulario de registro de docentes
    
    
    // const ref = 'docente1id12345'; //(Generar un codigo unico de refenrecia, utilizar otra variale para las pruebas), posibles refernecias: fecha + nombre, fecha + nombre + numero aleatorios, 'docente'+fecha+nombre+numero aleatorio(4 a 6 digitos)+parte de su email; todo dentro de una funcion
    const name = taskForm['task-title'].value;
    const email = taskForm['task-email'].value;
    const summary = taskForm['task-summary'].value;
    const category = taskForm['categorySelect'].value;


    const ref = refGenerada(name,email); 
    
    console.log(ref);

    // Se ejecuta la funcion saveUser() que guarda los datos del docentes en la coleccion 'lms-docentes' en firebase
    await saveUser(ref, name, email, summary, category);

    // Se inicia la funcion uploadImg() que sube la imagen en storage de firebase
    uploadImg(ref);

    // Se ejecuta la funcion uploadDocument() que sube el archivo PDF del CV del docente en storage de firebase
    uploadDocument(ref);

    

    //taskForm.reset(); //los campos del formulario se resetean
    //name.focus();   //hace focus al campo de nombre en el formulario

    console.log(name, email, summary, category);
})

// Funcion uploadImg() que captura la imagen y sus datos, crea una referencia en el storage de firebase, guarda la imagen en la ruta '/portafolioDocente/', y devuelve la ruta de la imagen
uploadImg = function(ref){

    let imagenesSubidas=[];

    // var docenteArchivos = new Object();

    //contar numero de imagenes, capturar 'n' imagenes y subirlas a firebase
    for (let img = 0; img < 6; img++) {
        
        const inputImg = document.getElementById('task-portafolio_'+img);
        if (inputImg) {
            console.log('Imagen:'+img+' existe..... '+inputImg);
            c1 = img;
            
            //////(cambiar descripcion) espacio de las lineas de codigo, ubicadas en la funcion uploadImageProccess()
            uploadImageProccess(img, imagenesSubidas, ref);


        }else{
            console.log('Imagen:'+img+' no esxiste');
        }
        // const ;
        
    }
    // Imprime en consola cuantas imagenes se subiran
    // console.log(c1);
    
/*
    
    */
};

// Funcion que captura los datos de las imagenes y los sube al storage de firebase
uploadImageProccess = function (imgNumber, imagenesSubidas, refid) {
                /////////////////////// -- (Cambiar comnetario) Posible solucion: ejecutaar las siguientes lineas de codigo en una funcion, y utilizar funciones recursivas para subir una imagen luego de otra y asi obtener el nombre de la imagen y la ruta
                var file = taskForm['task-portafolio_'+imgNumber].files[0];
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
                        console.log('Imagen '+file.name+' subida');
                        
                        uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                            console.log(url);
        
                            imagenesSubidas.push(file.name);
                            console.log(imagenesSubidas);
                            
                            // --(posible accion a borrar) Se asigna a las variables los valores de la refernecia al docente que subio sus archivos, y las rutas de los mismos
                            // const refid = 'docente1';
                            

                            // (posible ubicacion distinta) Se ejecuta la funcion saveDocuments() que guarda las rutas de las imagenes y el documento pdf, con una refenrencia hacia el docente al que pertenecen los archivos
                            saveDocuments(refid, url, 'imagen');

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
                ///////////////////
}

// Funcion que captura los datos del documento PDF del docente para luego subirlo al storage de firebase
uploadDocument = function(refid){
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

                saveDocuments(refid, url, 'pdf');
                
            })
        });
    }
};

// Se ejecuta el evento 'click', al presionar el boton de agregar nueva imagen, que a su ve ejecuta la funcion newImage()
newPortafolio.addEventListener('click', e =>{
    e.preventDefault();
    newImage();
})



/* // -- posible accion a borrar ya que solo es una prueba
//Prueba de funcion recursiva
var cd=0;

const funcionDePrueba = function () {
    for (let index = 0; index < 20; index++) {
        console.log(index);

        
    }
    cd=cd+1;
    if (cd==5) {
        cd = 0;
        // const fd="funcion ejecutada 5 veces";
        return 23;

    }
    funcionDePrueba();
}
/* -- */
