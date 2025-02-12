const db = require("../mysqlDB")

module.exports = {
    chaine: require("./chaine"),
    addCaster: async (discord_id) => {
        return new Promise(async (resolve, reject) => {
            const request = `INSERT INTO Caster (id_discord) VALUES ('${discord_id}')`

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

    removeCaster: async (discord_id) => {
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