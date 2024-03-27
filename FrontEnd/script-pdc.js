// FINI 100% 
async function loginUser(userData) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            // si le statut de la réponse n'est pas OK, la fonction showError est appelé
            showError('Email/mot de passe incorrect');
            return; // arrête l'exécution de la fonction ici pour éviter de rediriger l'utilisateur
        }

        const data = await response.json();
        const token = data.token;

        localStorage.setItem('token', token);

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Une erreur est survenue lors de la connexion');
    }
}

function showError(message) {
    console.log(message); // log pour vérifier si la fonction est appelée

    // div pour le message d'erreur
    const errorMessage = document.createElement('div');   
    errorMessage.textContent = message;
    errorMessage.classList.add('error-message'); // Ajout de la classe 'error-message'

    // icone pour la croix
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-solid', 'fa-xmark', 'xmark-icon');

    // gestionnaire d'événements pour l'icône 
    closeIcon.addEventListener('click', function() {
        errorMessage.remove(); // ferme le message d'erreur
        resetErrorState();
    });

    // ajoute l'icône au message d'erreur
    errorMessage.appendChild(closeIcon);

    // ajoute le message d'erreur à la div parent
    const formError = document.querySelector('.loginError');
    if (!formError) {
        console.error("Error: element loginError introuvable"); // log si la div parent n'est pas trouvé
        return;
    }

    // retire la règle display: none de la classe error-message
    errorMessage.style.display = 'block';

    // ajoute une classe spécifique l'erreur
    formError.classList.add('error-state');

    formError.appendChild(errorMessage);
}

// fonction pour réinitialiser l'état d'erreur
function resetErrorState() {
    const formError = document.querySelector('.loginError');
    if (formError) {
        formError.classList.remove('error-state');
    }
}

function FormListener() {
    // sélectionne le bouton de connexion
    const btnLogin = document.getElementById('btnLogin');

    // écouteur d'événements pour le clic sur le bouton de connexion
    btnLogin.addEventListener('click', function(event) {
        // empêche le comportement par défaut du formulaire
        event.preventDefault();
        
        // récupére les valeurs des champs du formulaire
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // crée un objet avec les données d'identification de l'utilisateur
        const userData = {
            email: email,
            password: password
        };
        
        // appel la fonction loginUser
        loginUser(userData);
    });
}

FormListener();
