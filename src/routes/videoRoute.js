import { Router } from "express";
import { userLogin, userRegister } from "../controller/authController.js";
import { upload } from "../middleware/multer.js";
import { uploadVideo } from "../controller/videoController.js";
import { verifyToken } from "../middleware/protected.js";

const router = Router();

router.route("/upload").post(verifyToken, upload.single("video"), uploadVideo);




export default router;
