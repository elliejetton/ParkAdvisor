const sql = require('mysql');

class DBConnection {

    /**Initialize DB Connection */
    connection = null;

    constructor() {
        this.generateConnection();
    }


    generateConnection() {
        if (!this.connection) {
            this.connection = sql.createPool({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                charset: process.env.DB_CHARSET
            });
        }
    }

    createQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            if(!this.connection) {
                this.generateConnection();
            }
            this.connection.query(query, params, (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve({
                    results: results,
                    fields: fields
                });
            });
        });
    }

    closeConnection() {
        if(this.connection) {
            this.connection.end();
            this.connection = null;
        }
    }


}

module.exports = DBConnection;
