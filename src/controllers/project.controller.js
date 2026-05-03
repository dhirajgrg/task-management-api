import mongoose from "mongoose";
import Project from "../models/project.model.js";
import AppError from "../utils/appError.util.js";
import catchAsync from "../utils/catchAsync.util.js";

// ─── Create Project ────────────────────────────────────────────────────────────
export const createProject = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return next(new AppError("Project name and description are required", 400));
  }

  const newProject = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [req.user._id],
  });

  res.status(201).json({
    status: "success",
    message: "New project created successfully",
    data: {
      project: newProject,
    },
  });
});

// ─── Get All Projects ──────────────────────────────────────────────────────────
export const allProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find();

  // Fix: .find() never returns null — check .length instead
  if (!projects.length) {
    return next(new AppError("No projects found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Fetched all projects successfully",
    totalProjects: projects.length,
    data: {
      projects,
    },
  });
});

// ─── Get Single Project ────────────────────────────────────────────────────────
export const singleProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Fix: validate ObjectId format to prevent Mongoose CastError crash
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid project ID", 400));
  }


  const project = await Project.findById(id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Project fetched successfully",
    data: {
      project,
    },
  });
});

// ─── Update Project ────────────────────────────────────────────────────────────
export const updateProject = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;


  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;


  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true },
  );

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Project updated successfully",
    data: {
      project,
    },
  });
});

// ─── Delete Project ────────────────────────────────────────────────────────────
export const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);


  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Project deleted successfully",
  });
});
