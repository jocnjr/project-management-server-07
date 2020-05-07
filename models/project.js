// models/project.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: String,
    description: String,
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    // owner will be added later on
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
