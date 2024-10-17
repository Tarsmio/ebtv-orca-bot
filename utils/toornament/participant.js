const axios = require('axios');

const TEAM_IDS = require("./../../data/teams_ids.json");

async function getUniqueParticipant(participantId) {
    const url = `https://api.toornament.com/organizer/v2/participants/${participantId}`;

    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
        }
    }

    try {
        const response = await axios.get(url, config);
        return response.data.lineup;
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

async function setNewLineup(participantId, participantLineup) {
    const url = `https://api.toornament.com/organizer/v2/participants/${participantId}`;
    const data = {
        "lineup": participantLineup,
    }

    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Content-Type': 'application/json',
        }
    }

    try {
        await axios.patch(url, data, config);
        return true;
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

async function addPlayerToTeam(teamName, playerName) {
    const lineUp = await getUniqueParticipant(TEAM_IDS[teamName]);

    if(!lineUp){
        throw new Error('Problème de récupération de la lineup de l\'équipe');
    }

    lineUp.push({
        name: playerName,
        email: null,
        user_id: null,
        custom_user_identifier: null,
        custom_fields: {}
    })

    await setNewLineup(TEAM_IDS[teamName], lineUp);
}

async function removePlayerFromTeam(teamName, playerName) {
    const lineUp = await getUniqueParticipant(TEAM_IDS[teamName]);

    if(!lineUp){
        throw new Error('Problème de récupération de la lineup de l\'équipe');
    }

    const index = lineUp.findIndex(obj => obj.name === playerName);

    if (index === -1) {
        throw new Error(`Le joueur ${playerName} n'a pas été trouvé dans la liste des joueurs de l'équipe.`);
    }

    lineUp[index].name = null;

    await setNewLineup(TEAM_IDS[teamName], lineUp);
}

module.exports = {
    getUniqueParticipant,
    setNewLineup,
    addPlayerToTeam,
    removePlayerFromTeam,
}