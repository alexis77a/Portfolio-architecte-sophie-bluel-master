const allWorks = new Set(); // set pour stocker les "works"
const allCats = new Set(); // set pour stocker les "categories"
const gallery = document.querySelector('.gallery'); // selectionne l'element HTML avec la class ".gallery"

async function init() {
    try {
        const works = await fetchData("works"); // récupere les données des "works"
        const categories = await fetchData('categories'); // récupere les données des "categories"

        // log dans la console
        console.log("Données de 'Works'", allWorks);
        console.log("Données de 'Categories'", allCats);

        // appel les fonction suivante
        displayWorks();
        displayFilter();
        handleLoginLogout();
        addPhotoFormContent();
    } catch (error) {
        // si ya une erreur un log est laisser
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// récupere les données "works" et "categories" dans l'API
async function fetchData(dataType) {
    try {
        // requète pour récuperer les données 
        const response = await fetch(`http://localhost:5678/api/${dataType}`);
        // vérifie si la réponse du serv est ok
        if (!response.ok) {
            throw new Error('Erreur du serveur');
        }
        // convertit les données en JSON
        const data = await response.json();

        // pour "works"
        if (dataType === 'works') {
            // ajoute les données à "allWorks"
            for (const work of data) {
                allWorks.add(work);
            }
            return data;
        }
        // pour "categories"
        else if (dataType === 'categories') {
            // ajoute les catégories à "allCats"
            for (const category of data) {
                allCats.add(category);
            }
            return data;
        }
    } catch (error) {
        // si ya une erreur un log est laisser
        console.error('Erreur de récupération des données:', error);
        return [];
    }
}

// fonction pour afficher les worksaa
function displayWorks() {
    // selectionne l'élément avec la class .gallery
    const gallery = document.querySelector('.gallery');

    // vérifie si .gallery est trouvé
    if (gallery) {
        const fragment = document.createDocumentFragment(); // crée un fragment de document
        // crée un élément HTML pour chaque work et l'ajoute la galerie
        for (const work of allWorks) {

            const figure = document.createElement('div'); // crée une div pour chaque "work"
            figure.classList.add('figure'); // ajoute la class "figure"
            figure.dataset.workId = work.id; // ajoute l'attribut "data-work-id" correspondant au work

            const image = document.createElement('img'); // crée une div img pour chaque "work"
            image.src = work.imageUrl; // ajoute l'attribut "src"
            image.alt = work.title; // ajoute l'attribut "alt"

            const caption = document.createElement('figcaption');
            caption.textContent = work.title;

            figure.appendChild(image);
            figure.appendChild(caption);

            fragment.appendChild(figure);

        }

        gallery.appendChild(fragment);

        console.log("Travaux affichés"); // laisse un log si les works ont été affiché
    } else {
        // si ya une erreur un log est laisser
        console.error("L'élément .gallery est introuvable dans le document.");
    }
}

// fonction pour afficher les filtres
function displayFilter() {
    // selectionne la div avec l'ID "filters-container"
    const filtersContainer = document.querySelector('#filters-container');

    if (filtersContainer) {
        const fragment = document.createDocumentFragment();

        const token = localStorage.getItem('token');
        if (!token) {
            // création de la catégorie "Tous"
            const allCategory = document.createElement('div');
            allCategory.classList.add('category');
            allCategory.textContent = 'Tous';
            fragment.appendChild(allCategory);
            // eventlistener pour afficher tout les works au clic sur "Tous"
            allCategory.addEventListener('click', () => {
                console.log("Catégorie : all");
                const filtered = filteredWorks('all');
                displayFilteredWorks(filtered);
                activateFilter(allCategory);
            });
            // création des filtres et du systeme de filtrage
            for (const category of allCats) {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category');
                categoryDiv.textContent = category.name;
                fragment.appendChild(categoryDiv);

                categoryDiv.addEventListener('click', () => {
                    activateFilter(categoryDiv); // active le filtre cliqué
                    const categoryId = category.id;
                    console.log("Catégorie :", categoryId);
                    const filtered = filteredWorks(categoryId);

                    displayFilteredWorks(filtered);
                });
            }

            filtersContainer.appendChild(fragment);
            console.log("Filtre affiché");

            // active le filtre "Tous" par défaut
            activateFilter(allCategory);

        } else {
            console.error("L'élément #filters-container est introuvable dans le document.");
        }
    }
}

// fonction pour activer un filtre
function activateFilter(filterElement) {
    // désactive tous les autres filtres
    const allFilters = document.querySelectorAll('.category');
    allFilters.forEach(filter => filter.classList.remove('active'));
    // active le filtre sélectionné
    filterElement.classList.add('active');
}

// fonction pour afficher les works filtrés
function displayFilteredWorks(filteredWorks) {
    const gallery = document.querySelector('.gallery');
    const currentWorks = gallery.querySelectorAll('.figure');

    // créer un tableau des IDs des œuvres actuellement affichées
    const currentWorkIds = Array.from(currentWorks).map(figure => figure.dataset.workId);

    // créer un tableau des IDs des œuvres filtrées
    const filteredWorkIds = filteredWorks.map(work => work.id);

    // ajoute de nouvelles œuvres à la galerie
    const newWorksIds = filteredWorkIds.filter(id => !currentWorkIds.includes(id));
    newWorksIds.forEach(id => {
        const work = filteredWorks.find(work => work.id === id);
        const figure = createFigureElement(work);
        gallery.appendChild(figure);
    });

    // supprime les œuvres qui ne correspondent plus au filtre
    currentWorks.forEach(figure => {
        if (!filteredWorkIds.includes(figure.dataset.workId)) {
            gallery.removeChild(figure);
        }
    });
}

// créer un élément figure HTML pour une œuvre donnée
function createFigureElement(work) {
    const figure = document.createElement('div');
    figure.classList.add('figure');
    figure.dataset.workId = work.id;

    const image = document.createElement('img');
    image.src = work.imageUrl;
    image.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(caption);

    return figure;
}
// fonction pour filtrer les works en fonction des categorie
function filteredWorks(categoryId) {
    const filteredWorks = [];

    if (categoryId === "all") {
        return Array.from(allWorks);
    }

    for (const work of allWorks) {
        if (work.categoryId === categoryId) {
            filteredWorks.push(work);
        }
    }

    return filteredWorks;
}

async function handleLogout() {
    // déconnecte l'utilisateur en supprimant le token du stockage local
    localStorage.removeItem('token');
    // redirige vers la page de connexion
    window.location.href = 'index.html';
}

async function handleLoginLogout() {
    const loginBtn = document.getElementById('loginBtn');
    const portfolioSectionTitle = document.querySelector('#portfolio h2');

    try {
        const token = localStorage.getItem('token');
        console.log('Token récupéré: ', token);
        if (token) {
            // l'utilisateur est connecté
            loginBtn.textContent = 'logout';

            // crée et ajoute un bouton "modifier"
            const editButton = document.createElement('button');
            editButton.textContent = 'modifier';
            editButton.innerHTML += '<i class="fa-regular fa-pen-to-square icon-edit"></i>';
            editButton.classList.add('edit-button');
            portfolioSectionTitle.appendChild(editButton);

            // gestionnaire d'événements pour le bouton "modifier"
            editButton.addEventListener('click', function () {
                const contentModal = "Contenu de la modale à afficher";
                const modalTitle = "Titre de la modale";
                showModal(contentModal, modalTitle);
                addOverlayDiv();
            });

            // gestionnaire d'événements pour le bouton "logout"
            loginBtn.addEventListener('click', handleLogout);
        } else {
            // l'utilisateur n'est pas connecté
            loginBtn.textContent = 'login';

            // gestionnaire d'événements pour le bouton "login"
            loginBtn.addEventListener('click', function () {
                window.location.href = 'login.html';
            });

        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la vérification du token :', error);
    }
}

function showModal() {
    // vérifie si la modal existe déjà
    let modal = document.querySelector('.modal');

    // si la modal existe, modifier son affichage
    if (modal) {
        modal.style.display = 'block';

        // vérifie si le contenu de la modal existe déjà
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            // si le contenu existe, sortir de la fonction
            return;
        }
    }

    // crée la modal si elle n'existe pas
    if (!modal) {
        modal = document.createElement('div');
        modal.classList.add('modal');
        modal.style.display = 'block';
    }

    // crée une div pour le contenu de la modale
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // ajoute le titre de la modale
    const titleElement = document.createElement('h2');
    titleElement.textContent = "Galerie photo";
    titleElement.classList.add('titleModal');
    modalContent.appendChild(titleElement);

    // crée une div pour regrouper tous les travaux
    const worksContainerModal = document.createElement('div');
    worksContainerModal.classList.add('worksContainerModal')

    // fonction pour afficher les travaux dans la modal
    allWorks.forEach(work => {
        const workElement = document.createElement('div');
        workElement.classList.add('work-itemModal');
        workElement.setAttribute('data-work-id', work.id);

        const image = document.createElement('img');
        image.classList.add('work-imageModal')
        image.src = work.imageUrl;
        image.alt = work.title;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash iconTrash"></i>';
        deleteButton.classList.add('delete-button');

        // ajoute un gestionnaire d'événements pour le bouton de suppression
        deleteButton.addEventListener('click', async () => {
            try {
                // envoie une requête DELETE à l'API avec l'ID du travail à supprimer
                await deleteWork(work.id);

                // si la suppression réussit, supprimez l'élément correspondant du DOM
                workElement.remove();
            } catch (error) {
                console.error('Une erreur est survenue lors de la suppression du travail :', error);
            }
        });

        workElement.appendChild(image);
        workElement.appendChild(deleteButton);
        worksContainerModal.appendChild(workElement);
    });

    // ajoute la div des works au contenu de la modal
    modalContent.appendChild(worksContainerModal);

    // crée un bouton "Ajouter une photo"
    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter une photo';
    addButton.classList.add('addwork-button');

    // ajoute un gestionnaire d'événements pour le bouton "Ajouter une photo"
    addButton.addEventListener('click', () => {
        console.log('Bouton "Ajouter photo" cliqué');
        showModalAdd(); // appel de la fonction showModalAdd() lors du clic sur le bouton
    });

    // ajoute le bouton "Ajouter une photo" a la modal
    modalContent.appendChild(addButton);

    // crée une icone pour la fermeture
    const closeBtn = document.createElement('i');
    closeBtn.classList.add('fa', 'fa-solid', 'fa-xmark', 'closeModal', 'cross-icon');

    // ajoute un gestionnaire d'événements pour fermer la modale lors du clic sur l'icone de fermeture
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    // ajoute le bouton de fermeture a la modal
    modalContent.appendChild(closeBtn);

    // ajoute le contenu à la modal
    modal.appendChild(modalContent);

    // ajoute la modale au corps du document
    document.body.appendChild(modal);

    // ferme la modale lors du clic en dehors de celle-ci
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    // récupère la div d'ombre de fond
    const overlayDiv = document.querySelector('.modal-overlay');
    // vérifie si la div d'ombre de fond existe
    if (overlayDiv) {
        // supprime la div d'ombre de fond du DOM
        overlayDiv.parentNode.removeChild(overlayDiv);
    }
    modal.style.display = 'none';
}

function closeAllModal() {
    // ferme la modal principale
    const mainModal = document.querySelector('.modal');
    if (mainModal && mainModal.parentNode) {
        mainModal.parentNode.removeChild(mainModal);
    }

    // ferme la modal d'ajout de photo
    const addModal = document.querySelector('.modaladdWorks');
    if (addModal && addModal.parentNode) {
        addModal.parentNode.removeChild(addModal);
    }

    // supprime la div d'ombre de fond
    const overlayDiv = document.querySelector('.modal-overlay');
    if (overlayDiv && overlayDiv.parentNode) {
        overlayDiv.parentNode.removeChild(overlayDiv);
    }
}
function closeModalAdd(modal) {
    modal.remove();
}

async function deleteWork(workId) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5678/api/works/${workId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du travail');
        }

        console.log('Travail supprimé avec succès');

        removeWorkFromGallery(workId);
    } catch (error) {
        console.error('Erreur lors de la suppression du travail:', error);
    }
}

