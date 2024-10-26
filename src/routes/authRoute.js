import { Router } from "express";
import { userLogin, userRegister } from "../controller/authController.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegister
);
router.route("/login").get(userLogin);

export default router;
