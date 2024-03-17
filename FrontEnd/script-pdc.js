// fonction pour connecter l'utilisateur/recuperer les info du form/enregistrer le token LocalStockage
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

        // Log du token récupéré
        console.log("Token récupéré :", token);
        
        // Enregistrer le token dans le stockage local
        localStorage.setItem('token', token);

        // redirige vers la page d'accueil
        window.location.href = 'index.html';

        console.log("Connexion réussie");
        console.log("Utilisateur est un administrateur");
    } catch (error) {
        console.error(error.message);
        // vérifier le statut de la réponse en cas d'erreur réseau
        if (error instanceof TypeError || error instanceof FetchError) {
            alert('Erreur de réseau. Veuillez vérifier votre connexion Internet.');
        } else {
            alert('Identifiants ou mot de passe incorrects');
        }
    }
}

function FormListener() {
    // Sélectionnez le bouton de connexion
    const btnLogin = document.getElementById('btnLogin');

    // Ajoutez un écouteur d'événements pour le clic sur le bouton de connexion
    btnLogin.addEventListener('click', function(event) {
        // Empêchez le comportement par défaut du formulaire
        event.preventDefault();
        
        // Récupérez les valeurs des champs du formulaire
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Créez un objet avec les données d'identification de l'utilisateur
        const userData = {
            email: email,
            password: password
        };
        
        // appel la fonction loginUser avec les données d'identification de l'utilisateur
        loginUser(userData);
    });
}

// Appelez la fonction pour configurer l'écouteur du formulaire de connexion
FormListener();

