//
const db = firebase.firestore();

// Funcion getTask() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-docentes'
const getTask = () => db.collection('lms-docentes').get();

// Funcion getCat() que obtiene todos los datos de las categorias registradas en la coleccion 'lms-categorias' de Firebase
const getCat = () => db.collection('lms-categorias').get();

// Funcion getType() que obtiene todos los datos de los tipos registradas en la coleccion 'lms-tipos' de Firebase
const getType = () => db.collection('lms-tipos').get();

// Funcion getDoc() que obtiene todos los datos de los docentes registrados en la coleccion 'lms-docentes' de Firebase
const getDoc = (id) => db.collection('lms-docentes').doc(id).get();

//
var c = 0;

//
var c1 = 0;

//
var c2 = 0;

//
var c3 = 0;

//contador paginas
var countPages = 0;

//contador pagina actual
var currentPage = 0;

//items por pagina
var pageItems = 6;

var firstItem = 0;

var lastItem = 0;

//
var categoriaGlobal = document.getElementById('docenteCategoria').value;

//
var selectBoxType = document.getElementById('docenteTipo');

//
var tipoGlobal = selectBoxType.value;

//
var listaLmsDoc = '';

//
var docentesCards = [];

//
var userRol = '';

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');

//
var idListaUsuarios = document.getElementById('idListaUsuarios');
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');
var idRegistrarseBtn = document.getElementById('idRegistrarseBtn');
var idLogin = document.getElementById('idLogin');

