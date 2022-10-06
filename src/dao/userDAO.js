const fs = require("fs");
const mysql = require("mysql");
const path = require("path");

const { getConnection } = require("../helper/dbConnectionHelper");
const { readFile } = require("../helper/fileReader");

module.exports = {
  getAll: () => {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        connection.query("SELECT * FROM USER", (error, results, fields) => {
          if (!error) resolve(results);
          rej(error);
        });
      } catch (error) {
        rej(error);
      } finally {
        connection.end();
      }
    });
  },

  get: (id) => {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        connection.query(`SELECT * FROM USER WHERE ID=${id}`, (error, results, fields) => {
          if (error) rej(error);
          resolve(results);
        });
      } catch (error) {
        rej(error);
      } finally {
        connection.end();
      }
    });
  },

  findByEmail: (email) => {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        connection.query(`SELECT * FROM USER WHERE EMAIL='${email}'`, (error, results, fields) => {
          if (error) rej(error);
          resolve(results);
        });
      } catch (error) {
        rej(error);
      } finally {
        connection.end();
      }
    });
  },

  create: async (user) => {
    const connection = getConnection();
    if (!connection) return false;
    if (!user.photo) {
      const query = new Promise((res, rej) => {
        connection.query(
          `INSERT INTO USER (email,firstname,lastname,user_type) VALUES ('${user.email}','${user.firstname}','${user.lastname}','${user.usertype}');`,
          (error, results, fields) => {
            if (!error) res(results);
          }
        );
      });
      return query;
    } else {
      try {
        const photo = await readFile(`./tmp_uploads/${user.photo}`);
        const query = new Promise((res, rej) => {
          connection.query(
            //`INSERT INTO USER (email,photo,firstname,lastname,user_type) VALUES ('${user.email}',${data},'${user.firstname}','${user.lastname}','${user.usertype}');`,
            `INSERT INTO USER (email, photo,firstname,lastname,user_type) VALUES (?,?,?,?,?)`,
            [user.email, photo, user.firstname, user.lastname, user.usertype],
            (error, results, fields) => {
              if (!error) res(results);
              rej(error);
            }
          );
        });
        return query;
      } catch (err) {
        return Promise.reject(err);
      } finally {
        fs.unlinkSync(`./tmp_uploads/${user.photo}`);
        connection.end();
      }
    }
  },

  update: (id, firstname, lastname) => {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        connection.query(`UPDATE USER SET FIRSTNAME="${firstname}",LASTNAME="${lastname}" WHERE ID=${id}`, (error, results, fields) => {
          if (!error) return resolve(results);
          rej(error);
        });
      } catch (error) {
        rej(error);
      } finally {
        connection.end();
      }
    });
  },

  updateAndGet: function (id, firstname, lastname) {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        //Update record
        connection.query(`UPDATE USER SET FIRSTNAME="${firstname}",LASTNAME="${lastname}" WHERE ID=${id}`, (error, results, fields) => {
          if (!error) resolve(results);
          rej(error);
        });
      } catch (error) {
        rej(error);
      }
    })
      .then(() => {
        //Get updated record
        return this.get(id);
      })
      .then((result) => {
        return result;
      });
  },

  delete: (id) => {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        connection.query(`DELETE FROM USER WHERE ID=${id}`, (error, results, fields) => {
          if (!error) return resolve(results);
          rej(error);
        });
      } catch (error) {
        rej(error);
      } finally {
        connection.end();
      }
    });
  },

  deleteAll: () => {
    const connection = getConnection();
    if (!connection) return false;
    return new Promise((resolve, rej) => {
      try {
        connection.query("TRUNCATE USER", (error, results, fields) => {
          if (!error) return resolve(results);
          rej(error);
        });
      } catch (error) {
        rej(error);
      } finally {
        connection.end();
      }
    });
  },
};
