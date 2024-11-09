const { default: axios } = require("axios");
const querystring = require('querystring');

var instance = null
class ToornamentTokenGest {
    #token;

    constructor() {
        if(instance != null){
            return instance
        } else {
            instance = this
        }

        this.#init()
    }

    get getToken() {
        return this.#token
    }

    async #init() {
        let tokenResponse = await this.#genTonken()

        this.#token = tokenResponse.access_token

        setTimeout(() => {
            this.#init()
        }, (tokenResponse.expires_in * 1000) - 3600000)
    }

    async #genTonken() {
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

    /**
     * 
     * @returns {ToornamentTokenGest}
     */
    static getInstance(){
        if(instance != null){
            return instance
        } else {
            instance = new ToornamentTokenGest()
            return instance
        }
    }
}

module.exports = {
    ToornamentTokenGest
}