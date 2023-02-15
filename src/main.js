const dotenv = require("dotenv");
const express = require("express");
const app = require("express")();
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("path");

const usersAPI = require("./api/v1.0/routes/users");
const users = require("./routes/users");

//Config
dotenv.config({ path: path.join(__dirname, "/config/.env") });

//Express
const port = process.env.PORT || 8889;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

//HTTP Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Template Engine - EJS
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/views"));
app.set("layout", path.join(__dirname, "/views/layouts/index"));
app.set("view engine", "ejs");

//Static folder
app.use(express.static("public"));
app.use("/css", express.static("./src/public/css"));
app.use("/res", express.static("./src/public/res"));
app.use("/js", express.static("./src/public/js"));
app.use("/user_images", express.static("./user_images/"));

//Logging
//app.use(morgan("dev"));

//Routes
//REST API
app.use("/api/v1.0/users/", usersAPI);

app.get("/", (req, res) => res.redirect("/users"));
app.use("/users", users);
