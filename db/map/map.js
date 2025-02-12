const db = require("../mysqlDB")

module.exports = {
    modeActuel: require("./modeAct"),
    getMapById: async (id) => {
        return new Promise((resolve, reject) => {
            const request = `SELECT * FROM Map WHERE id='${id}'`

            db.query(request, (err, result) => {
                if (err) reject(err)

                const map = {
                    id: result[0].id,
                    nom: result[0].nom
                }

                resolve(map)
            })
        })
    },

    getMapByName: async (name) => {
        return new Promise((resolve, reject) => {
            const request = `SELECT * FROM Map WHERE nom='${name}'`

            db.query(request, (err, result) => {
                if (err) reject(err)

                const map = {
                    id: result[0].id,
                    nom: result[0].nom
                }

                resolve(map)
            })
        })
    },

    getMaps: async () => {
        return new Promise((resolve, reject) => {
            const request = `SELECT * FROM Map`

            db.query(request, (err, result) => {
                if (err) reject(err)

                let maps = []

                result.forEach(map => {
                    maps.push(
                        {
                            id: map.id,
                            nom: map.nom
                        }
                    )
                });

                resolve(maps)
            })
        })
    }
}