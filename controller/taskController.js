const Task = require("../models/Task");

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    // Parse page and limit from query; set defaults if not provided
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Total tasks for this user (without pagination)
    const totalTasks = await Task.countDocuments({ user: userId });
    // Fetch tasks with pagination
    const tasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // Return tasks plus pagination info
    return res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }
  try {
    const newTask = new Task({ title, description, user: req.user.id });
    await newTask.save();
    res.status(201).json({ message: "Task created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, title, description } = req.body;

    // Find the task that belongs to this user
    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (status) task.status = status;
    if (title) task.title = title;
    if (description) task.description = description;

    await task.save();
    return res.json({ task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/tasks/:taskId
 * Delete a specific task owned by the user
 */
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found or not yours." });
    }

    return res.json({ message: "Task deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
