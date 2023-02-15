const router = require("express").Router();
const multer = require("multer")({ dest: "user_images/" });

const userDAO = require("../dao/userDAO");
const dateHelper = require("../helper/dateHelper");
const { validateNewUser } = require("../validation/validation");

//GET
/* Get all users */
router.get("/", async (req, res) => {
  try {
    let result = await userDAO.getAll();
    result = result.map((e) => {
      return {
        ...e,
        formattedCreated: dateHelper.getFormattedDate(new Date(e.created)),
        formattedUpdated: dateHelper.getFormattedDate(new Date(e.updated)),
      };
    });
    res.render("users", {
      title: "Welcome - Dashboard",
      result,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
/* User user details */
router.get("/details/:id", async (req, res) => {
  try {
    let result = await userDAO.get(req.params.id);
    result = {
      ...result[0],
      formattedCreated: dateHelper.getFormattedDate(new Date(result[0].created)),
      formattedUpdated: dateHelper.getFormattedDate(new Date(result[0].updated)),
    };
    if (result.length === 0) {
      res.status(404).render("users", { result: "User ID not found!" });
      return;
    }
    res.render("userDetails", { title: `Details ${result.firstname} ${result.lastname}`, result });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
/* User form - Update user (mobile view) */
router.get("/update/:id", async (req, res) => {
  try {
    let result = await userDAO.get(req.params.id);
    result = {
      ...result[0],
      formattedCreated: dateHelper.getFormattedDate(new Date(result[0].created)),
      formattedUpdated: dateHelper.getFormattedDate(new Date(result[0].updated)),
    };
    if (result.length === 0) {
      res.status(404).render("users", { result: "User ID not found!" });
      return;
    }
    res.render("updateUser", {
      title: `Update ${result.firstname} ${result.lastname}`,
      error: null,
      result,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//POST
/* Update user (mobile view) */
router.post("/update/:id", multer.single("crtUserImgUpload"), async (req, res) => {
  const user = {
    email: req.body.crtUserEmail,
    firstname: req.body.crtUserFirstname,
    lastname: req.body.crtUserLastname,
    usertype: req.body.crtUserType,
  };
  //Check HTML form data for valid input
  const { error } = validateNewUser(user);
  if (error) {
    res.status(400).render("updateUser", {
      title: "Update failed",
      error: error.details[0].message,
      result: { id: req.params.id, ...user },
    });
    return;
  }
  //Add user photo to user
  user.photo = req.file;
  try {
    await userDAO.update(+req.params.id, user.photo, user.email, user.firstname, user.lastname, user.usertype);
    //Redirect to users
    res.redirect("/users");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
/* Create new user - Form */
router.get("/create/", async (req, res) => {
  res.render("createUser", { title: `Create new user`, error: null });
});

//POST
/* Create new user */
router.post("/create", multer.single("crtUserImgUpload"), async (req, res) => {
  const user = {
    email: req.body.crtUserEmail,
    firstname: req.body.crtUserFirstname,
    lastname: req.body.crtUserLastname,
    usertype: req.body.crtUserType,
  };
  //Check HTML Form Data for valid input
  const { error } = validateNewUser(user);
  if (error) {
    res.status(400).render("createUser", {
      title: "Create new User",
      error: error.details[0].message,
      user,
    });
    return;
  }
  //Check if user already exists
  const existingUser = await userDAO.findByEmail(req.body.email);
  if (existingUser.length > 0) {
    res.status(400).render("createUser", {
      title: "Create new User",
      error: `User ${existingUser[0].email} already exists`,
      user,
    });
    return;
  }
  //Add user photo to user
  user.photo = req.file;
  try {
    await userDAO.create(user);
    //Redirect to users
    res.redirect("/users");
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT
/* Update user (Desktop View) */
router.put("/:id", async (req, res) => {
  //Check HTML Form Data for valid input
  const { error } = validateNewUser(req.body);
  if (error) {
    res.status(400).json({ msg: "Invalid user data", details: error.details[0].message });
    return;
  }
  try {
    let result = await userDAO.updateAndGet(req.body.id, req.body.email, req.body.firstname, req.body.lastname);
    // Add formatted date fields
    result = {
      ...result[0],
      formattedCreated: dateHelper.getFormattedDate(new Date(result[0].created)),
      formattedUpdated: dateHelper.getFormattedDate(new Date(result[0].updated)),
    };
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
/* Delete user */
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

module.exports = router;
