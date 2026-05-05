import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    dueDate: Date,
  },
  { timestamps: true },
);
const Task = model("Task", taskSchema);
export default Task;
