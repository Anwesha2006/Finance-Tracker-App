const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const protect = require("../middleware/auth.middleware");

router.get("/", protect, UserController.getAllUsers);

router.get("/profile", protect, UserController.getMyProfile);

router.get("/:id", protect, UserController.getUserById);

router.put("/:id", protect, UserController.updateUserById);

router.delete("/:id", protect, UserController.deleteUserById);

module.exports = router;