import mongoose from 'mongoose'
import Comment from '../models/comment.model.js'
import AppError from '../utils/appError.util.js'
import catchAsync from '../utils/catchAsync.util.js'
import Task from '../models/task.model.js'


export const addComment = catchAsync(async (req, res, next) => {
    const { taskId, text } = req.body

    if (!text) {
        return next(new AppError('please provide name and description', 400))

    }


    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return next(new AppError('Invalid task Id ', 400))
    }


    const task = await Task.findById(taskId)
    if (!task) return next(new AppError("Task not found", 404));


    if (!task.assignedTo.equals(req.user._id)) {
        return next(new AppError('unauthorized! your are  not allowed to perform comment', 403))
    }

    const newComment = await Comment.create({
        taskId,
        userId: req.user._id,
        text
    })

    res.status(201).json({
        status: 'success',
        message: 'Comment has been created successfully!',
        data: {

            comment: newComment
        }
    })
})


export const allComments = catchAsync(async (req, res, next) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return next(new AppError("Invalid task ID", 400));
    }

    const task = await Task.findById(taskId);
    if (!task) return next(new AppError("Task not found", 404));

    const comments = await Comment.find({ taskId })
        .populate({ path: "userId", select: "name email" });

    if (!comments.length) {
        return next(new AppError("No comments found for this task", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Comments fetched successfully",
        totalComments: comments.length,
        data: { comments },
    });
});

export const deleteComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid comment ID", 400));
    }

    const comment = await Comment.findById(id);
    if (!comment) return next(new AppError("Comment not found", 404));

    // only the comment owner can delete
    if (!comment.userId.equals(req.user._id)) {
        return next(new AppError("Unauthorized! You can only delete your own comments", 403));
    }

    await comment.deleteOne();

    res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
    });
});