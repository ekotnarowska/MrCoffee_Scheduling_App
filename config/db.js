
const { Pool, Client } = require('pg')
const dotenv = require('dotenv')

// //Load config
dotenv.config({ path: './config/config.env'})

const client = new Client ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

client.connect()
client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end
})



module.exports = client
