const db = require("../mysqlDB")

module.exports = {
    addTeam: async (id_toornament, nom, role_id) => {
        return new Promise(async (resolve, reject) => {
            const request = `INSERT INTO Equipe (id_toornament, nom, cap_id, role_id) VALUES (${id_toornament}, '${nom}', '${role_id}')`

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

    getEquipeByName: async (name) => {
        return new Promise((resolve, reject) => {
            const request = `SELECT * FROM Equipe WHERE nom='${name}'`

            db.query(request, (err, result) => {
                if (err) reject(err)

                const equipe = {
                    id_toornament: result[0].id_toornament,
                    nom: result[0].nom
                }

                resolve(equipe)
            })
        })
    }
}