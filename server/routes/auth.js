const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const authController = require("../controllers/authController");

router.post("/signin", authController.postSignin);
router.post("/login", authController.postLogin);
router.get("/user",isAuth, authController.getUser);

module.exports = router;
