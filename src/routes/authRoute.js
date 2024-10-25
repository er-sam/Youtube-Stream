import { Router } from "express";
import { userRegister } from "../controller/authController.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxcount: 1 },
  ]),
  userRegister
);


export default router