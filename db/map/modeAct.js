const db = require("../mysqlDB")

async function deleteModes() {
    return new Promise((resolve, reject) => {
        const request = `DELETE FROM ModeActuel`

        db.query(request, (err, result) => {
            if (err) reject(err)

            if (result.constructor.name == "OkPacket") {
                resolve(true);
            } else {
                reject(false);
            }
        })
    })
}

module.exports = {
    getModesActuel: async () => {
        return new Promise((resolve, reject) => {
            const request = `SELECT * FROM ModeActuel`

            db.query(request, (err, result) => {
                if (err) reject(err)

                modeList = {
                    mUn: result[0].mUn,
                    mDeux: result[0].mDeux,
                    mTrois: result[0].mTrois,
                    mQuatre: result[0].mQuatre,
                    mCinq: result[0].mCinq,
                    mSix: result[0].mSix,
                    mSept: result[0].mSept,
                }

                resolve(modeList)
            })
        })
    },

    changeModeActuel: async (modeListe) => {
        if(!await deleteModes()) return false

        return new Promise((resolve, reject) => {
            const request = `INSERT INTO ModeActuel (mUn, mDeux, mTrois, mQuatre, mCinq, mSix, mSept) VALUES (${modeListe.mUn}, ${modeListe.mDeux}, ${modeListe.mTrois}, ${modeListe.mQuatre}, ${modeListe.mCinq}, ${modeListe.mSix}, ${modeListe.mSept})`

            db.query(request, (err, result) => {
                if (err) reject(err)

                if (result.constructor.name == "OkPacket") {
                    resolve(true);
                } else {
                    reject("erreur inconnue : " + result);
                }
            })
        })
    }
}

