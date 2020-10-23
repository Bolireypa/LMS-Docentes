//
const db = firebase.firestore();

// Funcion getTask() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getTask = () => db.collection('lms-docentes').get();

//
const getCat = () => db.collection('lms-categorias').get();

//
var c = 0;

//
var c1 = 0;

//
var c2 = 0;

//
var c3 = 0;

//
// downloadCV = function (docName, docRef, downloadCVButton) {
    // console.log('Descargando CV de '+docName);
// }

//
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
            imagenPortafolio.height = "200";
            pad.appendChild(imagenPortafolio);
            //   var img = document.getElementById('myimg');
            //   img.src = url;

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

imagenPortafolioDocente = function (ref, c1) {
    var urlSrc = '';
    db.collection("lms-archivos").where("refid", "==", ref).where("type", "==", "imagen")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc1) {
            // doc.data() is never undefined for query doc snapshots
            // urlCV = doc1.data().url;
            // console.log(doc1.id, " => ", doc1.data().url);
            urlSrc = doc1.data().url;
            // var imagenPortafolio = document.createElement('img');
            // imagenPortafolio.src = doc1.data().url;
            // imagenPortafolio.height = "200";
            // pad.appendChild(imagenPortafolio);
            //   var img = document.getElementById('myimg');
            //   img.src = url;

        });

        var divImageCard = document.getElementById('divCardImageId_'+c1);
        var imageCard = document.getElementById('cardImageId_'+c1);

        var newImageCard = document.createElement('img');
        newImageCard.id = 'cardImageId_'+c1;
        newImageCard.src = urlSrc;

        divImageCard.replaceChild(newImageCard, imageCard);

        // console.log(urlSrc);
    // return urlSrc;
        
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    var urlSrc = 'https://firebasestorage.googleapis.com/v0/b/lms-docentes.appspot.com/o/portafolioDocente%2Fportafolio3.png?alt=media&token=8e49c91d-3312-449f-9d09-a1c851e9184e';
    // console.log(urlSrc+' url');
    
    return urlSrc;
}

