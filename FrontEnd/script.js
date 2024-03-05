const allWorks = new Set();
const allCats = new Set();
const gallery = document.querySelector('.gallery');

async function init() {
    try {
        const works = await fetchData("works");
        const categories = await fetchData('categories');
        
        for (const work of works) {
            allWorks.add(work);
        }

        for (const category of categories) {
            allCats.add(category);
        }

        console.log("Données de 'Works'", allWorks);
        console.log("Données de 'Categories'", allCats);

        displayWorks();
        displayFilter();
        displayLoginPage();
        
        // Vous pouvez appeler filteredWorks ici si nécessaire
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// récupere les données "works" et "categories"
async function fetchData(dataType) {
    try {
        const response = await fetch(`http://localhost:5678/api/${dataType}`);
        if (!response.ok) {
            throw new Error('Erreur du serveur');
        }
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

function displayWorks() {
    const gallery = document.querySelector('.gallery');
    const fragment = document.createDocumentFragment();
    // cherche "work" dans "allWorks"
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
    console.log("Travaux affichés")
}

function displayFilter() {
    const filtersContainer = document.querySelector('#filters-container');
    const fragment = document.createDocumentFragment();

    // création de la catégorie "Tous"
    const allCategory = document.createElement('div');
    allCategory.classList.add('category');
    allCategory.textContent = 'Tous';
    fragment.appendChild(allCategory);

    allCategory.addEventListener('click', () => {
        console.log("Catégorie : all"); 
        const filtered = filteredWorks('all');
        displayFilteredWorks(filtered);
    });
    // cherche les "catégory" dans "allCats"
        for (const category of allCats) {
        // créer un élément div pour chaque catégorie
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.textContent = category.name; // récupere le nom des catégories
        fragment.appendChild(categoryDiv);

        categoryDiv.addEventListener('click', () => {
            const categoryId = category.id;
            console.log("Catégorie :", categoryId);
            const filtered = filteredWorks(categoryId);
            
            displayFilteredWorks(filtered);
        });
    }

    filtersContainer.appendChild(fragment);
    console.log("Filtre affiché")
}
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

    // oarcourt les éléments <li> pour trouver celui contenant le texte "login"
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


const loginForm = document.querySelector('.loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const userData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Erreur réseaux');
        }

        // redirige vers la page d'accueil
        window.location.href = 'index.html';

        console.log("Connexion réussie")
    } catch (error) {
        console.error(error.message);
        alert('Identifiants ou mot de passe incorrects');
    }
});
