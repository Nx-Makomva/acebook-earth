// >>> these routes use tokens <<<
const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/friends/:friendId", UsersController.addFriend);
router.get("/profile/friends/:id", UsersController.getAllFriends);
router.put("/:id", UsersController.updateUser);
router.delete("/:id", UsersController.deleteUserById)

module.exports = router;