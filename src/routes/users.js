const dotenv = require("dotenv").config({ path: `${__dirname}/config/.env` });
const router = require("express").Router();
const multer = require("multer")({ dest: "./public/res/img" });

const userDAO = require("../dao/userDAO");
const { validateNewUser } = require("../validation/validation");

//GET
//Get all users
router.get("/", async (req, res) => {
  try {
    const result = await userDAO.getAll();
    res.render("users", {
      result,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
//Get user by ID
router.get("/details/:id", async (req, res) => {
  try {
    const result = await userDAO.get(req.params.id);
    if (result.length === 0) {
      res.status(404).render("users", { result: "User ID not found!" });
      return;
    }
    res.render("users", { result });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
//User form
router.get("/create/", async (req, res) => {
  res.render("createUser", { title: `Create new user`, error: null });
});

//POST
//Create new user
router.post("/create", multer.single("user-img-upload"), async (req, res) => {
  //Check HTML Form Data for valid input
  const { error } = validateNewUser(req.body);
  if (error) {
    res.status(400).render("createUser", {
      title: "Create new User",
      error: error.details[0].message,
      email,
      firstname,
      lastname,
    });
    return;
  }
  //Check if user already exists
  const existingUser = await userDAO.findByEmail(req.body.email);
  if (existingUser.length > 0) {
    res.status(400).render("createUser", {
      title: "Create new User",
      error: `User ${existingUser[0].email} already exists`,
      email,
      firstname,
      lastname,
    });
    return;
  }
  //Destructuring data
  const { email, firstname, lastname, usertype } = req.body;
  const photo = req.file;
  try {
    await userDAO.create({ email, photo, firstname, lastname, usertype });
    //Redirect to users
    res.redirect("/users");
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT
//Update user
router.put("/:id", async (req, res) => {
  //Check HTML Form Data for valid input
  const { error } = validateNewUser(req.body);
  if (error) {
    res.status(400).json({ msg: "Invalid user data", details: error.details[0].message });
    return;
  }
  try {
    const result = await userDAO.updateAndGet(req.body.id, req.body.firstname, req.body.lastname);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
//Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    let result = await userDAO.delete(req.params.id);
    if (result.affectedRows == 1) {
      res.status(200).send();
      return;
    }
    res.status(400).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

//TODO:
//Timestamp Format

module.exports = router;
