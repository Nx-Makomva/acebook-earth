// >>> these routes do not use tokens <<<
const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getAllUsers);
router.get("/:id", UsersController.getById);

module.exports = router;
