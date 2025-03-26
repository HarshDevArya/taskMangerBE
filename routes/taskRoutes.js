const express = require("express");
const router = express.Router();
const login = require("../middleware/requireAuth");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");

router.get("/tasks", login, getTasks);
router.post("/tasks", login, createTask);
router.put("/tasks/:taskId", login, updateTask);
router.delete("/:taskId", login, deleteTask);

module.exports = router;
