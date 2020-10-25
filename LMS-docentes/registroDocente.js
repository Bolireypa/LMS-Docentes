// DB firestore
const db = firebase.firestore();

//
const docenteForm = document.getElementById("formRegistroDocentes");

//
const getTask = () => db.collection('lms-docentes').get();

//
const getCat = () => db.collection('lms-categorias').get();

//
const imagePortafolio = docenteForm["docentePortafolio_0"];

//
var c = 0;

//
var c1 = 0;

//
var c2 = 0;

//
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

//
const newBtnPortafolio = function (imgVal, imgId) {
    var divPortafolio = document.getElementById('idPortafolio');

    
    if (imgVal!="") {
        console.log("nueva imagen "+imgVal);
        c=c+1;
        if (c==6) {
            
        } else {
            // var divPortafolio = document.getElementById('idPortafolio');
            var newInput = document.createElement('input');
            newInput.type='file';
            newInput.id='docentePortafolio_'+c;
            newInput.onchange = function () { newBtnPortafolio(this.value, this.id); };
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
        
    } else {
        imgVal = 'no hay imagen';
        console.log("nueva imagen "+imgVal);
        
    }
    console.log(divPortafolio.childNodes);
    
}
// imagePortafolio.addEventListener('change', (e)=>{
    
// })

//
const verificarDatos = function () {
    var name = docenteForm['docenteNombre'].value;
    var email = docenteForm["docenteEmail"].value;
    var summary = docenteForm["docenteResumen"].value;
    var category = docenteForm["docenteCategoria"].value;
    var cv = docenteForm["docenteCV"].files[0];
    var image = docenteForm["docentePortafolio_0"];
    console.log(name, email, summary, category, cv, image.files[0]);
    
}

window.addEventListener('DOMContentLoaded', async (e) => {
    $('.sidenav').sidenav();

    $('.modal').modal();

    var divPortafolio = document.getElementById('idPortafolio');
    var newInput = document.createElement('input');
    newInput.type='file';
    newInput.id='docentePortafolio_0';
    newInput.onchange = function () { newBtnPortafolio(this.value, this.id); };
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

    const lmsDocentes = await getTask();
    lmsDocentes.forEach(doc => {
        console.log(doc.data());
    })

    var selectId = document.getElementById("docenteCategoria");
    const lmsCategorias = await getCat();
    lmsCategorias.forEach(docC => {
        console.log(docC.data());
        var optionCat = document.createElement('option');
        optionCat.value = docC.data().refCat;
        var optionCatText = document.createTextNode(docC.data().nombreCat);
        optionCat.appendChild(optionCatText);
        selectId.appendChild(optionCat);
    })

    $(document).ready(function(){
        $('select').formSelect();
    });
})

//
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

//
docenteForm.addEventListener('submit', async (e) => {
    e.preventDefault();//Impide que el formulario se recargue

    

    $('.modal').modal('open');

    const name = docenteForm['docenteNombre'].value;
    const email = docenteForm["docenteEmail"].value;
    const summary = docenteForm["docenteResumen"].value;
    const category = docenteForm["docenteCategoria"].value;
    // const cv = docenteForm["docenteCV"].files[0];
    // const image = docenteForm["docentePortafolio_0"].files[0];
    // console.log(name, email, summary, category, cv, image);

    const ref = refGenerada(name,email);
    
    // Se ejecuta la funcion saveUser() que guarda los datos del docentes en la coleccion 'lms-docentes' en firebase
    await saveUser(ref, name, email, summary, category);

    // Se inicia la funcion uploadImg() que sube la imagen en storage de firebase
    uploadImg(ref);

    // Se ejecuta la funcion uploadDocument() que sube el archivo PDF del CV del docente en storage de firebase
    uploadDocument(ref);
});

uploadImg = function(ref){
    let imagenesSubidas=[];
    // var docenteArchivos = new Object();
    //contar numero de imagenes, capturar 'n' imagenes y subirlas a firebase
    for (let img = 0; img < 6; img++) {
        const inputImg = document.getElementById('docentePortafolio_'+img);
        if (inputImg) {
            if (inputImg.files[0]) {
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
            
            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                console.log(url);

                imagenesSubidas.push(file.name);
                console.log(imagenesSubidas);
                confirmacionRegistro(imgNumber, c1-1);
                
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
}

uploadDocument = function(refid){
    var docFile = docenteForm['docenteCV'].files[0];
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

confirmacionRegistro = function (subir, subido) {
    console.log(subir, subido);
    if (subir == subido) {
        console.log("Todas la imagenes subidas");
        var idModalContent = document.getElementById('modalContent');
        var idModalProgress = document.getElementById('modalProgress');
        var newModalProgress = document.createElement('h1');
        newModalProgress.id = 'modalProgress';
        var modalProgressText = document.createTextNode('Registrado correctamete!');
        newModalProgress.appendChild(modalProgressText);
        idModalContent.replaceChild(newModalProgress, idModalProgress);
    } else {
        
    }
    
}