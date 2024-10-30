class MapsSelction {
    #ddz;
    #er;
    #mb;
    #pdp;

    constructor() {
        this.#ddz = []
        this.#er = []
        this.#mb = []
        this.#pdp = []
    }

    /**
    * @param {Maps} map La map a ajouté 
    */
    addDdz(map) {
        if(this.verifyIdDdz){
            return false
        }

        this.#ddz.push(map)
    }

    /**
    * @param {Maps} map La map a ajouté 
    */
    addEr(map) {
        if(this.verifyIdEr){
            return false
        }

        this.#er.push(map)
    }

    /**
    * @param {Maps} map La map a ajouté 
    */
    addMb(map) {
        if(this.verifyIdMb){
            return false
        }

        this.#mb.push(map)
    }

    /**
    * @param {Maps} map La map a ajouté 
    */
    addPdp(map) {
        if(this.verifyIdPdp){
            return false
        }

        this.#pdp.push(map)
    }

    addMode(map, mod){
        switch(mod){
            case 0:
                this.addDdz(map)
                break;

            case 1:
                this.addEr(map)
                break;

            case 2:
                this.addMb(map)
                break;

            case 3:
                this.addPdp(map)
                break;
        }
    }

    get getDdz(){
        return this.#ddz
    }

    get getEr(){
        return this.#er
    }

    get getMb(){
        return this.#mb
    }

    get getPdp(){
        return this.#pdp
    }

    verifyIdDdz(id) {
        let present = false

        this.#ddz.forEach(map => {
            if(map.getId == id){
                present = true
            }
        })

        return present
    }

    verifyIdEr(id) {
        let present = false

        this.#er.forEach(map => {
            if(map.getId == id){
                present = true
            }
        })

        return present
    }

    verifyIdMb(id) {
        let present = false

        this.#mb.forEach(map => {
            if(map.getId == id){
                present = true
            }
        })

        return present
    }

    verifyIdPdp(id) {
        let present = false

        this.#pdp.forEach(map => {
            if(map.getId == id){
                present = true
            }
        })

        return present
    }
}