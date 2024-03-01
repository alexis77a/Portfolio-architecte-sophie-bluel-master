const allWorks = new Set();
const allCats = new Set();
const gallery = document.querySelector('.gallery');

async function init(){
    const works = await fetchdata("works")
    for (const work of works) {
        allWorks.add(work)
    }
    displayWorks()
    displayFilter()
    /*if (isAdmin) {
        
    } else {

    }*/
    //fetchWorks();
    //fetchCategories();
}
init()

/*function isAdmin(){

}*/

async function fetchdata(type){
    const response = await fetch(`http://localhost:5678/api/${type}`)
    if (!response.ok) {
        throw new Error('Erreur du réseau');
    } else {
        return response.json()
    }
}

function displayWorks(filter = 0){
    let filteredWorks = allWorks
    if (filter != 0) {
        filteredWorks = [...allWorks].filter()
    }
    //create fragment + forof filtered + create figure/inner + gallery append fragment
}


function displayFilter(){
    //code
    setFilterListener()
}

function setFilterListener(){}

// fetch fait une requête GET à l'URL pour récupérer les travaux
async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        
        if (!response.ok) {
            throw new Error('Erreur du réseau');
        }
        
        allWorks = await response.json();


        console.log('Données des travaux récupérées', allWorks);

        filteredWorks(allWorks);
        
        console.log('Travaux récupérés', allWorks);
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux', error);
    }
}


// Fonction pour afficher les travaux filtré sur la page HTML
function filteredWorks(works) {
    
    gallery.innerHTML = '';

    const fragment = document.createDocumentFragment()
    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${work.imgUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>`

        fragment.appendChild(figure);
    });
    gallery.appendChild(fragment)
}


// Fonction pour filtrer les travaux en fonction de l'ID de la catégorie
function filterWorks(categoryId) {
    let filteredResults = [];

    if (categoryId === "all") {
        filteredResults = allWorks; 
    } else {
        filteredResults = allWorks.filter(work => work.categoryId === categoryId); // Filtrer les travaux par catégorie
    }

    filteredWorks(filteredResults);
}



// fonction async/recuperation des travaux
async function FetchFilterWorks(categoryId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works?categoryId=${categoryId}`);
        
        if (!response.ok) {
            throw new Error('Erreur du réseau');
        }
        
        const works = await response.json();
        
        console.log('Travaux filtrés', works);
    } catch (error) {
        console.error('Erreur de récupération des travaux filtrés', error);
    }
}


// fetch fait une requête GET à l'URL pour récupérer les catégories
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        
        if (!response.ok) {
            throw new Error('Erreur du réseau');
        }
        
        const categories = await response.json();
        
        const filtersContainer = document.getElementById('filters-container');
        const allButton = document.createElement('button');
        allButton.textContent = "Tous";
        allButton.classList.add("category");
        allButton.addEventListener('click', () => filterWorks("all"));
        filtersContainer.appendChild(allButton);
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.dataset.id = category.id;
            button.classList.add("category");
            button.addEventListener('click', () => filterWorks(category.id));
            filtersContainer.appendChild(button);
        });
        
        console.log('Catégories récupérées');
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
    }
}



