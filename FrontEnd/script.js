const allWorks = new Set(); // set pour stocker les "works"
const allCats = new Set(); // set pour stocker les "categories"
const gallery = document.querySelector('.gallery'); // selectionne l'element HTML avec la class ".gallery"

// j'ajoute 2 fois works/categories dans leur Set

async function init() {
    try {
        const works = await fetchData("works"); // récupere les données des "works"
        const categories = await fetchData('categories'); // récupere les données des "categories"
        
        // log dans la console
        console.log("Données de 'Works'", allWorks);
        console.log("Données de 'Categories'", allCats);
        // affiche les works, les filtres et la page de connexion
        displayWorks();
        displayFilter();
        handleLoginLogout();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// récupere les données "works" et "categories" dans l'API
async function fetchData(dataType) {
    try {
        // requete pour récupere les données 
        const response = await fetch(`http://localhost:5678/api/${dataType}`);
        if (!response.ok) {
            throw new Error('Erreur du serveur');
        }
        // convertit les données en JSON
        const data = await response.json();
        if (dataType === 'works') {
            // ajoute les données à "allWorks"
            for (const work of data) {
                allWorks.add(work);
            }
            return data;
        } else if (dataType === 'categories') {
            // ajoute les catégories à "allCats"
            for (const category of data) {
                allCats.add(category);
            }
            return data;
        }
    } catch (error) {
        console.error('Erreur de récupération des données:', error);
        return [];
    }
}

// fonction pour afficher les works
function displayWorks() {
    // selectionne l'élément avec la class .gallery
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const fragment = document.createDocumentFragment();
        // crée un élément HTML pour chaque work et l'ajoute la galerie
        for (const work of allWorks) {
            const figure = document.createElement('div');
            figure.classList.add('figure');
    
            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.alt = work.title;
    
            const caption = document.createElement('figcaption');
            caption.textContent = work.title;
    
            figure.appendChild(image);
            figure.appendChild(caption);
    
            fragment.appendChild(figure);
    
        }
    
        gallery.appendChild(fragment);
        console.log("Travaux affichés");
    } else {
        console.error("L'élément .gallery est introuvable dans le document.");
    }
}

// fonction pour afficher les filtres
function displayFilter() {
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


init();

// fonction pour vérifier si l'utilisateur est connecté et gérer la connexion/déconnexion
function handleLoginLogout() {
    // sélectionne le bouton de connexion/déconnexion
    const loginBtn = document.getElementById('loginBtn');
    const portfolioSectionTitle = document.querySelector('#portfolio h2'); // Sélectionne le titre h2 de la section portfolio

    // vérifie le token dans le stockage local
    const token = localStorage.getItem('token');
    if (token) {
        // log de vérification
        console.log('Token trouvé dans le local stockage :', token);
        // l'utilisateur est connecté, changer le texte du bouton en "logout"
        loginBtn.textContent = 'logout';

        // Créer et ajoute un bouton "modifier"
        const editButton = document.createElement('button');
        editButton.textContent = 'Modifier';
        editButton.classList.add('edit-button');
        portfolioSectionTitle.appendChild(editButton);

        // gestionnaire d'événements pour le bouton "modifier"
        editButton.addEventListener('click', function() {
            const contentModal = "Contenu de la modale à afficher";
            const modalTitle = "Titre de la modale";

            // affiche la modale
            showModal(contentModal, modalTitle);
        });

        // gestionnaire d'événements pour le bouton "logout"
        loginBtn.addEventListener('click', function() {
            // déconnecte l'utilisateur en supprimant le token du stockage local
            localStorage.removeItem('token');
            // redirige vers la page de connexion
            window.location.href = 'login.html';
        });
    } else {
        // l'utilisateur n'est pas connecté, le texte du bouton est "login"
        loginBtn.textContent = 'login';

        // gestionnaire d'événements pour le bouton "login"
        loginBtn.addEventListener('click', function() {
            // redirige vers la page de connexion
            window.location.href = 'login.html';
        });
    }
}

function showModal() {
    // ajout d'une class pour l'ombre de fond derriere la modal
    document.body.classList.add('modal-shadow');

    // crée une div pour la modale
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'block';

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

    // fonction pour supprimer les travaux de la modal
    allWorks.forEach(work => {
        const workElement = document.createElement('div');
        workElement.classList.add('work-itemModal');

        const image = document.createElement('img');
        image.classList.add('work-imageModal')
        image.src = work.imageUrl;
        image.alt = work.title;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash iconeTrash"></i>';
        deleteButton.classList.add('delete-button');

        workElement.appendChild(image);
        workElement.appendChild(deleteButton);
        worksContainerModal.appendChild(workElement);

        // ajoute un gestionnaire d'événements pour le bouton de suppression
        deleteButton.addEventListener('click', async () => {
            // récupere l'ID du work à supprimer
            const workId = work.id;
            
            // appele la fonction pour supprimer le work
            await deleteWork(workId);
            
            // actualise la liste des works dans la modal après la suppression
            refreshModalWorks();
        });
    });

    // ajoute la div des works au contenu de la modal
    modalContent.appendChild(worksContainerModal);

    // crée un bouton "Ajouter une photo"
    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter une photo';
    addButton.classList.add('addwork-button');

    // ajoute un gestionnaire d'événements pour le bouton "Ajouter une photo"
    addButton.addEventListener('click', () => {
        console.log('Bouton "Ajouter une photo" cliqué');
        showModalAdd(); // appel de la fonction showModalAdd() lors du clic sur le bouton
    });

    // ajoute le bouton "Ajouter une photo" a la modal
    modalContent.appendChild(addButton);

    // crée une icone pour la fermeture
    const closeBtn = document.createElement('i');
    closeBtn.classList.add('fa', 'fa-solid', 'fa-xmark', 'close-modal');

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
    document.body.classList.remove('modal-shadow');
    // supprimer la modale du DOM
    modal.parentNode.removeChild(modal);
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
    } catch (error) {
        console.error('Erreur lors de la suppression du travail:', error);
    }
}

// fonction pour rafraîchir la liste des travaux dans la modale après la suppression
function refreshModalWorks() {
    // supprime tous les travaux actuellement affichés dans la modale
    const worksContainerModal = document.querySelector('.worksContainerModal');
    worksContainerModal.innerHTML = '';

    // recharge les travaux depuis la source de données (allWorks) et les ajouter à nouveau à la modale
    allWorks.forEach(work => {
        const workElement = document.createElement('div');
        workElement.classList.add('work-itemModal');

        const image = document.createElement('img');
        image.classList.add('work-imageModal')
        image.src = work.imageUrl;
        image.alt = work.title;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash iconeTrash"></i>';
        deleteButton.classList.add('delete-button');

        workElement.appendChild(image);
        workElement.appendChild(deleteButton);
        worksContainerModal.appendChild(workElement);

        // ajoute un gestionnaire d'événements pour le bouton de suppression
        deleteButton.addEventListener('click', async () => {
            await deleteWork(work.id); // appel la fonction deleteWork
            refreshModalWorks(); // appel la fonction refreshModalWorks
        });
    });
}

// fonction pour ajouter un travail
async function addWork(workData) {
    const token = localStorage.getItem('token');
    const url = 'http://localhost:5678/api/works';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workData)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du travail');
        }

        console.log('Travail ajouté avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du travail:', error);
    }
}

