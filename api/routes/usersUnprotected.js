// >>> these routes do not use tokens <<<
const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getAllUsers);
router.get("/:id", UsersController.getById);
router.put("/:id", UsersController.updateUser);
// router.post("/:myId/friends/:friendId", UsersController.addFriend);

module.exports = router;
