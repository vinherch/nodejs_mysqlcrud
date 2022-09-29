const mysql = require("mysql");

const getConnection = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    dateStrings: "date",
    database: "crud_db",
  });
  if (connection) return connection;
  return null;
};

module.exports.getConnection = getConnection;
