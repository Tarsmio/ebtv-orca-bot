const { User } = require("discord.js");

class Team {
    #name;
    #leader;

    /**
    * @param {string} name Nom de l'équipe
    * @param {User} leader le capitaine
    */
    constructor(name, leader){
        this.#name = name
        this.#leader = leader
    }

    /**
    * @return {string} Nom de l'equipe
    */
    get getName(){
        return this.#name
    }

    /**
    * @return {User} User du leader
    */
    get getLeader(){
        return this.#leader
    }
}

module.exports = {
    Team
}