const db = require("../mysqlDB")

module.exports = {
    addCast: async (channelId, casterId, coCatserId, equipeA, equipeB, stream) => {
        return new Promise(async (resolve, reject) => {
            const request = `INSERT INTO CastAnnonce (channel_id, caster_id, co_caster_id, equipe_a, equipe_b, stream) VALUES ('${channelId}', '${casterId}', '${coCatserId == null ? 'NULL' : coCatserId}', '${equipeA}', '${equipeB}', '${stream}')`

            db.query(request, (err, result) => {
                if(err) reject(err)

                console.log(result)
                console.error(err)

                if (result.constructor.name == "OkPacket") {
                    resolve(true);
                } else {
                    reject("erreur inconnue : " + result);
                }
            })
        })
    },

    getCast: async (channelId) => {
        return new Promise((resolve, reject) => {
            const request = `SELECT * FROM CastAnnonce WHERE channel_id='${channelId}'`

            db.query(request, (err, result) => {
                if (err) reject(err)

                let castInfo = {
                    caster: result[0].caster_id,
                    coCaster: result[0].co_caster_id,
                    equipeA: result[0].equipe_a,
                    equipeB: result[0].equipe_b,
                    stream: result[0].stream
                }

                resolve(castInfo)
            })
        })
    }
}