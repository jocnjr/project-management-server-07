// routes/project.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/project");
const uploader = require("../configs/cloudinary");

// GET PROJECTS

router.get("/projects", (req, res) => {
  Project.find()
    .populate("tasks")
    .sort({ createdAt: -1 })
    .then((projects) => res.json(projects))
    .catch((error) => res.status(500).json(error));
});

// GET route => to get a specific project/detailed view
router.get("/projects/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // tasks are being populated
  Project.findById(req.params.id)
    .populate("tasks")
    .then((response) => {
      // console.log(req.user, response);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// POST route => to create a new project
router.post("/projects", (req, res, next) => {
  // checks if body was provided
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "no body provided" });
    return;
  }

  Project.create({
    title: req.body.title,
    description: req.body.description,
    tasks: [],
    owner: req.user._id,
    imageUrl: req.body.imageUrl,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// PUT route => to update a specific project
router.put("/projects/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({
        message: `Project with ${req.params.id} is updated successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE route => to delete a specific project
router.delete("/projects/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        message: `Project with ${req.params.id} is removed successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// FILE UPLOAD

router.post("/upload", uploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  // get secure_url from the file object and save it in the
  // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
  res.json({ secure_url: req.file.secure_url });
});

module.exports = router;