//
const saveImage = (fileName, refid, url, type) => 
    db.collection('lms-archivos').doc().set({
        fileName,
        refid,
        url,
        type,
    }).then(function () {
        console.log('Datos guardados en la coleccion lms-archivos', refid);
        portafolio('nombre de docente', refid, true);
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

            if (editPortafolio) {
                //
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
                deleteImageBtn.className = 'btn deleteFileBtn';
                deleteImageBtn.textContent = 'Eliminar';
                deleteImageBtn.onclick = function () {
                    deleteImgPortafolio(doc1.id);
                }
                divColDeleteImageBtn.appendChild(deleteImageBtn);

                divRowEditImageBtn.appendChild(divColEditImageBtn);
                divRowEditImageBtn.appendChild(divColDeleteImageBtn);
            } else {
                
            }
            
            // divRowEditImageBtn.appendChild(editImageBtn);
            divColImagePortafolio.appendChild(divRowEditImageBtn);
            // divColImagePortafolio.appendChild(divRowEditImageBtn);
            pad.appendChild(divColImagePortafolio);
            //   var img = document.getElementById('myimg');
            //   img.src = url;

        });
        console.log(countImagesPortafolio);
        
        if (countImagesPortafolio < 6 && editPortafolio) {
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
            addImageBtn.accept = 'image/*';
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

//
async function filtroCategoria(catNom) {
    console.log(catNom);
    const lmsDocentes = await getTask();
    categoriaGlobal = catNom;
    if (catNom != 'todas') {
        if (tipoGlobal != 'todos') {
            db.collection("lms-docentes").where("category", "==", catNom).where("type", "==", tipoGlobal)
            .get()
            .then(function(querySnapshot) {
                // querySnapshot.forEach(function(doc2) {
                    
                // });
                listaDocentes(querySnapshot, 'allCategories');
    
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });                
        } else {
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
        }
    } else {
        if (tipoGlobal != 'todos') {
            db.collection("lms-docentes").where("type", "==", tipoGlobal)
            .get()
            .then(function(querySnapshot) {
                // querySnapshot.forEach(function(doc2) {
                    
                // });
                listaDocentes(querySnapshot, 'allCategories');
    
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });              
        } else {
            listaDocentes(lmsDocentes, 'allCategories');        
            
        }
    }
}

//
async function filtroTipo(typeName) {
    console.log(typeName);
    const lmsDocentes = await getTask();
    tipoGlobal = typeName; 
    if (typeName != 'todos') {
        if (categoriaGlobal != 'todas') {
            db.collection("lms-docentes").where("category", "==", categoriaGlobal).where("type", "==", tipoGlobal)
            .get()
            .then(function(querySnapshot) {
                // querySnapshot.forEach(function(doc2) {
                    
                // });
                listaDocentes(querySnapshot, 'allCategories');
    
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });   
        } else {
            db.collection("lms-docentes").where("type", "==", typeName)
            .get()
            .then(function(querySnapshot) {
                // querySnapshot.forEach(function(doc2) {
                    
                // });
                listaDocentes(querySnapshot, 'allCategories');

            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }
        
    } else {
        if (categoriaGlobal != 'todas') {
            db.collection("lms-docentes").where("category", "==", categoriaGlobal)
            .get()
            .then(function(querySnapshot) {
                // querySnapshot.forEach(function(doc2) {
                    
                // });
                listaDocentes(querySnapshot, 'allCategories');
    
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });              
        } else {
            listaDocentes(lmsDocentes, 'allCategories');
            
        }
    }   
}

//
selectBoxType.addEventListener('change', (e) => {
    filtroTipo(e.target.value);
    // console.log(e.target.value);
    
})

listaDocentes = async function (lmsDocentes, categories) {
    c1 = 0;
    const lmsCategorias = await getCat();
    const lmsTipos = await getType();
    // c2=0;
    var idListaD = document.getElementById('idListaD');
    var idListaDocentes = document.createElement('div');
    idListaDocentes.id = 'idListaDocentes';
    idListaDocentes.className = 'row';
    var idListaDocentes2 = document.getElementById('idListaDocentes');
    idListaD.replaceChild(idListaDocentes, idListaDocentes2);

    var categoriasDoc = [];
    var divListaDocentes = document.getElementById('idListaDocentes');

    docentesCards = [];

    lmsDocentes.forEach(docD => {
        c = c+1;
        var docenteDatos = docD.data();
        categoriasDoc[c-1]={cat:''};
        

        var divCol = document.createElement('div');
        divCol.className = 'col s12 m6 l4';
        var dicCard = document.createElement('div');
        dicCard.className = 'card';
        var divCardImage = document.createElement('div');
        divCardImage.className = 'card-image';
        divCardImage.id = 'divCardImageId_'+c1;
        var cardImage = document.createElement('img');
        cardImage.id = 'cardImageId_'+c1;
        db.collection("lms-archivos").where("refid", "==", docD.id).where("type", "==", "imagen")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc1) {
                urlImage = doc1.data().url;
            });
            cardImage.src = urlImage;
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

        var aBtnFloating = document.createElement('a');
        aBtnFloating.className = 'btn-floating activator halfway-fab waves-effect waves-light red';
        
        var optionsIcon = document.createElement('i');
        optionsIcon.className = 'material-icons right';
        var textOptionsIcon = document.createTextNode('more_vert');
        aBtnFloating.appendChild(optionsIcon);
        optionsIcon.appendChild(textOptionsIcon);
        divCardImage.appendChild(cardImage);
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
        // if (userRol!='Lector') {
        //     divCardImage.appendChild(aBtnFloating);
        // } else {
            
        // }

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
            // console.log("============="+docenteDatos.category);
            var categoryText = document.createTextNode(docenteDatos.category);
            
        } else {
            // console.log("============No hay categoria registrada");
            var categoryText = document.createTextNode('Sin categoria');
            
        }
        h6CategoryText.appendChild(categoryText);
        
        var typeTag = document.createElement('div');
        typeTag.className = 'chip';
        if (docenteDatos.type) {
            // console.log('+++=====++++++++'+docenteDatos.type);
            typeTag.textContent = docenteDatos.type;
        } else {
            typeTag.textContent = 'Sin tipo';
        }

        divCardContent.appendChild(spanCardTitle);
        divCardContent.appendChild(divCardSummary);
        divCardContent.appendChild(h6CategoryText);
        divCardContent.appendChild(typeTag);
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
                // console.log("Url => ", doc1.data().url, doc1.data().refid, doc1.data().type);

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
                type: e.target[5].value,
                // refCatDoc: e.target[0].value,
            });

            console.log(e);
            
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
        labelInputSummary.setAttribute('for', 'inputSumaryId_'+c1);
        var labelInputSummaryText = document.createTextNode('Resumen');
        labelInputSummary.appendChild(labelInputSummaryText);
        var inputSummary = document.createElement('textarea');
        inputSummary.className = 'materialize-textarea';
        inputSummary.id = 'inputSumaryId_'+c1;
        // inputSummary.rows = 4;
        // inputSummary.setAttribute('rows','4');
        inputSummary.value = docenteDatos.summary;
        divColInputSummary.appendChild(inputSummary);
        divColInputSummary.appendChild(labelInputSummary);

        // Elemento <select> de categoria
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
        // Final de elemento select

        

        // Elemento <select> de tipo
        var divColSelectType = document.createElement('div');
        divColSelectType.className = 'input-field divInputField col s12';
        var selectType = document.createElement('select');
        selectType.id = 'selectTypeId_'+c1;
        // opciones del select
        lmsTipos.forEach(docC => {
            var optionSelectType = document.createElement('option');
            optionSelectType.value = docC.data().nombreTipo;
            optionSelectType.textContent = docC.data().nombreTipo;
            selectType.appendChild(optionSelectType);
        })
        //
        selectType.value = docenteDatos.type;
        //
        var labelSelectType = document.createElement('label');
        labelSelectType.textContent = 'Tipo';

        divColSelectType.appendChild(selectType);
        divColSelectType.appendChild(labelSelectType);
        //Final de elemento <select>

        

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
        divRowEditForm.appendChild(divColSelectType);
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
        // divListaDocentes.appendChild(divCol);
        docentesCards[c1] = divCol;
        c1=c1+1;

    })
    currentPage = 1;//
    lastItem = pageItems * currentPage;

    firstItem = lastItem - pageItems;
    pagination(docentesCards, divListaDocentes);

    countPages = Math.ceil(docentesCards.length / pageItems);
    console.log(countPages);

    paginationNumbers(countPages, divListaDocentes);
    
}

