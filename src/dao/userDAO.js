const { getConnection } = require("../helper/dbConnectionHelper");
const imageCheck = require("../helper/imageCheck");

module.exports = {
  getAll: async () => {
    const connection = getConnection();
    if (connection === null) {
      return Promise.reject({ error: "DB connection failed!" });
    }
    connection.connect();
    return new Promise((resolve, rej) => {
      connection.query("SELECT * FROM USER", (error, results, fields) => {
        if (!error) {
          resolve(results);
        }
        rej(error);
        connection.destroy();
      });
    });
  },

  get: (id) => {
    const connection = getConnection();
    if (connection === null) Promise.reject({ error: "DB connection failed!" });
    connection.connect();
    return new Promise((resolve, rej) => {
      connection.query(`SELECT * FROM USER WHERE ID=${id}`, (error, results, fields) => {
        if (!error) {
          resolve(results);
        }
        rej(error);
        connection.destroy();
      });
    });
  },

  findByEmail: (email) => {
    const connection = getConnection();
    if (connection === null) Promise.reject({ error: "DB connection failed!" });
    connection.connect();
    return new Promise((resolve, rej) => {
      connection.query(`SELECT * FROM USER WHERE EMAIL='${email}'`, (error, results, fields) => {
        if (!error) {
          resolve(results);
        }
        rej(error);
        connection.destroy();
      });
    });
  },

  create: async (user) => {
    const connection = getConnection();
    if (connection === null) {
      return Promise.reject({ error: "DB connection failed!" });
    }
    if (!user.photo) {
      connection.connect();
      return new Promise((resolve, rej) => {
        connection.query(`INSERT INTO USER (email,firstname,lastname,user_type) VALUES ('${user.email}','${user.firstname}','${user.lastname}','${user.usertype}');`, (error, results, fields) => {
          if (!error) {
            resolve(results);
          }
          rej(error);
          connection.destroy();
        });
      });
    } else {
      //Check MIME Type of uploaded data
      if (!imageCheck(user.photo.mimetype)) return;
      const photo = process.env.PATH_USER_IMG + user.photo.filename;
      connection.connect();
      const query = new Promise((resolve, rej) => {
        connection.query(`INSERT INTO USER (email, photo,firstname,lastname,user_type) VALUES (?,?,?,?,?)`, [user.email, photo, user.firstname, user.lastname, user.usertype], (error, results, fields) => {
          if (!error) {
            resolve(results);
          }
          rej(error);
          connection.destroy();
        });
      });
      return query;
    }
  },

  update: async (id, photo, email, firstname, lastname, usertype) => {
    const connection = getConnection();
    if (connection === null) {
      return Promise.reject({ error: "DB connection failed!" });
    }
    if (!photo) {
      connection.connect();
      return new Promise((resolve, rej) => {
        connection.query(`UPDATE USER SET EMAIL="${email}",FIRSTNAME="${firstname}",LASTNAME="${lastname}",USER_TYPE="${usertype}" WHERE ID=${id}`, (error, results, fields) => {
          if (!error) {
            resolve(results);
          }
          rej(error);
          connection.destroy();
        });
      });
    } else {
      //Check MIME Type of uploaded data
      if (!imageCheck(photo.mimetype)) return;
      photo = process.env.PATH_USER_IMG + photo.filename;
      connection.connect();
      return new Promise((resolve, rej) => {
        connection.query(`UPDATE USER SET PHOTO="${photo}",EMAIL="${email}",FIRSTNAME="${firstname}",LASTNAME="${lastname}",USER_TYPE="${usertype}" WHERE ID=${id}`, (error, results, fields) => {
          if (!error) {
            resolve(results);
          }
          rej(error);
          connection.destroy();
        });
      });
    }
  },

  updateAndGet: function (id, email, firstname, lastname) {
    const connection = getConnection();
    if (connection === null) {
      return Promise.reject({ error: "DB connection failed!" });
    }
    connection.connect();
    return new Promise((resolve, rej) => {
      //Update record
      connection.query(`UPDATE USER SET EMAIL="${email}",FIRSTNAME="${firstname}",LASTNAME="${lastname}" WHERE ID=${id}`, (error, results, fields) => {
        if (!error) {
          resolve(results);
        }
        rej(error);
        connection.destroy();
      });
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
    if (connection === null) {
      return Promise.reject({ error: "DB connection failed!" });
    }
    connection.connect();
    return new Promise((resolve, rej) => {
      connection.query(`DELETE FROM USER WHERE ID=${id}`, (error, results, fields) => {
        if (!error) {
          resolve(results);
        }
        rej(error);
        connection.destroy();
      });
    });
  },
};
