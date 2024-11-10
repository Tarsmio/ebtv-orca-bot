require('dotenv').config();
const axios = require('axios');
const { ToornamentTokenGest } = require('./ToornamenTokenGest');

const tokenGestInstance = ToornamentTokenGest.getInstance()

async function fetchGroup(range = "0-49") {
    const url = `https://api.toornament.com/organizer/v2/groups?tournament_ids=${process.env.TOORNAMENT_ID}`;
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${await tokenGestInstance.getToken()}`,
            'Range': `groups=${range}`,
        }
    }

    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
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

/**
 * Fetches unique group data from the Toornament API.
 * @param {string} group - The ID of the group to fetch.
 * @returns {Object} Returns group data if found.
 * @throws {Error} Throws an error with specific error messages for different HTTP status codes.
 */
async function fetchUniqueGroup(group) {
    const url = `https://api.toornament.com/organizer/v2/groups/${group}`;
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${await tokenGestInstance.getToken()}`,
        }
    }

    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
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

async function getTeamsGroup(stage_id) {
    const url = `https://api.toornament.com/organizer/v2/ranking-items?tournament_ids=${process.env.TOORNAMENT_ID}&stage_ids=${stage_id}`
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${await tokenGestInstance.getToken()}`,
            'Range': `items=0-49`,
        }
    }

    try {
        const response = await axios.get(url, config);
        const teamsData = response.data;

        const teams = [];

        // Group teams by group_id
        teamsData.forEach(team => {
            teams.push(team.participant?.name); // Assuming 'name' is the team name
        });

        return teams;
    } catch (error) {
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
    fetchGroup,
    getTeamsGroup,
    fetchUniqueGroup
}