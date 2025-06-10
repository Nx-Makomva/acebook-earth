// >>> these routes do not use tokens <<<
const express = require("express");

const UsersController = require("../controllers/users");

const tokenChecker = require('../middleware/tokenChecker');

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getAllUsers);
router.get("/search", UsersController.searchusers);
router.get("/:id", UsersController.getById);

router.post('/', tokenChecker, UsersController.getFriends);

module.exports = router;
