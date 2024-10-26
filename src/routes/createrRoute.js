import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { addCreater } from "../controller/createrController.js";
import { verifyToken } from "../middleware/protected.js";

const router = Router();

router.route("/addcreater").post(
  verifyToken,
  upload.fields([
    { name: "creater-avatar", maxCount: 1 },
    { name: "creater-coverImage", maxCount: 1 },
  ]),
  addCreater
);

export default router;
