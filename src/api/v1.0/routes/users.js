const router = require("express").Router();
const userDAO = require("../../../dao/userDAO");

//GET
//Get all users
router.get("/", async (req, res) => {
  try {
    const result = await userDAO.getAll();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
//Get user by ID
router.get("/?:id", async (req, res) => {
  try {
    const result = await userDAO.get(req.params.id);
    if (result.length === 0) {
      res.status(404).json("User ID not found");
      return;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//POST
//Create new user
router.post("/", async (req, res) => {
  try {
    const result = await userDAO.create(req.body);
    const user = await userDAO.get(result.insertId);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT
//Update user
router.put("/:id", async (req, res) => {
  try {
    const result = await userDAO.update(req.params.id, req.body.firstname, req.body.lastname);
    if (result.affectedRows === 0) {
      res.status(404).json("User ID not found");
      return;
    }
    const updated = await userDAO.get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
//Delete user
router.delete("/:id", async (req, res) => {
  try {
    const result = await userDAO.delete(req.params.id);
    if (result.affectedRows === 0) {
      res.status(404).json("User ID not found");
      return;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete all user
router.delete("/", async (req, res) => {
  try {
    const result = await userDAO.deleteAll();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
