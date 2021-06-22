const mysql = require('mysql');
const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();
let instance = null;
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('connection successfull ' + connection.state);
    }
})

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "select * from names;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results)
                });
            })
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async insertNewName(name) {
        try {
            const date_added = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "insert into names (name, created_at)values(?,?);";
                connection.query(query, [name, date_added], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            })
            return {
                id: insertId,
                name: name,
                created_at: date_added
            }
            //return response;
        } catch (error) {
            console.log(error)
        }
    }
    async updateNewName(id, name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const sql = "update names set name=? where id=?";
                connection.query(sql, [name, id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message))
                    }

                    resolve(result.affectedRows)
                })
            })
            return response === 1 ? true : false;
        } catch (error) {
            return false;
        }
    }
    async getSingleRowData(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const sql = "select * from names where id=?";
                connection.query(sql, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result)
                })
            })
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteRow(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const sql = "delete from names where id=?";
                connection.query(sql, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    //console.log(result)
                    resolve(result.affectedRows)

                });
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log('in eeor' + error)
            return false;
        }
    }
    async getSearchedData(searchKey) {
        try {
            console.log(searchKey)
            const response = await new Promise((resolve, reject) => {
                const sql = `select * from names where name like N'%${searchKey}%'`;
                connection.query(sql, (err, results) => {
                    if (err) reject(new Error(err.message))
                    resolve(results);

                })
            })
            return response;
        } catch (error) {
            return false;
        }

    }
}

module.exports = DbService;