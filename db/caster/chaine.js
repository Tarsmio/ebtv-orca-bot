const db = require("../mysqlDB")

module.exports = {
    addChaine: async (id_toornament, nom, id_discord) => {
        return new Promise(async (resolve, reject) => {
            const request = `INSERT INTO ChaineCast (id_toornament, nom, id_discord) VALUES ('${id_toornament}','${nom}','${id_discord}')`

            db.query(request, (err, result) => {
                if(err) reject(err)

                if (result.constructor.name == "OkPacket") {
                    resolve(true);
                } else {
                    reject("erreur inconnue : " + result);
                }
            })
        })
    },

    removeChaine: async (discord_id) => {
        return new Promise((resolve, reject) => {
            const request = `DELETE * FROM Caster WHERE id_discord='${discord_id}'`

            db.query(request, (err, result) => {
                if(err) reject(err)

                if (result.constructor.name == "OkPacket") {
                    resolve(true);
                } else {
                    reject("erreur inconnue : " + result);
                }
            })
        })
    }
}