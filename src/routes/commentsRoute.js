import { Router } from "express";
import { verifyToken } from "../middleware/protected.js";
import { addComments, allComments, deleteComments } from "../controller/commentsController.js";

const router = Router();


router.route('/:videoId').post(verifyToken,addComments);
router.route('/all/:videoId').get(verifyToken,allComments);
router.route('/delete/:commentId').delete(verifyToken,deleteComments);


export default router;
