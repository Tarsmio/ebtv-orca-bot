const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const querystring = require('querystring');

function updateTokenInEnvFile(newToken) {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    envConfig.TOORNAMENT_TOKEN = newToken.access_token;
    fs.writeFileSync('.env', Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n'));
}

async function getStageIds(rangeMin, rangeMax) {
    const url = `https://api.toornament.com/organizer/v2/stages?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range' : `stages=${rangeMin.toString()}-${rangeMax.toString()}`
        }
    }

    try {
        const response = await axios.get(url, config)
        return response
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

async function getStreamIds(rangeMin, rangeMax) {
    const url = `https://api.toornament.com/organizer/v2/streams?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range' : `streams=${rangeMin.toString()}-${rangeMax.toString()}`
        }
    }

    try {
        const response = await axios.get(url, config)
        return response
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

async function getRoundIdsOf(stageId) {
    const url = `https://api.toornament.com/organizer/v2/rounds?stage_ids=${stageId}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range' : `rounds=0-49`
        }
    }

    try {
        const response = await axios.get(url, config)

        let ids = []

        response.data.forEach(round => {
            ids.push(round.id)
        });

        return ids
    }catch (error) {
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

async function getParticipants(rangeMin, rangeMax) {
    const url = `https://api.toornament.com/organizer/v2/participants?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            "X-Api-Key" : process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range' : `participants=${rangeMin.toString()}-${rangeMax.toString()}`
        }
    }

    try {
        const response = await axios.get(url, config)
        return response
    }catch (error) {
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

async function getNbStage() {
    const url = `https://api.toornament.com/organizer/v2/stages?tournament_ids=${process.env.TOORNAMENT_ID}`
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range': "stages=0-49",
        }
    }

    try {
        const response = await axios.get(url, config);
        return response.data.reduce((sum, item) => sum + item.settings.nb_groups, 0);
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

async function getTournamentToken() {
    const url = 'https://api.toornament.com/oauth/v2/token';
    const data = {
        'client_id': process.env.TOORNAMENT_CLIENT_ID,
        'client_secret': process.env.TOORNAMENT_CLIENT_SECRET,
        'scope': process.env.SCOPE,
        'grant_type': 'client_credentials',
    }

    const formData = querystring.stringify(data);
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    try {
        const response = await axios.post(url, formData, config);
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

async function setStreamUrl(name, urlStream) {
    const url = 'https://api.toornament.com/organizer/v2/streams';
    const data = {
        "tournament_id": process.env.TOORNAMENT_ID,
        "name": name,
        "url": urlStream,
        "language": "fr",
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

/**
 * Sets the stream for a match using the Toornament API.
 * @param {string} match_id - The ID of the match.
 * @param {string} stream_id - The ID of the stream to set for the match.
 * @returns {boolean} Returns true if the stream for the match is successfully set, otherwise throws an error.
 * @throws {Error} Throws an error with specific error messages for different HTTP status codes.
 */
async function setStreamMatch(match_id, stream_id) {
    const url = `https://api.toornament.com/organizer/v2/matches/${match_id}/streams`
    const data = [
        stream_id
    ]

    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Content-Type': 'application/json',
        }
    }

    try {
        await axios.put(url, data, config);
        return true;
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

async function getToornamentStreamUrl(stream_id) {
    const url = `https://api.toornament.com/organizer/v2/streams/${stream_id}`
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
        }
    }

    try {
        const response = await axios.get(url, config);
        return response.data.url;  
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
    getTournamentToken,
    updateTokenInEnvFile,
    getNbStage,
    setStreamUrl,
    setStreamMatch,
    getToornamentStreamUrl,
    getParticipants,
    getStreamIds,
    getStageIds,
    getRoundIdsOf
};