// formulaire pour ajouter une photo
function addPhotoFormContent() {
    const formContent = document.createElement('div');
    formContent.classList.add('form-content');

    // champ pour uploader une image
    const imageInput = document.createElement('input');
    imageInput.setAttribute('type', 'file');
    imageInput.setAttribute('id', 'imageFile');
    imageInput.setAttribute('name', 'imageFile');
    imageInput.setAttribute('accept', 'image/*');
    formContent.appendChild(imageInput);

    // création d'une div pour le titre et le champ projectNameInput
    const projectNameDiv = document.createElement('div');
    projectNameDiv.classList.add('input-wrapper');

    // titre pour le champ projectNameInput
    const projectNameTitle = document.createElement('div');
    projectNameTitle.textContent = "Titre";
    projectNameTitle.classList.add('form-title');
    projectNameDiv.appendChild(projectNameTitle);

    // champ pour nommer le projet
    const projectNameInput = document.createElement('input');
    projectNameInput.setAttribute('type', 'text');
    projectNameInput.setAttribute('id', 'projectName');
    projectNameInput.setAttribute('name', 'projectName');
    projectNameDiv.appendChild(projectNameInput);

    // ajout de la div projectNameDiv au contenu du formulaire
    formContent.appendChild(projectNameDiv);

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
    categorySelect.setAttribute('id', 'category');
    categorySelect.setAttribute('name', 'category');
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

    return formContent;
}

// affiche la modale d'ajout de photo avec le formulaire
function showModalAdd() {
    const modalAdd = document.createElement('div');
    modalAdd.classList.add('modaladdWorks');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modaladd-content');

    // ajoute la flèche de retour
    const returnArrow = document.createElement('div');
    returnArrow.classList.add('return-arrow');
    returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left arrowRetournModal"></i>';
    returnArrow.addEventListener('click', () => {
        // masque la modale d'ajout de photo
        modalAdd.style.display = 'none';
        // affiche à nouveau la modale principale
        modal.style.display = 'block';
    });
    modalContent.appendChild(returnArrow);

    // ajoute le titre de la modale
    const titleElement = document.createElement('h2');
    titleElement.textContent = "Ajouter une photo";
    titleElement.classList.add('titleModalAdd');
    modalContent.appendChild(titleElement);

    // ajoute le contenu du formulaire dans une div parente
    const formContent = addPhotoFormContent();
    modalContent.appendChild(formContent);

    // crée et ajoute un bouton pour soumettre le formulaire dans une div parente
    const formFooter = document.createElement('div');
    formFooter.classList.add('valid-form');
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Valider';
    submitButton.classList.add('submit-button');
    submitButton.addEventListener('click', () => {
        // récupère les valeurs du formulaire et soumet les données
        const imageData = new FormData();
        imageData.append('imageFile', imageInput.files[0]);
        imageData.append('projectName', projectNameInput.value);
        imageData.append('category', categorySelect.value);
        // appel de la fonction pour ajouter une photo avec les données du formulaire
        addPhoto(imageData);
        // ferme la modale après l'ajout de la photo
        closeModal(modalAdd);
    });
    formFooter.appendChild(submitButton);
    modalContent.appendChild(formFooter);

    // ajoute le contenu de la modale au div modalAdd
    modalAdd.appendChild(modalContent);

    // ajoute le div modalAdd au corps du document
    document.body.appendChild(modalAdd);
}

