const { Pool } = require('pg')

const pool = new Pool({
    connectionString: "",
    max: 2
})

async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback)
}

async function getClient() {
    return pool.connect()
}

module.exports = { query, getClient }