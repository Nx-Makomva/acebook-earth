const express = require("express");

const UsersController = require("../controllers/users");

const tokenChecker = require('../middleware/tokenChecker');

const router = express.Router();

router.post("/", UsersController.create);

router.post('/', tokenChecker, UsersController.getFriends);

module.exports = router;
