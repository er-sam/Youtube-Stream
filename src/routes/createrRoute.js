import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { addCreater, allFollowedCreater, createrAlldata, follow, Unfollow } from "../controller/createrController.js";
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

router.route("/follow").post(verifyToken,follow);
router.route("/unfollow").post(verifyToken,Unfollow);
router.route("/followingdata").get(verifyToken,allFollowedCreater);
router.route("/:id").get(verifyToken,createrAlldata);

export default router;
