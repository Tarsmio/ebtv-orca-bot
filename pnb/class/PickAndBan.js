const { TextChannel, User } = require("discord.js");
const { Team } = require("./Team");
const { PickAndBanManager } = require("./PickAndBanManager");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createId(channelId, teamAName, teamBName){
    let id = ""
    let cropCId = channelId.substring(13)
    let cropTA = teamAName.substring(0,2)
    let cropTB = teamBName.substring(0,2)
    let pnbManager = PickAndBanManager.getInstance()

    do {
        let randomNumber = getRandomInt(100, 999);
        id = `${randomNumber.toString()}${cropCId}${cropTA}${cropTB}`
    } while (pnbManager.verifyId(id));

    return id
}

class PickAndBan {
    #id;
    #teamA;
    #teamB;
    #channel;
    #bo;
    #order; //0 = ddz, 1 = er, 2 = mb, 3 = pdp
    #actualMode; //0 = ddz, 1 = er, 2 = mb, 3 = pdp
    #scoreA;
    #scoreB;
    #actualMap;
    #selection;
    #pickTeam;
    #banTeam;
    #response;
    #phaseNumber;
    #phase; //0 = turf, 1= selection, 2= game, 3=end
    #bannedList;
    #playedList;

    /**
    * @param {Team} teamA L'equipe a
    * @param {Team} teamB L'equipe b
    * @param {TextChannel} channel Le Channel du pnb
    * @param {Array} order
    * @param {MapsSelction} selection
    */
    constructor(teamA, teamB, channel, order=[0,1,2,3], selection){
        this.#id = createId(channel)
        this.#channel = channel
        this.#teamA = teamA
        this.#teamB = teamB
        this.#bo = 7
        this.#order = order
        this.#selection = selection
        this.#banTeam = null
        this.#pickTeam = null
        this.#actualMap = null
        this.#scoreA = 0
        this.#scoreB = 0

        this.#phase = 0

        this.#response = {
            a: null,
            b: null
        }

