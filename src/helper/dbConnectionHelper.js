const mysql = require("mysql");

const connection = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    dateStrings: "date",
    database: process.env.DB_NAME,
  });
  if (connection) return connection;
  return null;
};

module.exports.getConnection = connection;
