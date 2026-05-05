import { Router } from "express";
import {
    createTask, allTask, updateTask, removeTask
} from '../controllers/task.controller.js'
import { protect, restrictTo } from "../middlewares/auth.middleware.js"


const router = Router()
router.use(protect)

router.post('/', restrictTo('admin'), createTask)
router.get('/project/:projectId', allTask)
router.patch('/:id', updateTask)
router.delete('/:id', restrictTo('admin'), removeTask)

export default router