        this.#bannedList = new MapsSelction()
        this.#playedList = new MapsSelction()
    }

    /**
    * @param {User} user L'utilisateur qui a fait l'action
    */
    actionWinA(user){
        if((user.id =! this.#teamA.getLeader.id) && (user.id =! this.#teamB.getLeader.id)){
            return false
        }

        if(this.#phase >= 2){
            return false
        }

        if(user.id == this.#teamA){
            this.#response.a = "WinA"
        } else {
            this.#response.b = "WinA"
        }

        this.#update()

        return true
    }

    /**
    * @param {User} user L'utilisateur qui a fait l'action
    */
    actionWinB(user){
        if((user.id =! this.#teamA.getLeader.id) || (user.id =! this.#teamB.getLeader.id)){
            return false
        }

        if(this.#phase >= 2){
            return false
        }

        if(user.id == this.#teamA){
            this.#response.a = "WinB"
        } else {
            this.#response.b = "WinB"
        }

        this.#update()

        return true
    }

    /**
    * @param {User} user L'utilisateur a l'origine de l'action
    * @param {string} mapid L'id de la map choisi
    */
    actionPickMap(user, mapId){
        const actualMaps = this.getMaps

        if(user.id != this.#pickTeam.getLeader.id){
            return false
        }

        let map = actualMaps.find(map => map.id == mapId)

        if(map){
            this.#actualMap = map
            this.#playedList.addMode(map, this.#actualMode)
            return true
        } else {
            return false
        }
    }

    /**
    * @param {User} user L'utilisateur a l'origine de l'action
    * @param {string} mapid L'id de la map choisi
    */
    actionBanMap(user, mapId){
        const actualMaps = this.getMaps

        if(user.id != this.#banTeam.getLeader.id){
            return false
        }

        let map = actualMaps.find(map => map.id == mapId)

        if(map){
            this.#bannedList.addMode(map, this.#actualMode)
            return true
        } else {
            return false
        }
    }

    /**
    * @return {boolean} True si c'est fini
    */
    isEnd(){
        return this.#phase == 3 ? true : false
    }

    /**
    * @return {"A" | "B" | null} Le gagnant ou null si aucun gagnant
    */
    get getWinner(){
        const pointToWin = (this.#bo/2) + 0.5

        if(this.#scoreA >= pointToWin){
            return "A"
        } else if(this.#scoreB >= pointToWin){
            return "B"
        } else {
            null
        }
    }

    get getChannel(){
        return this.#channel
    }

    get getActualMap(){
        return this.#actualMap
    }

    get getActualMode(){
        return this.#actualMode
    }

    get getPhase(){
        return this.#phase
    }

    get getTeamA(){
        return this.#teamA
    }

    get getTeamB(){
        return this.#teamB
    }

    get getId(){
        return this.#id
    }

    get getMaps(){
        var mapsToReturn = []

        switch (this.#order[this.#phaseNumber - 1]){
            case 0:
                this.#selection.getDdz.forEach(mapSelction => {
                    if((!this.#bannedList.getDdz.find(mapBanned => mapBanned.id == mapSelction.id)) || (!this.#playedList.getDdz.find(mapPlayed => mapPlayed.id == mapSelction.id))){
                        mapsToReturn.push(mapSelction)
                    }
                })
                break;

            case 1:
                this.#selection.getEr.forEach(mapSelction => {
                    if((!this.#bannedList.getEr.find(mapBanned => mapBanned.id == mapSelction.id)) || (!this.#playedList.getEr.find(mapPlayed => mapPlayed.id == mapSelction.id))){
                        mapsToReturn.push(mapSelction)
                    }
                })
                break;

            case 2:
                this.#selection.getMb.forEach(mapSelction => {
                    if((!this.#bannedList.getMb.find(mapBanned => mapBanned.id == mapSelction.id)) || (!this.#playedList.getMb.find(mapPlayed => mapPlayed.id == mapSelction.id))){
                        mapsToReturn.push(mapSelction)
                    }
                })
                break;

            case 3:
                this.#selection.getPdp.forEach(mapSelction => {
                    if((!this.#bannedList.getPdp.find(mapBanned => mapBanned.id == mapSelction.id)) || (!this.#playedList.getPdp.find(mapPlayed => mapPlayed.id == mapSelction.id))){
                        mapsToReturn.push(mapSelction)
                    }
                })
                break;
        }

        return mapsToReturn
    }

    #nextPhase(response){
        if(this.#phase == 0){

            if(response == 'WinA'){
                this.#banTeam = this.#teamB
                this.#pickTeam = this.#teamA
            } else {
                this.#banTeam = this.#teamA
                this.#pickTeam = this.#teamB
            }

            this.#phase = 1
            this.#phaseNumber += 1

            this.#actualMode = this.#order[this.#phaseNumber - 1]

        } else if(this.#phase == 1){

            this.#phase = 2
            this.#phaseNumber += 1

        } else if(this.#phase == 2){

            if(response == 'WinA'){
                this.#banTeam = this.#teamA
                this.#pickTeam = this.#teamB

                this.#scoreA += 1
            } else {
                this.#banTeam = this.#teamB
                this.#pickTeam = this.#teamA

                this.#scoreB += 1
            }

            if((this.#scoreA >= ((this.#bo/2)+0.5)) || (this.#scoreB >= ((this.#bo/2)+0.5))){
                this.#phase = 3
            } else {
                
                this.#phase = 1
                this.#actualMode = this.#order[this.#phaseNumber - 1]
                this.#phaseNumber += 1
            }
        }
    }

    #update(){
        if(this.#response.a =! null && this.#response.b != null){
            if(this.#response.a == this.#response.b){
                this.#nextPhase(this.#response.a)
            } else {
                this.#response = {
                    a: null,
                    b: null
                }
            }
        }
    }
}

module.exports = {
    PickAndBan
}