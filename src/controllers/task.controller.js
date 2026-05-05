import User from "../models/user.model.js";
import AppError from "../utils/appError.util.js";
import Task from "../models/task.model.js";
import catchAsync from "../utils/catchAsync.util.js";
import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createTask = catchAsync(async (req, res, next) => {
    const { title, description, projectId, assignedTo, status, priority } = req.body;
    if (!title || !description) {
        return next(new AppError('please provide name and description', 400))

    }

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(assignedTo)) {
        return next(new AppError('invalid project Id or member Id', 400))
    }
    const project = await Project.findById(projectId)
    if (!project) return next(new AppError("Project not found", 404));

    if (!project.owner.equals(req.user._id)) {
        return next(new AppError('unauthorized! you are  not owner of this projects', 403))
    }

    const task = await Task.create({
        title,
        description,
        projectId,
        assignedTo,
        status: status || "todo",
        priority: priority || "low",
        dueDate: Date.now()
    })


    res.status(201).json({
        status: 'success',
        message: 'task has been created successfully!',
        data: {

            task
        }
    })
});

export const allTask = catchAsync(async (req, res, next) => {
    const { projectId } = req.params
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new AppError("Invalid project ID", 400))
    }

    const task = await Task.find({ projectId })

    if (!task) {
        return next(new AppError('task not found', 404))
    }
    res.status(200).json({
        status: 'success',
        message: 'all task fetched successfully',
        data: {
            task,
        }
    })
})
export const updateTask = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body
    if (!status) {
        return next(new AppError('please provide status', 400))
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid task ID", 400))
    }

    const task = await Task.findById(id)
    if (!task) {
        return next(new AppError('task not found', 404))
    }

    if (!task.assignedTo.equals(req.user._id)) {
        return next(new AppError('unauthorized! you are  not assigned to this task', 403))

    }
    task.status = status

    await task.save()

    res.status(200).json({
        status: 'success',
        message: 'task updated successfully',
        data: {
            task
        }
    })


})

export const removeTask = catchAsync(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid task ID", 400))
    }
    const task = await Task.findById(id)
    if (!task) return next(new AppError("Task not found", 404))

    const project = await Project.findById(task.projectId)
    if (!project.owner.equals(req.user._id)) {
        return next(new AppError("Only owner can delete tasks", 403))
    }

    await task.deleteOne()

    res.status(200).json({
        status: 'success',
        message: 'task removed successfully',


    })
})
