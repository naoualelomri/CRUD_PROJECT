// URL de base de l'API
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('client');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulaire soumis !');
        });
    } else {
        console.error("Formulaire non trouvé !");
    }
});
const apiUrl = 'http://localhost:3000';

// Fonction pour ajouter une catégorie
document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const nom = document.getElementById('nom').value;
    const description = document.getElementById('description').value;

    try {
        // Envoyer une requête POST à l'API
        const response = await fetch(`${apiUrl}/ctegories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom, description }),
        });

       
        if (response.ok) {
            alert('Catégorie ajoutée avec succès');
            
        } else {
            const errorData = await response.json();
            alert("erreur :" + errorData.error);
        }
    } catch (error) {
        console.error('Erreur :', error);
        alert("impossible de se connecter au serveur !")
    }
});
const apiUrl1 = 'http://localhost:3000/plantes'; // URL de ton backend

// Fonction pour récupérer les plantes
async function fetchPlants() {
    try {
        const response = await fetch(apiUrl1); // Appelle la route GET /plants
        const plantes = await response.json(); // Convertit la réponse en JSON

        // Sélectionne l'élément HTML où afficher les plantes
        const plantsContainer = document.getElementById('plantsContainer');

        // Efface le contenu actuel
        plantsContainer.innerHTML = '';

        // Parcourt chaque plante et crée un élément HTML
        plantes.forEach(plant => {
            const plantCard = document.createElement('div');
            plantCard.className = 'plant-card';

            plantCard.innerHTML = `
                <h3>${plant.nom}</h3>
                <img src="${plant.photo}" alt="${plant.nom}" style="width: 200px; height: 200px;">
                <p>Prix : ${plant.prix} €</p>
                <p>Quantité en stock : ${plant.quantité_en_stock}</p>
                <p>${plant.description}</p>
            `;

            plantsContainer.appendChild(plantCard);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des plantes :', error);
    }
}

// Appelle la fonction pour charger les plantes au chargement de la page
window.onload = fetchPlants;

// ajouter les clients a la base de donnees

 // URL de ton backend
 console.log("fichier est bien chargé !");

