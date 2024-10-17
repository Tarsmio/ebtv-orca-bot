require('dotenv').config();
const axios = require('axios');

const { getDayOfWeekWithDate } = require('./utilityTools');
const TEAM_IDS = require("./../data/teams_ids.json")

async function fetchMatches(team1, team2) {
    const url = `https://api.toornament.com/organizer/v2/matches?participant_ids=${TEAM_IDS[team1]},${TEAM_IDS[team2]}&tournament_ids=${process.env.TOORNAMENT_ID}`;
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range': "matches=0-99",
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

async function getMatchId(team1, team2) {
    try {
        const matches = await fetchMatches(team1, team2);
        // return;

        let match_id = 0;
        let opponent1;
        let opponent2;
        // let data = {};

        for (const match of matches) {
            const opp = match.opponents;

            if (
                !opp[0]?.participant?.name ||
                !opp[1]?.participant?.name
            ) {
                // Skip the current iteration if either name is null
                continue;
            }

            if (
                (opp[0].participant.name.toLowerCase() === team1.toLowerCase() ||
                    opp[0].participant.name.toLowerCase() === team2.toLowerCase()) &&
                (opp[1].participant.name.toLowerCase() === team1.toLowerCase() ||
                    opp[1].participant.name.toLowerCase() === team2.toLowerCase())
            ) {
                //Only search for pending matches
                //check if match participants are the searched one
                match_id = match.id;
                // data.stage_id = match.stage_id;
                opponent1 = opp[0].participant;
                opponent2 = opp[1].participant;
                break;
            }
        }

        return match_id;

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
 * Fetches unique match data between two teams from the Toornament API.
 * @param {string} team1 - The ID of the first team.
 * @param {string} team2 - The ID of the second team.
 * @returns {Object} Returns match data if found.
 * @throws {Error} Throws an error with specific error messages for different HTTP status codes.
 */
async function fetchUniqueMatch(team1, team2) {
    const url = `https://api.toornament.com/organizer/v2/matches?participant_ids=${TEAM_IDS[team1]}&tournament_ids=${process.env.TOORNAMENT_ID}&statuses=pending&is_scheduled=1`;
    const config = {
        headers: {
            'X-Api-Key': process.env.API_KEY,
            'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`,
            'Range': "matches=0-5",
        }
    }

    try {
        const response = await axios.get(url, config);
        const opponentsSet = new Set([team2]);

        if (response.data.length === 1) {
            return response.data;
        }

        for (const match of response.data) {
            for (const team of match.opponents) {
                if (opponentsSet.has(team.participant.name)) {
                    return [match];
                }
            }
        }
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

async function findMatch(interaction, team1, team2, data, callback) {
    try {
        const matches = await fetchMatches(team1, team2);
        // return;

        let match_id = 0;
        let opponent1;
        let opponent2;

        for (const match of matches) {
            const opp = match.opponents;

            if (
                !opp[0]?.participant?.name ||
                !opp[1]?.participant?.name
            ) {
                // Skip the current iteration if either name is null
                continue;
            }

            if (
                (opp[0].participant.name.toLowerCase() === team1.toLowerCase() ||
                    opp[0].participant.name.toLowerCase() === team2.toLowerCase()) &&
                (opp[1].participant.name.toLowerCase() === team1.toLowerCase() ||
                    opp[1].participant.name.toLowerCase() === team2.toLowerCase())
            ) {
                //Only search for pending matches
                //check if match participants are the searched one
                match_id = match.id;
                data.stage_id = match.stage_id;
                opponent1 = opp[0].participant;
                opponent2 = opp[1].participant;
                break;
            }
        }
        // If no match is found
        if (match_id == 0) {
            return interaction.editReply({ content: `Il n'y a pas de match entre ${team1} et ${team2}, vérifier les teams.` })
        } else {
            callback(interaction, data, match_id, team1, team2, opponent1, opponent2);
        }
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


async function setPlanif(interaction, match_date, match_id, team1, team2) {
    const url = `https://api.toornament.com/organizer/v2/matches/${match_id}`;
    const headers = {
        'X-Api-Key': process.env.API_KEY,
        'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`, //Verify what should be the value of Bearer token
        'Content-Type': 'application/json',
    };

    try {
        await axios.patch(url, { scheduled_datetime: match_date }, { headers });
        if (match_date) {
            return await interaction.editReply({ content: `Le match entre ${team1} et ${team2} a été planifié le ${getDayOfWeekWithDate(match_date.substring(0, 10))} à ${match_date.substring(11, 16)}.` })
        } else {
            await interaction.editReply({ content: `Le match entre ${team1} et ${team2} a pas été planifié.` });
        }
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


async function setReport(interaction, teamRep, match_id, team1, team2) {
    const url = `https://api.toornament.com/organizer/v2/matches/${match_id}`;
    const headers = {
        'X-Api-Key': process.env.API_KEY,
        'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`, //Verify what should be the value of Bearer token
        'Content-Type': 'application/json',
    };

    try {
        await axios.patch(url, {
            scheduled_datetime: null,
            public_note: `Report ${teamRep}`,
        }, { headers });

        await interaction.editReply({ content: `Le match entre ${team1} et ${team2} a été reporté par ${teamRep}` });
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

async function setResult(interaction, score, match_id, winner, loser, opponent1, opponent2) {
    const url = `https://api.toornament.com/organizer/v2/matches/${match_id}`
    const headers = {
        'X-Api-Key': process.env.API_KEY,
        'Authorization': `Bearer ${process.env.TOORNAMENT_TOKEN}`, //Verify what should be the value of Bearer token
        'Content-Type': 'application/json',
    };

    try {
        await axios.patch(url, {
            status: "completed",
            opponents: [
                {
                    name: opponent1.name,
                    result: opponent1.name.toLowerCase() === winner.toLowerCase() ? "win" : "loss",
                    score: opponent1.name.toLowerCase() === winner.toLowerCase() ? parseInt(score[0], 10) : parseInt(score[2], 10),
                },
                {
                    name: opponent2.name,
                    result: opponent2.name.toLowerCase() === winner.toLowerCase() ? "win" : "loss",
                    score: opponent2.name.toLowerCase() === winner.toLowerCase() ? parseInt(score[0], 10) : parseInt(score[2], 10),
                },
            ],
        }, { headers })

        score = `**${score[0]}**-${score[2]}`;
        await interaction.editReply({ content: `Résultat du match : **${winner}** ${score} ${loser}` });
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
    findMatch,
    setPlanif,
    setReport,
    setResult,
    fetchUniqueMatch,
    getMatchId
}