pagination = function (docCards, divListaDoc) {
    var idList = document.getElementById('idListaD');
    var idListaDoc = document.getElementById('idListaDocentes');
    var divpageItem = document.createElement('div');
    divpageItem.className = 'row';
    divpageItem.id = 'idListaDocentes';
    console.log(firstItem,lastItem);

    for (let index = firstItem; index < lastItem; index++) {
        // const element = docentesCards[index];
        if (docCards[index]) {
            divpageItem.appendChild(docCards[index]);
            
        }
        
    }
    idList.replaceChild(divpageItem, idListaDoc);
    $(document).ready(function(){
        $('select').formSelect();
    });
}

//
paginationNumbers = function (countPages, divListaDocentes) {
    var paginationContainer = document.getElementById('paginationContainer');
    var leftArrow = document.getElementById('leftArrow');
    var rightArrow = document.getElementById('rightArrow');
    var paginationItem = document.getElementById('pagination');
    var newPaginationItem = document.createElement('div');
    newPaginationItem.className = 'pagination';
    newPaginationItem.id = 'pagination';
    paginationContainer.replaceChild(newPaginationItem, paginationItem);

    leftArrow.children[0].onclick = function (){
        console.log(currentPage, countPages);
        if (currentPage > 1) {
            window.scrollTo(0,0);
            // Se resta en 1 el contador de la pagina actual
            currentPage = currentPage - 1;
            lastItem = pageItems * currentPage;

            firstItem = lastItem - pageItems;
            pagination(docentesCards, divListaDocentes);
        } else {
            //Se desahabilita el boton de siguiente
            
        }
        
    }

    rightArrow.children[0].onclick = function () {
        if (currentPage < countPages) {
            window.scrollTo(0,0);
            // Se suma en 1 el contador de la pagina actual
            currentPage = currentPage + 1;
            lastItem = pageItems * currentPage;

            firstItem = lastItem - pageItems;
            pagination(docentesCards, divListaDocentes);
        } else {
            //Se desahabilita el boton de siguiente
        }

    }

    newPaginationItem.appendChild(leftArrow);

    for (let j = 1; j <= countPages; j++) {
        // const element = countPages;
        var liPage = document.createElement('li');
        liPage.onclick = function () {
            var btnPaginationNumbers = document.getElementsByClassName('btnNro');
            for (let k = 0; k < btnPaginationNumbers.length; k++) {
                btnPaginationNumbers[k].setAttribute('class', 'waves-effect btnNro');                
            }
            this.setAttribute('class', 'active btnNro');
            
        }
        liPage.className = 'waves-effect btnNro';        
        var aNumberPage = document.createElement('a');
        aNumberPage.href = '#!';
        aNumberPage.onclick = function () {
            window.scrollTo(0,0);
            currentPage = j;
            lastItem = pageItems * currentPage;

            firstItem = lastItem - pageItems;
            pagination(docentesCards, divListaDocentes);

        }
        aNumberPage.textContent = j;
        liPage.appendChild(aNumberPage);
        newPaginationItem.appendChild(liPage);     
    }
    newPaginationItem.appendChild(rightArrow);
}

// Funcion initApp() utilizada para verificar si un usuario esta autenticado
function initApp() {
    // var state;
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            document.getElementById('dropdown1Text').textContent = user.displayName;
            idDropdown.setAttribute('style', '');
            idLogin.setAttribute('style', 'display:none;');
            idRegistrarseBtn.setAttribute('style', 'display:none;');
            
            userRol = '';
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                });
                switch (userRol) {
                    case 'Lector':
                        idListaUsuarios.setAttribute('style', 'display:none;');
                        idRegistrarDocenteBtn.setAttribute('style', 'display:none;');
                    
                        break;

                    case 'Editor':
                        idListaUsuarios.setAttribute('style', 'display:none;');
                    
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
            document.getElementById('dropdown1Text').textContent = 'Usuario';
            idDropdown.setAttribute('style', 'display:none;');
            idLogin.setAttribute('style', '');
            idRegistrarseBtn.setAttribute('style', '');
            
            console.log('User is signed out');
            
            btnLogOut.setAttribute('style', 'display:none;');

            location.href = 'login.html';
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
    // return state;
}

window.addEventListener('DOMContentLoaded', async (e) => {
    initApp();

    // Se realiza la consulta a la coleccion 'lms-categorias' para luego llenar el elemento <select> con las categorias existentes en la coleccion 'lms-categorias', en el formulario de registro 
    var selectCategoryId = document.getElementById("docenteCategoria");
    const lmsCategorias = await getCat();
    lmsCategorias.forEach(docC => {
        // console.log(docC.data());
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
        // console.log(docT.data());
        var optionType = document.createElement('option');
        optionType.value = docT.data().nombreTipo;
        var optionTypeText = document.createTextNode(docT.data().nombreTipo);
        optionType.appendChild(optionTypeText);
        selectTypeId.appendChild(optionType);
    })

    $(document).ready(function(){
        $('select').formSelect();
    });

    const lmsDocentes = await getTask();
    listaLmsDoc = lmsDocentes;

    listaDocentes(lmsDocentes, 'allCategories');
})