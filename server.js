const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send('API de gestion des plantes opérationnelle');
});
const PORT = 3000;
app.listen(PORT, '127.0.0.1' ,() => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
//lire toutes les plantes 
app.get('/plantes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM plantes');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des plantes');
    }
});
// lire une plante par son id
app.get('/plantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM plantes WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Plante non trouvée');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de la plante');
    }
});
//ajouter une plante
app.post('/plantes', async (req, res) => {
    const { nom ,  prix , quantité_en_stock,  photo , catégorie_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO plantes (nom,  prix, quantité_en_stock,  photo , catégorie_id) VALUES (?, ?, ?, ?, ?)',
            [nom,  prix, quantité_en_stock,  photo, catégorie_id]
        );
        res.status(201).send(`Plante ajoutée avec l'ID ${result.insertId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout de la plante');
    }
});
//modifier une plante
app.put('/plantes/:id', async (req, res) => {
    const { id } = req.params;
    const { nom ,  prix , quantité_en_stock,  photo , catégorie_id } = req.body;
    try {
        await db.query(
            'UPDATE plantes SET nom = ?,  prix = ?, quantité_en_stock = ?, photo = ?, catégorie_id = ? WHERE id = ?',
            [nom ,  prix , quantité_en_stock,  photo , catégorie_id , id]
        );
        res.send('Plante mise à jour');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la mise à jour de la plante');
    }
});
//supprimer une plante 
app.delete('/plantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM plantes WHERE id = ?', [id]);
        res.send('Plante supprimée');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression de la plante');
    }
});
//ajouter une categorie
app.post('/ctegories', async (req, res) => {
    const { nom, description } = req.body;

    if (!nom || !description) {
        return res.status(400).send({ error: 'Les champs "nom" et "description" sont requis' });
    }

    try {
        const [result] = await db.execute('INSERT INTO ctegories (nom, description) VALUES (?, ?)', [nom, description]);
        res.status(201).send({ message: 'Catégorie ajoutée avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur SQL :', err);
        res.status(500).send({ error: 'Erreur lors de l\'ajout de la catégorie' });
    }
});
//afficher les categories
app.get('/ctegories', async (req, res) => {
    try {
        const [ctegories] = await db.execute('SELECT * FROM ctegories');
        res.status(200).json(ctegories); 
    } catch (err) {
        console.error('Erreur lors de la récupération des catégories :', err);
        res.status(500).send({ error: 'Erreur lors de la récupération des catégories' });
    }
});
//supprimer une categorie
app.delete('/ctegories/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const [result] = await db.execute('DELETE FROM ctegories WHERE id = ?', [categoryId]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Catégorie non trouvée' });
        }
        res.status(200).send({ message: 'Catégorie supprimée avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la catégorie :', err);
        res.status(500).send({ error: 'Erreur lors de la suppression de la catégorie' });
    }
});
//ajouter un client 
app.post('/clients', async (req, res) => {
    console.log('Données reçues :', req.body);
    const { username, email, adresse, num_tel } = req.body;

    if (!username || !email || !adresse || !num_tel) {
        return res.status(400).send({ error: 'Tous les champs sont obligatoires' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO clients (username, email, adresse, num_tel) VALUES (?, ?, ?, ?)',
            [username, email, adresse, num_tel]
        );
        res.status(201).send({ message: 'Client ajouté avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur SQL :', err);
        res.status(500).send({ error: 'Erreur lors de l\'ajout du client' });
    }
});
//afficher les clients 
app.get('/clients', async (req, res) => {
    try {
        const [clients] = await db.execute('SELECT * FROM clients');
        res.status(200).json(clients);
    } catch (err) {
        console.error('Erreur lors de la récupération des clients :', err);
        res.status(500).send({ error: 'Erreur lors de la récupération des clients' });
    }
});
//supprimer un client
app.delete('/clients/:id', async (req, res) => {
    const clientId = req.params.id;
    try {
        const [result] = await db.execute('DELETE FROM clients WHERE id = ?', [clientId]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Client non trouvé' });
        }
        res.status(200).send({ message: 'Client supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression du client :', err);
        res.status(500).send({ error: 'Erreur lors de la suppression du client' });
    }
});
//modifier un client
app.put('/clients/:id', async (req, res) => {
    const clientId = req.params.id;
    const { username, email, adresse, num_tel } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE clients SET username = ?, email = ?, adresse = ?, num_tel = ? WHERE id = ?',
            [username, email, adresse, num_tel, clientId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Client non trouvé' });
        }
        res.status(200).send({ message: 'Client modifié avec succès' });
    } catch (err) {
        console.error('Erreur lors de la modification du client :', err);
        res.status(500).send({ error: 'Erreur lors de la modification du client' });
    }
});
