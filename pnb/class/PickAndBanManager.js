const { Collection } = require("discord.js")
const { PickAndBan } = require("./PickAndBan")

class PickAndBanManager {
    #list

    constructor(){
        if(PickAndBanManager._instance){
            return PickAndBanManager._instance
        }

        this._instance = this
        this.#list = new Collection()
    }

    /**
     * Retourne le nombre pnb present dans le manager
    * @param {PickAndBan} pnb
    * @return {number} Le nombre de pick and ban dans le manager
    */
    size(){
        return this.#list.size
    }

    /**
     * Ajout d'un pick and ban dans le manager
    * @param {PickAndBan} pnb
    * @return {boolean} true si l'ajout est fait false si non
    */
    addPnb(pnb){
        if(this.verifyId(pnb.id)){
            return false
        }

        this.#list.push(pnb)

        return false
    }

    /**
     * Retrait d'un pick and ban dans le manager
    * @param {PickAndBan} pnb
    * @return {boolean} true si le retrait est fait false si non
    */
    removePnb(pnbId){
        if(!this.verifyId(pnbId)){
            return false
        }

        return this.#list.delete(pnbId)
    }

    /**
     * Verifier si un id de pnb est present ou non
    * @param {string} id
    * @return {boolean} true si present
    */
    verifyId(id){
        let findId = this.#list.find(pnb => pnb.id === id)

        if(findId){
            return true
        } else {
            return false
        }
    }

    /**
     * Recuperer l'intance unique du manager
    * @return {PickAndBanManager} L'instance du manager
    */
    static getInstance(){
        if(PickAndBanManager._instance){
            return PickAndBanManager._instance
        } else {
            return new PickAndBanManager()
        }
    }
}

module.exports = {
    PickAndBanManager
}