init();
let imageInput;

// formulaire
function addPhotoFormContent() {
    const formContent = document.createElement('div');
    formContent.classList.add('form-content');

    // création d'une div pour le champ uploaderDiv
    const uploaderDiv = document.createElement('div');
    uploaderDiv.classList.add('input-uploader');

    // icon edit pour l'uploaderDiv
    const uploaderIcon = document.createElement('div');
    uploaderIcon.innerHTML = '<i class="fa-regular fa-image imageformIcon"></i>'
    uploaderIcon.classList.add('form-icon');
    uploaderDiv.appendChild(uploaderIcon);

    // élément pour afficher l'aperçu de l'image
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('preview-container');
    const previewImage = document.createElement('img');
    previewImage.classList.add('preview-image');
    previewContainer.appendChild(previewImage);

    // ajoute une croix pour supprimer l'aperçu
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-xmark', 'delete-icon-preview');
    deleteIcon.addEventListener('click', () => {
        // supprime l'aperçu de l'image
        previewImage.src = '';
        previewImage.style.display = 'none';
        previewContainer.style.display = 'none';
        customUploadButton.style.display = 'block';
        deleteIcon.style.display = 'none';
        imageInput.value = null;
    });
    previewContainer.appendChild(deleteIcon);
    uploaderDiv.appendChild(previewContainer);

    // bouton personnalisé pour uploader une image
    const customUploadButton = document.createElement('button');
    customUploadButton.textContent = '+ Ajouter photo';
    customUploadButton.classList.add('custom-upload-button');
    uploaderDiv.appendChild(customUploadButton);

    // champ pour uploader une image / a enregistrer dans une variable
    imageInput = document.createElement('input');
    imageInput.setAttribute('type', 'file');
    imageInput.setAttribute('id', 'imageWorks');
    imageInput.setAttribute('name', 'image');
    imageInput.setAttribute('accept', 'image/*');
    uploaderDiv.appendChild(imageInput);

    // ajoute un gestionnaire d'événements pour le bouton personnalisé
    customUploadButton.addEventListener('click', () => {
        imageInput.click(); // appel l'input de type "file" lorsque le bouton personnalisé est cliqué
    });

    // ajoute un gestionnaire d'événements pour détecter le changement de fichier sélectionné
    console.log("Image input avant d'ajouter l'événement 'change':", imageInput);
    imageInput.addEventListener('change', () => {
        console.log('Changement détecté dans la sélection de fichiers')
        const file = imageInput.files[0];
        // vérifie si un fichier a été sélectionné
        if (file) {
            const reader = new FileReader(); // crée un objet FileReader

            // gestionnaire d'événements pour le chargement du fichier
            reader.onload = function (event) {
                previewImage.src = event.target.result;
                previewImage.style.display = 'block';
                previewContainer.style.display = 'block';
                customUploadButton.style.display = 'none';
                deleteIcon.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    const additionalText = document.createElement('p');
    additionalText.textContent = 'jpg, png : 4mo max';
    additionalText.classList.add('infoaddImage');
    uploaderDiv.appendChild(additionalText);

    // ajout de la div imageFileDiv au contenu du formulaire
    formContent.appendChild(uploaderDiv);


    const fieldTitleDiv = document.createElement('div'); // création d'une div pour le champs "title"
    fieldTitleDiv.classList.add('input-wrapper');

    // titre pour le champ projectNameInput
    const projectNameTitle = document.createElement('div');
    projectNameTitle.textContent = "Titre";
    projectNameTitle.classList.add('form-title');
    fieldTitleDiv.appendChild(projectNameTitle);

    // champ pour nommer le projet
    const projectNameInput = document.createElement('input');
    projectNameInput.setAttribute('type', 'text');
    projectNameInput.setAttribute('id', 'nameWorks');
    projectNameInput.setAttribute('name', 'title');
    fieldTitleDiv.appendChild(projectNameInput);

    // ajout de la div projectNameDiv au contenu du formulaire
    formContent.appendChild(fieldTitleDiv);

    // création d'une div pour le titre et le champ categorySelect
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('input-wrapper');

    // titre pour le champ categorySelect
    const categoryTitle = document.createElement('div');
    categoryTitle.textContent = "Catégories";
    categoryTitle.classList.add('form-title'); // Ajout de la classe 'form-title'
    categoryDiv.appendChild(categoryTitle);

    // champ select pour choisir une catégorie
    const categorySelect = document.createElement('select');
    categorySelect.setAttribute('id', 'categoryId');
    categorySelect.setAttribute('name', 'category');
    
    // ajout d'une option vide avec une valeur nulle
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    categorySelect.appendChild(emptyOption);
    // ajoute des options pour chaque catégorie disponible
    allCats.forEach(category => {
        const option = document.createElement('option');
        option.setAttribute('value', category.id);
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    categoryDiv.appendChild(categorySelect);

    // ajout de la div categoryDiv au contenu du formulaire
    formContent.appendChild(categoryDiv);

    return { formContent, projectNameInput, categorySelect };
}
// fonction pour ajouter un travail
async function addWork(formData) {
    // vérification du token d'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token d\'authentification non trouvé.');
        return;
    }

    // vérification de l'image du travail
    const imageFile = formData.get('image') // changer les valeur par les bonne
    console.log('Image sélectionnée:', imageFile);
    if (!imageFile) {
        console.error('Aucune image sélectionnée.');
        return;
    }
    // vérification du titre du work
    const projectName = formData.get('title'); // changer les valeur par les bonne
    console.log('Titre du projet:', projectName);
    if (!projectName) {
        console.error('Titre de la photo manquant.');
        return;
    }
    // vérification de la catégorie du work
    const category = formData.get('category'); // changer les valeur par les bonne
    console.log('Catégorie du projet:', category);
    if (!category) {
        console.error('Catégorie de la photo manquante.');
        return;
    }
    const url = 'http://localhost:5678/api/works';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        const data = await response.json();
        console.log('Travail ajouté avec succès:', data);

        updateUIWithNewWork(data);

    } catch (error) {
        console.error(error);
        throw error;
    }
}

function updateUIWithNewWork(newWork) {
    const gallery = document.querySelector('.gallery'); // sélectionne l'élément contenant la galerie d'images

    if (gallery) {
        const figure = document.createElement('div'); // crée un élément div pour chaque "work"
        figure.classList.add('figure');

        const image = document.createElement('img'); // crée un élément img pour afficher l'image
        image.src = newWork.imageUrl; // ajoute l'URL de l'image
        image.alt = newWork.title; // ajoute le titre de l'image en tant qu'attribut alt

        const caption = document.createElement('figcaption'); // crée un élément figcaption pour afficher le titre du travail
        caption.textContent = newWork.title; // ajoute le titre du travail

        figure.appendChild(image); // ajoute l'image à la figure
        figure.appendChild(caption); // ajoute le titre à la figure

        gallery.appendChild(figure); // ajoute la figure à la galerie
    } else {
        console.error('Élément .gallery non trouvé.');
    }

    const worksContainerModal = document.querySelector('.worksContainerModal'); // sélectionne l'élément contenant les travaux dans la modalité d'ajout de photo
    if (worksContainerModal) {
        const workElement = document.createElement('div');
        workElement.classList.add('work-itemModal');
        workElement.setAttribute('data-work-id', newWork.id);

        const image = document.createElement('img');
        image.classList.add('work-imageModal')
        image.src = newWork.imageUrl;
        image.alt = newWork.title;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash iconTrash"></i>';
        deleteButton.classList.add('delete-button');

        workElement.appendChild(image);
        workElement.appendChild(deleteButton);
        worksContainerModal.appendChild(workElement);
    } else {
        console.error('Élément .worksContainerModal non trouvé.');
    }
}

function showModalAdd() {
    const modalAdd = document.createElement('div');
    modalAdd.classList.add('modal', 'modaladdWorks');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modaladd-content');

    // crée et ajoute un bouton pour soumettre le formulaire dans une div parente
    const formFooter = document.createElement('div');
    formFooter.classList.add('valid-form');

    let submitButton;

    if (imageInput) {
        console.log('imageInput est défini');
        submitButton = document.createElement('button');
        submitButton.textContent = 'Valider';
        submitButton.classList.add('submit-button');

        submitButton.addEventListener('click', async () => {
            // vérifie si le champ du titre de la photo est vide/peutetre en trop
            if (projectNameInput.value.trim() === '') {
                console.error('Le titre de la photo est manquant.');
                return;
            }
            // vérifie si le champ de la catégorie de la photo est vide/peutetre en trop
            if (categorySelect.value.trim() === '') {
                console.error('La catégorie de la photo est manquante.');
                return;
            }
            // vérifie si imageInput.files existe avant d'accéder à files[0]
            if (imageInput.files.length > 0) {
                const formData = new FormData();
                formData.append('image', imageInput.files[0]);
                formData.append('title', projectNameInput.value);
                formData.append('category', categorySelect.value);

                try {
                    await addWork(formData); // appel de la fonction addWork
                    closeModalAdd(modalAdd);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Erreur lors de l'ajout de la photo.");
            }
        });
    } else {
        console.error('imageInput n\'est pas défini.');
        // si imageInput n'est pas défini, crée quand même le bouton Valider
        submitButton = document.createElement('button');
        submitButton.textContent = 'Valider';
        submitButton.classList.add('submit-button');
    }

    // ajoute le titre de la modale
    const titleElement = document.createElement('h2');
    titleElement.textContent = "Ajouter photo";
    titleElement.classList.add('titleModalAdd');

    // ajoute la croix de fermeture
    const closeIcon = document.createElement('div');
    closeIcon.classList.add('closeIconModal')
    closeIcon.innerHTML = '<i class="fa-solid fa-xmark closeModaladd cross-icon"></i>';
    closeIcon.querySelector('.closeModaladd').addEventListener('click', (event) => {
        event.stopPropagation(); // empêche la propagation de l'événement aux éléments parents
        closeAllModal(); // appel la fonction closeModal
    });

    // ajoute la flèche de retour
    const returnArrow = document.createElement('div');
    returnArrow.classList.add('return-arrow');
    returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left arrowRetournModal"></i>';
    returnArrow.querySelector('.arrowRetournModal').addEventListener('click', () => {
        modalAdd.parentNode.removeChild(modalAdd); // masque la modale d'ajout de photo
    });

    // ajoute le contenu du formulaire dans une div parente
    const { formContent, projectNameInput, categorySelect } = addPhotoFormContent();

    modalContent.appendChild(titleElement);
    modalContent.appendChild(formContent);
    modalContent.appendChild(returnArrow);
    modalContent.appendChild(closeIcon);

    if (submitButton) {
        // ajoute le bouton de soumission au formFooter s'il est défini
        formFooter.appendChild(submitButton);
        modalContent.appendChild(formFooter);
    }

    // ajoute le modalContent à modalAdd
    modalAdd.appendChild(modalContent);

    // ajoute modalAdd au corps du document
    document.body.appendChild(modalAdd);

}


// fonction pour ajouter dynamiquement la div d'ombre de fond
function addOverlayDiv() {
    // crée la div d'ombre de fond
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('modal-overlay');

    // ajoute la div juste avant la balise de fermeture body
    document.body.appendChild(overlayDiv);
}

function removeWorkFromGallery(workId) {
    const figureToRemove = document.querySelector(`.gallery .figure[data-work-id="${workId}"]`);
    if (figureToRemove) {
        figureToRemove.remove(); // supprime l'élément de la galerie
    } else {
        console.error('Élément à supprimer non trouvé dans la galerie.');
    }
}