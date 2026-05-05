import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addComment,allComments,deleteComment } from "../controllers/comment.controller.js";

const router=Router()

router.use(protect)

router.post('/',addComment)
router.get('/:taskId',allComments)
router.delete('/:id',deleteComment)

export default router