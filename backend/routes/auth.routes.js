const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
<<<<<<< HEAD
} = require("../controller/auth.controller");
=======
} from "../controller/auth.controller.js";
>>>>>>> b95f660 (auth comepleeeeeeee)

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
