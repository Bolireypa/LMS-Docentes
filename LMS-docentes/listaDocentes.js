//
const db = firebase.firestore();

// Funcion getTask() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getTask = () => db.collection('lms-docentes').get();

//
const getCat = () => db.collection('lms-categorias').get();

//
const getDoc = (id) => db.collection('lms-docentes').doc(id).get();

//
// const onGetDoc = (callback) => db.collection('lms-docentes').onSnapshot(callback);

//
var c = 0;

//
var c1 = 0;

//
var c2 = 0;

//
var c3 = 0;

//
var categoriaGlobal = document.getElementById('docenteCategoria').value;

//
var listaLmsDoc = '';

//
const saveImage = (fileName, refid, url, type) => 
    db.collection('lms-archivos').doc().set({
        fileName,
        refid,
        url,
        type,
    }).then(function () {
        console.log('Datos guardados en la coleccion lms-archivos', refid);
        portafolio('nombre de docente', refid, false);
    });/* */

//
const deleteDoc = id => db.collection('lms-docentes').doc(id).delete().then(async function() {
        if (categoriaGlobal != "todas") {
            db.collection("lms-docentes").where("category", "==", categoriaGlobal)
            .get()
            .then(function(querySnapshot) {
                listaDocentes(querySnapshot, 'allCategories');
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        } else {
            const lmsDocentes = await getTask();
            listaDocentes(lmsDocentes, 'allCategories');        
        }
        console.log("Document successfully deleted!", categoriaGlobal);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

const deleteImgPortafolio = id => db.collection('lms-archivos').doc(id).delete().then(async function() {
    $('.modal').modal('close');

        if (categoriaGlobal != "todas") {
            db.collection("lms-docentes").where("category", "==", categoriaGlobal)
            .get()
            .then(function(querySnapshot) {
                listaDocentes(querySnapshot, 'allCategories');
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        } else {
            const lmsDocentes = await getTask();
            listaDocentes(lmsDocentes, 'allCategories');        
        }
        console.log("Image successfully deleted!", categoriaGlobal);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

//
const updateDoc = (id, updatedDoc) => db.collection('lms-docentes').doc(id).update(updatedDoc).then(async function() {
        console.log(categoriaGlobal);
        
        if (categoriaGlobal != "todas") {
            console.log('categoria '+categoriaGlobal);
            
            db.collection("lms-docentes").where("category", "==", categoriaGlobal)
            .get()
            .then(function(querySnapshot) {
                listaDocentes(querySnapshot, 'allCategories');
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        } else {
            console.log('todas las categorias');
            const lmsDocentes = await getTask();
            
            listaDocentes(lmsDocentes, 'allCategories');        
        }
        console.log("Document successfully updated!", categoriaGlobal);
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

const updateDocCV = (id, updatedDocCV) => db.collection('lms-archivos').doc(id).update(updatedDocCV).then(async function() {
        console.log(categoriaGlobal);
        $('.modal').modal('close');
        if (categoriaGlobal != "todas") {
            console.log('categoria '+categoriaGlobal);
            
            db.collection("lms-docentes").where("category", "==", categoriaGlobal)
            .get()
            .then(function(querySnapshot) {
                listaDocentes(querySnapshot, 'allCategories');
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        } else {
            console.log('todas las categorias');
            const lmsDocentes = await getTask();
            
            listaDocentes(lmsDocentes, 'allCategories');        
        }
        console.log("Document successfully updated!", categoriaGlobal);
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

//
// downloadCV = function (docName, docRef, downloadCVButton) {
    // console.log('Descargando CV de '+docName);
// }

//
portafolio = function (docName, docRef, editPortafolio) {
    console.log(docName+' '+docRef, editPortafolio);
    var idModalBody = document.getElementById('idModalBody');
    var idVerPortafolio = document.getElementById('verPortafolio');
    var pad = document.createElement('div');
    pad.className = 'row';
    pad.id = "verPortafolio";
    idModalBody.replaceChild(pad, idVerPortafolio);

    var countImagesPortafolio = 0;

    // idVerPortafolio.appendChild(pad);
    db.collection("lms-archivos").where("refid", "==", docRef).where("type", "==", "imagen")
    .get()
    .then(function(querySnapshot) {
        console.log(querySnapshot);
        
        querySnapshot.forEach(function(doc1) {
            countImagesPortafolio = countImagesPortafolio + 1;
            
            // doc.data() is never undefined for query doc snapshots
            // urlCV = doc1.data().url;
            console.log(doc1.id, " => ", doc1.data().url);
            var divColImagePortafolio = document.createElement('div');
            divColImagePortafolio.className = 'col s6 m4';
            var divRowEditImageBtn = document.createElement('div');
            divRowEditImageBtn.className = 'row'
            var divColEditImage = document.createElement('div');
            divColEditImage.className = 'col s12 portafolioImg';
            divRowEditImageBtn.appendChild(divColEditImage);

            var imagenPortafolio = document.createElement('img');
            imagenPortafolio.src = doc1.data().url;
            // imagenPortafolio.height = "200";
            
            divColEditImage.appendChild(imagenPortafolio);

            var divColEditImageBtn = document.createElement('div');
            divColEditImageBtn.className = 'col s6';
            var divInputField = document.createElement('div');
            divInputField.className = 'file-field input-field';
            var divEditButton = document.createElement('div');
            divEditButton.className = 'btn red';
            var spanEditBtn = document.createElement('span');
            spanEditBtn.textContent = 'Cambiar';
            var editImageBtn = document.createElement('input');
            editImageBtn.type = 'file';
            editImageBtn.className = 'changeFileBtn';
            // editImageBtn.className = 'btn';
            editImageBtn.onchange = function () {
                console.log(this.files[0]);
                var docFileCV = this.files[0];
                if (!docFileCV) {

                }else{
                    var storageDocRef = storage.ref('/portafolioDocente/'+docFileCV.name)
                    var uploadDoc = storageDocRef.put(docFileCV);
                    uploadDoc.on('state_changed', function (snapshot) {
                        
                    }, function (error) {
                        console.log(error);
            
                    }, function () {
                        console.log('Imagen cambiada');
                        uploadDoc.snapshot.ref.getDownloadURL().then(async function (url1) {
                            console.log(url1);
            
                            //
                            await updateDocCV(doc1.id, {
                                fileName: docFileCV.name,
                                url: url1,
                            });
                            
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

            var divColDeleteImageBtn = document.createElement('div');
            divColDeleteImageBtn.className = 'col s6';
            var deleteImageBtn = document.createElement('a');
            deleteImageBtn.className = 'btn';
            deleteImageBtn.textContent = 'Eliminar';
            deleteImageBtn.onclick = function () {
                deleteImgPortafolio(doc1.id);
            }
            divColDeleteImageBtn.appendChild(deleteImageBtn);

            divRowEditImageBtn.appendChild(divColEditImageBtn);
            divRowEditImageBtn.appendChild(divColDeleteImageBtn);
            
            // divRowEditImageBtn.appendChild(editImageBtn);
            divColImagePortafolio.appendChild(divRowEditImageBtn);
            // divColImagePortafolio.appendChild(divRowEditImageBtn);
            pad.appendChild(divColImagePortafolio);
            //   var img = document.getElementById('myimg');
            //   img.src = url;

        });
        console.log(countImagesPortafolio);
        
        if (countImagesPortafolio < 6) {
            var divColImagePortafolioEmpty = document.createElement('div');
            divColImagePortafolioEmpty.className = 'col s6 m4';
            var divRowAddImageBtn = document.createElement('div');
            divRowAddImageBtn.className = 'row'
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
            addImageBtn.onchange = function () {
                console.log(this.files[0]);
                console.log('--------------id del docente => '+docRef);
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
                            console.log(urlImage);
                            saveImage(imageFile.name, docRef, urlImage, 'imagen');
                        })
                    });
                }else{
                    
                }
            }

            divAddButton.appendChild(spanAddBtn);
            divAddButton.appendChild(addImageBtn);

            var addInputText = document.createElement('input');
            addInputText.type = 'text';
            addInputText.setAttribute('style', 'display:none;');
            addInputText.className = 'file-path validate';
            addInputText.placeholder = 'Selecciona una imagen';
            var divInputTextAdd = document.createElement('div');
            divInputTextAdd.className = 'file-path-wrapper';

            divInputTextAdd.appendChild(addInputText);

            divInputFieldAdd.appendChild(divAddButton);
            divInputFieldAdd.appendChild(divInputTextAdd);

            divColAddImageEmpty.appendChild(divInputFieldAdd);
            divRowAddImageBtn.appendChild(divColAddImageEmpty);
            divColImagePortafolioEmpty.appendChild(divRowAddImageBtn);
            pad.appendChild(divColImagePortafolioEmpty);

        } else {
            
        }
        
        // for (let index = 0; index < countImagesPortafolio; index++) {
            
        // }
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
    // var urlSrc = 'https://firebasestorage.googleapis.com/v0/b/lms-docentes.appspot.com/o/portafolioDocente%2Fportafolio3.png?alt=media&token=8e49c91d-3312-449f-9d09-a1c851e9184e';
    // console.log(urlSrc+' url');
    
    return urlSrc;
}

async function filtroCategoria(catNom) {
    console.log(catNom);
    const lmsDocentes = await getTask();
    categoriaGlobal = catNom;
    if (catNom != 'todas') {
        db.collection("lms-docentes").where("category", "==", catNom)
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

listaDocentes = async function (lmsDocentes, categories) {
    const lmsCategorias = await getCat();
    // c2=0;
    var idListaD = document.getElementById('idListaD');
    var idListaDocentes = document.createElement('div');
    idListaDocentes.id = 'idListaDocentes';
    idListaDocentes.className = 'row';
    var idListaDocentes2 = document.getElementById('idListaDocentes');
    idListaD.replaceChild(idListaDocentes, idListaDocentes2);

    var categoriasDoc = [];
    lmsDocentes.forEach(docD => {
        c = c+1;
        var docenteDatos = docD.data();
        console.log(docenteDatos);
        console.log(docD.id);
        categoriasDoc[c-1]={cat:''};
        

        var divListaDocentes = document.getElementById('idListaDocentes');
        var divCol = document.createElement('div');
        divCol.className = 'col s12 m4';
        var dicCard = document.createElement('div');
        dicCard.className = 'card';
        var divCardImage = document.createElement('div');
        divCardImage.className = 'card-image';
        // divCardImage.style = 'height: 180px;';
        divCardImage.id = 'divCardImageId_'+c1;
        var cardImage = document.createElement('img');
        cardImage.id = 'cardImageId_'+c1;
        // cardImage.className = 'cardImage';
        // cardImage.style = 'max-height: 100%; max-width: 100%; margin: auto;';
        cardImage.src = imagenPortafolioDocente(docD.id, c1);
        var aBtnFloating = document.createElement('a');
        aBtnFloating.className = 'btn-floating activator halfway-fab waves-effect waves-light red';
        aBtnFloating.onclick = async function () {
            // const doc = await getDoc(docD.id);
            // console.log(doc.data());
            // console.log(doc.id);
            // portafolio(docenteDatos.name, docenteDatos.ref);
        }
        var optionsIcon = document.createElement('i');
        optionsIcon.className = 'material-icons right';
        var textOptionsIcon = document.createTextNode('more_vert');
        aBtnFloating.appendChild(optionsIcon);
        optionsIcon.appendChild(textOptionsIcon);
        divCardImage.appendChild(cardImage);
        divCardImage.appendChild(aBtnFloating);
        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardContent.id = 'idCardContent_'+c1;//
        var spanCardTitle = document.createElement('span');
        spanCardTitle.className = 'card-title grey-text text-darken-4';
        var cardTitle = document.createTextNode(docenteDatos.name);
        
        spanCardTitle.appendChild(cardTitle);
        var divCardSummary = document.createElement('div');
        divCardSummary.className = 'cardSummary';
        var pCardContentText = document.createElement('p');
        var cardContentText = document.createTextNode(docenteDatos.summary);
        pCardContentText.appendChild(cardContentText);
        divCardSummary.appendChild(pCardContentText);
        var h6CategoryText = document.createElement('div');
        h6CategoryText.className = 'chip';
        h6CategoryText.id = 'h6Id_'+c1;//
        if (docenteDatos.category) {
            console.log("============="+docenteDatos.category);
            var categoryText = document.createTextNode(docenteDatos.category);
            
        } else {
            console.log("============No hay categoria registrada");
            var categoryText = document.createTextNode('Sin categoria');
            
        }
        h6CategoryText.appendChild(categoryText);
        divCardContent.appendChild(spanCardTitle);
        divCardContent.appendChild(divCardSummary);
        divCardContent.appendChild(h6CategoryText);
        var divCardAction = document.createElement('div');
        divCardAction.className = 'card-action';
        var divRowCA = document.createElement('div');
        divRowCA.className = 'row';
        var divColCA1 = document.createElement('div');
        divColCA1.className = 'col s6';
        var btnCV = document.createElement('a');
        btnCV.className = 'btn green';
        btnCV.style = 'width: 100%;';
        // btnCV.onclick = function () {
        //     downloadCV(docenteDatos.name, docenteDatos.ref, btnCV);
        // };

        db.collection("lms-archivos").where("refid", "==", docD.id).where("type", "==", "pdf")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc1) {
                // doc.data() is never undefined for query doc snapshots
                urlCV = doc1.data().url;
                console.log("Url => ", doc1.data().url, doc1.data().refid, doc1.data().type);

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

        var divRowOptionContent = document.createElement('div');
        divRowOptionContent.className = 'row';
        var divColOC1 = document.createElement('div');
        divColOC1.className = 'col s12';
        var divColOC2 = document.createElement('div');
        divColOC2.className = 'col s12';
        // colocar formulario
        var editForm = document.createElement('form');
        editForm.id = 'editFormId_'+c1;
        editForm.onsubmit = async function (e) {
            e.preventDefault();
            
            await updateDoc(docD.id, {
                // ref: e.target[0].value,
                name: e.target[0].value,
                email: e.target[1].value,
                summary: e.target[2].value,
                category: e.target[3].value,
                // refCatDoc: e.target[0].value,
            });

            console.log(e.target[0].value);
            
            // const editFormDoc = document.getElementById("editFormId_"+c1);
            const doc = await getDoc(docD.id);
            // console.log(editFormDoc['inputNameId_'+c1].value);
            console.log(doc.id);
            // // portafolio(docenteDatos.name, docenteDatos.ref);
        }

        var divRowEditForm = document.createElement('div');
        divRowEditForm.className = 'row';

        var divColInputName = document.createElement('div');
        divColInputName.className = 'input-field divInputField col s12';
        var labelInputName = document.createElement('label');
        labelInputName.className = 'active';
        labelInputName.setAttribute('for', 'inputNameId_'+c1);
        var labelInputNameText = document.createTextNode('Nombre');
        labelInputName.appendChild(labelInputNameText);
        var inputName = document.createElement('input');
        // inputName.className = 'inputField';
        inputName.type = 'text';
        inputName.id = 'inputNameId_'+c1;
        inputName.value = docenteDatos.name;
        divColInputName.appendChild(inputName);
        divColInputName.appendChild(labelInputName);

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

        var divColInputSummary = document.createElement('div');
        divColInputSummary.className = 'input-field divInputField col s12';
        var labelInputSummary = document.createElement('label');
        labelInputSummary.className = 'active';
        labelInputSummary.setAttribute('for', 'inputEmailId_'+c1);
        var labelInputSummaryText = document.createTextNode('Resumen');
        labelInputSummary.appendChild(labelInputSummaryText);
        var inputSummary = document.createElement('textarea');
        inputSummary.className = 'materialize-textarea';
        inputSummary.id = 'inputEmailId_'+c1;
        // inputSummary.rows = 4;
        // inputSummary.setAttribute('rows','4');
        inputSummary.value = docenteDatos.summary;
        divColInputSummary.appendChild(inputSummary);
        divColInputSummary.appendChild(labelInputSummary);

        var divColSelectCategory = document.createElement('div');
        divColSelectCategory.className = 'input-field divInputField col s12';
        var selectCategory = document.createElement('select');
        selectCategory.id = 'selectCategoryId_'+c1;
        // opciones del select
        lmsCategorias.forEach(docC => {
            // console.log(docC.data());
            var optionSelectCat = document.createElement('option');
            optionSelectCat.value = docC.data().nombreCat;
            optionSelectCat.textContent = docC.data().nombreCat;
            selectCategory.appendChild(optionSelectCat);
        })
        //
        selectCategory.value = docenteDatos.category;
        //
        var labelSelectCategory = document.createElement('label');
        labelSelectCategory.textContent = 'Categoria';

        divColSelectCategory.appendChild(selectCategory);
        divColSelectCategory.appendChild(labelSelectCategory);

        $(document).ready(function(){
            $('select').formSelect();
        });

        //Editar CV y Portafolio
        var divColEditDocument = document.createElement('div');
        divColEditDocument.className = 'col s12';
        var divRowEditDocuments = document.createElement('div');
        divRowEditDocuments.className = 'row';
        divColEditDocument.appendChild(divRowEditDocuments);
        var divColEditCV = document.createElement('div');
        divColEditCV.className = 'col s6';
        var editCVButton = document.createElement('a');
        // editCVButton.type = 'button';
        editCVButton.href = '#modal2';
        editCVButton.className = 'btn green editButton modal-trigger';
        editCVButton.textContent = 'Cambiar CV';
        editCVButton.onclick = function () {
            console.log('Cambiar CV', docD.id);
            document.getElementById('modal2Title').textContent = 'Documento CV de '+docenteDatos.name;

            var idModalBody2 = document.getElementById('idModalBody2');

            var oldModalbody2 = document.getElementById('editModal');

            var modalbody2 = document.createElement('div');
            modalbody2.id = 'editModal';

            idModalBody2.replaceChild(modalbody2, oldModalbody2);

            db.collection("lms-archivos").where("refid", "==", docD.id).where("type", "==", "pdf")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    // doc.data() is never undefined for query doc snapshots
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

                    var divCol2ModalBody2 = document.createElement('div');
                    divCol2ModalBody2.className = 'col s12';
                    var newH52Modal2 = document.createElement('h5');
                    newH52Modal2.textContent = 'Documento nuevo';
                    divCol2ModalBody2.appendChild(newH52Modal2);
                    var divRowNewCV = document.createElement('div');
                    divRowNewCV.className = 'row';
                    var divColNewCVBtn = document.createElement('div');
                    divColNewCVBtn.className = 'col s12';

                    var newCVInputFile = document.createElement('input');
                    newCVInputFile.type='file';
                    newCVInputFile.id='docenteNewCV_';
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

                    var saveCVBtn = document.createElement('button');
                    saveCVBtn.className = 'btn blue';
                    saveCVBtn.type = 'button';
                    saveCVBtn.textContent = 'Guardar'
                    saveCVBtn.onclick = function () {
                        console.log(doc1.id);
                        var docFileCV = newCVInputFile.files[0];
                        if (!docFileCV) {
        
                        }else{
                            var storageDocRef = storage.ref('/cvDocente/'+docFileCV.name)
                            var uploadDoc = storageDocRef.put(docFileCV);
                            uploadDoc.on('state_changed', function (snapshot) {
                                
                            }, function (error) {
                                console.log(error);
                    
                            }, function () {
                                console.log('Documento subido');
                                uploadDoc.snapshot.ref.getDownloadURL().then(async function (url1) {
                                    console.log(url1);
                    
                                    //
                                    await updateDocCV(doc1.id, {
                                        fileName: docFileCV.name,
                                        url: url1,
                                    });
                                    
                                })
                            });
                        }
                    }

                    divColNewCVBtn.appendChild(divInputCVFile);
                    divColNewCVBtn.appendChild(saveCVBtn);

                    divRowNewCV.appendChild(divColNewCVBtn);
                    divCol2ModalBody2.appendChild(divRowNewCV);

                    divRowModalBody2.appendChild(divCol1ModalBody2);
                    divRowModalBody2.appendChild(divCol2ModalBody2);
                    modalbody2.appendChild(divRowModalBody2);
                    urlCV = doc1.data().url;
                    console.log("Url => ", doc1.data().url, doc1.data().refid, doc1.data().type);

                    

                    
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            
        }
        divColEditCV.appendChild(editCVButton);
        var divColEditPortafolio = document.createElement('div');
        divColEditPortafolio.className = 'col s6';
        var editPortafolioButton = document.createElement('a');
        // editPortafolioButton.type = 'button';
        editPortafolioButton.href = '#modal1';
        editPortafolioButton.className = 'btn red editButton modal-trigger';
        editPortafolioButton.textContent = 'Editar Portafolio';
        editPortafolioButton.onclick = function () {
            console.log('Editar portafolio', docD.id);
            portafolio(docenteDatos.name, docD.id, true);
        }
        divColEditPortafolio.appendChild(editPortafolioButton);
        divRowEditDocuments.appendChild(divColEditCV);
        divRowEditDocuments.appendChild(divColEditPortafolio);
        

        divRowEditForm.appendChild(divColInputName);
        divRowEditForm.appendChild(divColInputEmail);
        divRowEditForm.appendChild(divColInputSummary);
        divRowEditForm.appendChild(divColSelectCategory);
        divRowEditForm.appendChild(divColEditDocument);

        

        var editButton = document.createElement('button');
        editButton.className = 'btn blue changeStateBtn';
        editButton.type = 'submit';
        var editButtonText = document.createTextNode('Guardar');

        editButton.appendChild(editButtonText);
        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn red changeStateBtn';
        deleteButton.onclick = async function () {
            //recargar docentes
            deleteDoc(docD.id);
            console.log(docD.id);
            // portafolio(docenteDatos.name, docenteDatos.ref);
        }
        var deleteButtonText = document.createTextNode('Eliminar');
        deleteButton.appendChild(deleteButtonText);

        editForm.appendChild(divRowEditForm);
        // editForm.appendChild(inputEmail);
        // editForm.appendChild(inputSummary);

        editForm.appendChild(editButton);

        divColOC1.appendChild(editForm);

        divColOC2.appendChild(deleteButton);

        divCardReveal.appendChild(divColOC1);
        divCardReveal.appendChild(divColOC2);

        dicCard.appendChild(divCardImage);
        dicCard.appendChild(divCardContent);
        dicCard.appendChild(divCardAction);
        dicCard.appendChild(divCardReveal);
        divCol.appendChild(dicCard);
        divListaDocentes.appendChild(divCol);

        
/*
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

                    var newh6 = document.createElement('div');
                    newh6.className = 'chip';
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
            });
            
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
            
        }/* */

        c1=c1+1;

    })
}

window.addEventListener('DOMContentLoaded', async (e) => {
    // onGetDoc((querySnapshot) => {
        var selectId = document.getElementById("docenteCategoria");
        const lmsCategorias = await getCat();
        lmsCategorias.forEach(docC => {
            console.log(docC.data());
            var optionCat = document.createElement('option');
            optionCat.value = docC.data().nombreCat;
            // optionCat.onclick = filtroCategoria(docC.data().refCat);
            var optionCatText = document.createTextNode(docC.data().nombreCat);
            optionCat.appendChild(optionCatText);
            selectId.appendChild(optionCat);
        })

        $(document).ready(function(){
            $('select').formSelect();
        });

        const lmsDocentes = await getTask();
        listaLmsDoc = lmsDocentes;

        listaDocentes(lmsDocentes, 'allCategories');
    // })
})