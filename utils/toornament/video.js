const axios = require('axios');

async function setVideo(name, urlVideo, matchId) {
    const url = 'https://api.toornament.com/organizer/v2/videos';
    const data = {
        "name": name,
        "url": urlVideo,
        "language": "fr",
        "category": "replay",
        "match_id": matchId
    }

    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await axios.post(url, data, config);
        return response.data;
    }
    catch (error) {
        console.error(error);
        switch (error.response.status) {
            case 400:
                throw new Error('Requête Invalide: La requête est mal formée.');
            case 401:
                throw new Error('Non autorisé: Le bot ne possède pas un token d\'authentification valide.');
            case 403:
                throw new Error('Interdit: Le bot n\'a pas l\'autorisation d\'accéder à cette ressource.');
            case 404:
                throw new Error('Non trouvé: La requête effectué n\'existe pas');
            case 405:
                throw new Error('Méthode non authorisée: Le type de requête effectuée n\'est pas valide.');
            case 429:
                throw new Error('Trop de requête: Le bot a envoyé trop de requête dans un court temps imparti.')
            case 500:
                throw new Error('Erreur Serveur: Le serveur a rencontré une erreur imprévue.');
            default:
                throw new Error('Une erreur inconnue est survenue, veuillez réessayer plus tard.');
        }
    }
}

module.exports = {
    setVideo,
}