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

// Funcion getTask() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getTask = () => db.collection('lms-docentes').get();

// const getUrl = () => db.collection('lms-archivos').get();

downloadCV = function (docName, docRef) {
    console.log('Descargando CV de '+docName);

    var urlCV = '';

    // consulta a la coleccion lms-archivos para obtener la url de los archivos guardados por el docente
    db.collection("lms-archivos").where("refid", "==", docRef).where("type", "==", "pdf")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc1) {
            // doc.data() is never undefined for query doc snapshots
            urlCV = doc1.data().url;
            console.log(doc1.id, " => ", doc1.data().url);

            // 
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                var blob = xhr.response;
            };
            xhr.open('GET', urlCV);
            xhr.send();
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

portafolio = function (docName, docRef) {
    console.log(docName+' '+docRef);
    var idModalBody = document.getElementById('idModalBody');
    var idVerPortafolio = document.getElementById('verPortafolio');
    var pad = document.createElement('div');
    pad.id = "verPortafolio";
    idModalBody.replaceChild(pad, idVerPortafolio);

    // idVerPortafolio.appendChild(pad);
    db.collection("lms-archivos").where("refid", "==", docRef).where("type", "==", "imagen")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc1) {
            // doc.data() is never undefined for query doc snapshots
            // urlCV = doc1.data().url;
            console.log(doc1.id, " => ", doc1.data().url);

            var imagenPortafolio = document.createElement('img');
            imagenPortafolio.src = doc1.data().url;
            imagenPortafolio.width = "400";
            pad.appendChild(imagenPortafolio);
            //   var img = document.getElementById('myimg');
            //   img.src = url;

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

categoriaCurso = function (catRef) {
    var catNom="";
    db.collection("lms-categorias").where("refCat", "==", catRef)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc2) {
            // doc.data() is never undefined for query doc snapshots
            catNom = doc2.data().nombreCat;
            console.log(doc2.id, " => ", catNom);

            // var imagenPortafolio = document.createElement('img');
            // imagenPortafolio.src = doc2.data().url;
            // imagenPortafolio.width = "400";
            // pad.appendChild(imagenPortafolio);
            //   var img = document.getElementById('myimg');
            //   img.src = url;
            return catNom;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
}

// Se inicia la funcion de recuperacion de los datos guardados, ejecutando la funcion getTask(), de manera asincrona, al momento de recargar la pagina
window.addEventListener('DOMContentLoaded', async (e) => {
    const lmsDocentes = await getTask();
    var categoriasDoc = [];

    lmsDocentes.forEach(doc => {
        var url = '';
        c=c+1;
        var docenteDatos = doc.data();
        console.log(doc.data());

        var catDoc = "";

        categoriasDoc[c-1]={cat:''};

        if (docenteDatos.refCatDoc) {
            // catDoc = categoriaCurso(docenteDatos.refCatDoc); // funcion que compare los datos de categoria y docente y retorne la categoria
            //Utilizar objetos o similar
            var catNom="";
            db.collection("lms-categorias").where("refCat", "==", docenteDatos.refCatDoc)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc2) {
                    // doc.data() is never undefined for query doc snapshots
                    catNom = doc2.data().nombreCat;
                    catDoc = doc2.data().nombreCat;

                    categoriasDoc[c-1].cat = doc2.data().nombreCat;

                    console.log(doc2.id, " => ", catNom);

                    // var imagenPortafolio = document.createElement('img');
                    // imagenPortafolio.src = doc2.data().url;
                    // imagenPortafolio.width = "400";
                    // pad.appendChild(imagenPortafolio);
                    //   var img = document.getElementById('myimg');
                    //   img.src = url;
                    // return catNom;
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        } else {
            catDoc = "No categoria";
        }


        var uno = document.getElementById('accordionExample');
        var newCard = document.createElement('div');
        // // newCard.type='file';
        // --newCard.id
        newCard.className='card';

        var cardHeader = document.createElement('div');
        cardHeader.id = 'docente-datos'+c;
        cardHeader.className = 'card-header';

        var titleH2 = document.createElement('div');
        titleH2.className = 'mb-0';

        var titleH2Text = document.createTextNode(docenteDatos.name);

        var buttonHeader = document.createElement('button');
        buttonHeader.className = 'btn btn-block text-left';
        buttonHeader.type = 'button';
        buttonHeader.toggleAttribute = 'collapse';
        buttonHeader.formTarget = '#collapseUno'+c;
        buttonHeader.appendChild(titleH2Text);

        var collapseCardBody = document.createElement('div');
        collapseCardBody.id = '#collapseUno'+c;
        collapseCardBody.className = 'collapse show';
        collapseCardBody.parentElement = '#accordionExample';

        var text2 = document.createTextNode(docenteDatos.summary);
        var docCat = document.createTextNode('Categoria');//categoriasDoc[c-1].cat
        console.log(categoriasDoc[1]);
        

        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        var eBr = document.createElement('br');
        cardBody.appendChild(docCat);
        cardBody.appendChild(eBr);
        cardBody.appendChild(text2);

        var downloadCVButtonText = document.createTextNode('Descargar CV');
        var downloadCVButton = document.createElement('button');
        downloadCVButton.className = 'btn btn-success';
        downloadCVButton.onclick = function () {
            downloadCV(docenteDatos.name, docenteDatos.ref);
        };
        // downloadCVButton.setAttribute("onClick", "downloadCV()");
        downloadCVButton.appendChild(downloadCVButtonText);

        var viewImagesButtonText = document.createTextNode('Ver portafolio');
        var viewImagesButton = document.createElement('button');
        viewImagesButton.className = 'btn btn-danger';
        viewImagesButton.setAttribute("data-toggle", "modal");
        viewImagesButton.setAttribute("data-target", "#exampleModal");
        viewImagesButton.onclick = function () {
            console.log('imagenes');
            portafolio(docenteDatos.name, docenteDatos.ref);
        }
        viewImagesButton.appendChild(viewImagesButtonText);

        cardBody.appendChild(downloadCVButton);
        cardBody.appendChild(viewImagesButton);

        collapseCardBody.appendChild(cardBody);

        titleH2.appendChild(buttonHeader);

        cardHeader.appendChild(titleH2);

        newCard.appendChild(cardHeader);
        newCard.appendChild(collapseCardBody);

        // var text1 = document.createTextNode(docenteDatos.name);
        // newCard.appendChild(text1);

        // newCard.appendChild('nombre de docente');
        // divPortafolio.innerHTML = '<input type="file" class="btn btn-danger">';
        uno.appendChild(newCard);
        // uno.innerHTML += '<div class="card"><div class="card-header" id="uno'+c+'"><h2 class="mb-0"><button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseUno'+c+'" aria-expanded="true" aria-controls="collapseUno'+c+'">'+doc.data().name+'</button></h2></div><div id="collapseUno'+c+'" class="collapse show" aria-labelledby="uno'+c+'" data-parent="#accordionExample"><div class="card-body">'+doc.data().summary+'</div></div></div>';
        
    })
    
    console.log(categoriasDoc);
    

})




