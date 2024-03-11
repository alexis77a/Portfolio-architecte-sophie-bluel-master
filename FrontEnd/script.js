const allWorks = new Set(); // set pour stocker les "works"
const allCats = new Set(); // set pour stocker les "categories"
const gallery = document.querySelector('.gallery'); // selectionne l'element HTML avec la class ".gallery"

// j'ajoute 2 fois works/categories dans leur Set

async function init() {
    try {
        const works = await fetchData("works"); // récupere les données des "works"
        const categories = await fetchData('categories'); //récupere les données des "categories"
        // ajoute les "works" a allWorks
        for (const work of works) {
            allWorks.add(work);
        }
        // ajoute les "categories" a allCats
        for (const category of categories) {
            allCats.add(category);
        }
        // log dans la console
        console.log("Données de 'Works'", allWorks);
        console.log("Données de 'Categories'", allCats);
        // affiche les works, les filtres et la page de connexion
        displayWorks();
        displayFilter();
        displayLoginPage();
        
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
            const categoryId = category.id;
            console.log("Catégorie :", categoryId);
            const filtered = filteredWorks(categoryId);
            
            displayFilteredWorks(filtered);
        });
    }

    filtersContainer.appendChild(fragment);
        console.log("Filtre affiché");
    } else {
        console.error("L'élément #filters-container est introuvable dans le document.");
    }
}

// fonction pour afficher les works filtrés
function displayFilteredWorks(filteredWorks) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (const work of filteredWorks) {
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

// fonction pour rendre l'élément "login" cliquable
function displayLoginPage() {
    var liElements = document.querySelectorAll('li');

    // parcourt les éléments <li> pour trouver celui contenant le texte "login"
    liElements.forEach(function(liElement) {
        if (liElement.textContent.trim() === 'login') {

            liElement.addEventListener('click', function() {
                // efface le contenu de la section <main>
                var mainSection = document.querySelector('main');
                mainSection.innerHTML = "";

                console.log("Clic sur 'login'");
                // redirige l'utilisateur vers une page de connexion
                window.location.href = 'page-de-connexion.html';
            });
        }
    });
}

displayLoginPage();

// fonction pour connecter l'utilisateur
async function loginUser(userData) {
    try {
        // requete POST vers l'API
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        // analyser la réponse pour obtenir le token
        const data = await response.json();
        const token = data.token;

        // redirige vers la page d'accueil
        window.location.href = 'index.html';

        console.log("Connexion réussie");
    } catch (error) {
        console.error(error.message);
        alert('Identifiants ou mot de passe incorrects');
    }
}
