var mysql = require('mysql')
const { DB_CONECT } = require('../config')

var db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf-8"
})

db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            throw new Error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            throw new Error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            throw new Error('Database connection was refused.')
        }
    }

    if (connection) connection.release() 

    return
})

module.exports = db