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
  const projects = await Project.find()
    .select("name members")
    .populate({ path: "members", select: "name" });

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

  if (!name || !description) {
    return next(new AppError("provide name and description", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid project Id", 400));
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.owner.equals(req.user._id)) {
    return next(
      new AppError("You are not authorized to update this project", 403),
    );
  }

  project.name = name;
  project.description = description;

  await project.save();

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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid project ID", 400));
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.owner.equals(req.user._id)) {
    return next(
      new AppError("You are not authorized to delete this project", 403),
    );
  }

  await project.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Project deleted successfully",
  });
});

// ─── Add Member ────────────────────────────────────────────────────────────────
export const addMember = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError("Please provide a valid user ID", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid project ID", 400));
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (project.members.includes(userId)) {
    return next(new AppError("User is already a member", 400));
  }

  if (!project.owner.equals(req.user._id)) {
    return next(
      new AppError(
        "You are not authorized to add members to this project",
        403,
      ),
    );
  }

  project.members.push(userId);
  await project.save();

  res.status(200).json({
    status: "success",
    message: "Member added to project successfully",
    data: {
      project,
    },
  });
});

// ─── All Members ───────────────────────────────────────────────────────────────
export const allMember = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid project ID", 400));
  }

  const project = await Project.findById(req.params.id).populate({
    path: "members",
    select: "name",
  });

  if (!project) return next(new AppError("Project not found", 404));

  res.status(200).json({
    status: "success",
    message: "Fetched members successfully",
    data: {
      members: project.members,
    },
  });
});

// ─── Remove Member ─────────────────────────────────────────────────────────────
export const removeMember = catchAsync(async (req, res, next) => {
  const { id, userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid project ID", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError("Invalid user ID", 400));
  }

  const project = await Project.findById(id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.owner.equals(req.user._id)) {
    return next(new AppError("You are not authorized to remove members", 403));
  }

  project.members = project.members.filter((member) => !member.equals(userId));
  await project.save();

  res.status(200).json({
    status: "success",
    message: "Member removed successfully",
    data: {
      members: project.members,
    },
  });
});
