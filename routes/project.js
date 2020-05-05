// routes/project.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/project");
const Task = require("../models/task");

// GET

router.get("/projects", (req, res) => {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((error) => res.status(500).json(error));
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
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
