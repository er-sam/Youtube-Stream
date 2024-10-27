import { Router } from "express";
import { userLogin, userRegister } from "../controller/authController.js";
import { upload } from "../middleware/multer.js";
import { allVideosByCreater, getVideosByFollowing, likeVideo, uploadVideo, videoPlay, viewsCounter } from "../controller/videoController.js";
import { verifyToken } from "../middleware/protected.js";

const router = Router();

router.route("/upload").post(verifyToken, upload.single("video"), uploadVideo);
router.route("/views/:videoId").post(verifyToken,viewsCounter);
router.route('/play/:videoId').get(verifyToken,videoPlay)
router.route('/like/:videoId').post(verifyToken,likeVideo)
router.route('/getAll/:createrId').get(verifyToken,allVideosByCreater)
router.route('/getfollowingVideos').get(verifyToken,getVideosByFollowing)



export default router;