async function filtroCategoria(catRef) {
    console.log(catRef);
    const lmsCategorias = await getCat();
    const lmsDocentes = await getTask();
    if (catRef != 'todas') {
        db.collection("lms-docentes").where("refCatDoc", "==", catRef)
        .get()
        .then(function(querySnapshot) {
            // querySnapshot.forEach(function(doc2) {
                
            // });
            listaDocentes(querySnapshot, 'allCategories');

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        // listaDocentes(lmsDocentes, 'allCategories');
    } else {
        listaDocentes(lmsDocentes, 'allCategories');        
    }
    
}

listaDocentes = function (lmsDocentes, category) {
    // c2=0;
    var idListaD = document.getElementById('idListaD');
    var idListaDocentes = document.createElement('div');
    idListaDocentes.id = 'idListaDocentes';
    idListaDocentes.className = 'row';
    var idListaDocentes2 = document.getElementById('idListaDocentes');
    idListaD.replaceChild(idListaDocentes, idListaDocentes2);

    var categoriasDoc = [];
    lmsDocentes.forEach(doc => {
        c = c+1;
        var docenteDatos = doc.data();
        console.log(docenteDatos);
        categoriasDoc[c-1]={cat:''};
        

        var divListaDocentes = document.getElementById('idListaDocentes');
        var divCol = document.createElement('div');
        divCol.className = 'col s12 m4';
        var dicCard = document.createElement('div');
        dicCard.className = 'card';
        var divCardImage = document.createElement('div');
        divCardImage.className = 'card-image';
        // divCardImage.style = 'height: 180px; width: 100%;';
        divCardImage.id = 'divCardImageId_'+c1;
        var cardImage = document.createElement('img');
        cardImage.id = 'cardImageId_'+c1;
        // cardImage.style = 'max-height: 100%; max-width: 100%; margin: auto;';
        cardImage.src = imagenPortafolioDocente(docenteDatos.ref, c1);
        divCardImage.appendChild(cardImage);
        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardContent.id = 'idCardContent_'+c1;//
        var spanCardTitle = document.createElement('span');
        spanCardTitle.className = 'card-title activator grey-text text-darken-4';
        var cardTitle = document.createTextNode(docenteDatos.name);
        var optionsIcon = document.createElement('i');
        optionsIcon.className = 'material-icons right';
        var textOptionsIcon = document.createTextNode('more_vert');
        optionsIcon.appendChild(textOptionsIcon);
        spanCardTitle.appendChild(cardTitle);
        spanCardTitle.appendChild(optionsIcon);
        var pCardContentText = document.createElement('p');
        var cardContentText = document.createTextNode(docenteDatos.summary);
        pCardContentText.appendChild(cardContentText);
        var h6CategoryText = document.createElement('h6');
        h6CategoryText.id = 'h6Id_'+c1;//
        var categoryText = document.createTextNode('Categoria');
        h6CategoryText.appendChild(categoryText);
        divCardContent.appendChild(spanCardTitle);
        divCardContent.appendChild(pCardContentText);
        divCardContent.appendChild(h6CategoryText);
        var divCardAction = document.createElement('div');
        divCardAction.className = 'card-action';
        var divRowCA = document.createElement('div');
        divRowCA.className = 'row';
        var divColCA1 = document.createElement('div');
        divColCA1.className = 'col s6';
        var btnCV = document.createElement('a');
        btnCV.className = 'btn red';
        btnCV.style = 'width: 100%;';
        // btnCV.onclick = function () {
        //     downloadCV(docenteDatos.name, docenteDatos.ref, btnCV);
        // };

        db.collection("lms-archivos").where("refid", "==", docenteDatos.ref).where("type", "==", "pdf")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc1) {
                // doc.data() is never undefined for query doc snapshots
                urlCV = doc1.data().url;
                console.log("Url => ", doc1.data().url);

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

        var divColCA2 = document.createElement('div');
        divColCA2.className = 'col s6';
        var btnPortafolio = document.createElement('a');
        btnPortafolio.className = 'btn green modal-trigger';
        btnPortafolio.href = '#modal1';
        btnPortafolio.style = 'width: 100%;';
        btnPortafolio.onclick = function () {
            console.log('imagenes');
            portafolio(docenteDatos.name, docenteDatos.ref);
        }
        var btnPortafolioText = document.createTextNode('Portafolio');
        // btnPortafolioText.appendChild(btnPortafolioText);
        btnPortafolio.appendChild(btnPortafolioText);
        divColCA2.appendChild(btnPortafolio)

        divRowCA.appendChild(divColCA1);
        divRowCA.appendChild(divColCA2);

        divCardAction.appendChild(divRowCA);

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

        dicCard.appendChild(divCardImage);
        dicCard.appendChild(divCardContent);
        dicCard.appendChild(divCardAction);
        dicCard.appendChild(divCardReveal);
        divCol.appendChild(dicCard);
        divListaDocentes.appendChild(divCol);

        

        if (docenteDatos.refCatDoc) {
            c3 = 1;
            console.log(docenteDatos.refCatDoc);
            
            // /*
            var catNom="";
            db.collection("lms-categorias").where("refCat", "==", docenteDatos.refCatDoc)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc2) {

                    catNom = doc2.data().nombreCat;
                    catDoc = doc2.data().nombreCat;

                    categoriasDoc[c-1].cat = doc2.data().nombreCat;

                    console.log(doc2.id, " => ", catNom);

                    var idCardContent = document.getElementById('idCardContent_'+c2);
                    var idh6 = document.getElementById('h6Id_'+c2);

                    var newh6 = document.createElement('h6');
                    newh6.id = 'h6Id_'+c2;
                    var newH6Text = document.createTextNode(catNom);
                    newh6.appendChild(newH6Text);

                    console.log(newh6, idh6, c2);
                    

                    idCardContent.replaceChild(newh6, idh6);

                    console.log(catNom, c2);
                    c2=c2+1;

                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });/* */
            
        } else {
            // c2=c2+1;
            c3 = 0;
            catDoc = "No categoria";
            console.log(catDoc);

            var idCardContent = document.getElementById('idCardContent_'+c2);
            var idh6 = document.getElementById('h6Id_'+c2);

            var newh6 = document.createElement('h6');
            newh6.id = 'h6Id_'+c2;
            var newH6Text = document.createTextNode(catDoc);
            newh6.appendChild(newH6Text);

            console.log(newh6, idh6, c2);
            

            idCardContent.replaceChild(newh6, idh6);

            console.log(catDoc, c2);
            c2=c2+1;
            
        }

        c1=c1+1;

    })
}

window.addEventListener('DOMContentLoaded', async (e) => {
    var selectId = document.getElementById("docenteCategoria");
    const lmsCategorias = await getCat();
    lmsCategorias.forEach(docC => {
        console.log(docC.data());
        var optionCat = document.createElement('option');
        optionCat.value = docC.data().refCat;
        // optionCat.onclick = filtroCategoria(docC.data().refCat);
        var optionCatText = document.createTextNode(docC.data().nombreCat);
        optionCat.appendChild(optionCatText);
        selectId.appendChild(optionCat);
    })

    $(document).ready(function(){
        $('select').formSelect();
    });

    const lmsDocentes = await getTask();

    listaDocentes(lmsDocentes, 'allCategories');
    
})