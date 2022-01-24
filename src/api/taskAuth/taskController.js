import taskModel from "../../model/taskModel.js";

export const handleCreateTask = async (req, res) => {
  const { description, completed } = req.body;
  try {
    const newTask = taskModel({ ...req.body, owner: req.user._id });
    await newTask.save();
    res.status(200).json({ task: newTask });
  } catch (e) {
    return res.status(400).send({
      e,
    });
  }
};

export const handleGetTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    const populatedTask = [];
    for (let i = 0; i < tasks.length; i++) {
      let data = await tasks[i].populate("owner");
      populatedTask.push(data);
    }
    res.status(200).json(populatedTask);
  } catch (e) {
    return res.status(400).send({
      e,
    });
  }
};

// Get task for authenticated user
export const handleGetUserTasks = async (req, res) => {
  const match = {};
  const options = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.limit) {
    options.limit = parseInt(req.query.limit);
    if (req.query.skip) {
      options.skip = parseInt(req.query.skip);
    }
  }

  if (req.query.sortBy) {
    try {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
      // options.sort = sort;
      options["sort"] = sort;
    } catch (error) {
      console.log(error);
    }
  }

  try {
    // await req.user.populate("userTasks");
    await req.user.populate({
      path: "userTasks",
      match,
      options,
    });
    res.status(200).json(req.user.userTasks);

    // Alternative method
    // const _id = req.user._id;
    // const tasks = await taskModel.find({ owner: _id });
    // res.status(200).json({ tasks });
  } catch (e) {
    return res.status(400).send({
      e,
    });
  }
};

export const handleGetSingleTask = async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await taskModel.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    await task.populate("owner");
    res.status(200).json({ task });
  } catch (e) {
    return res.status(400).send({
      e,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid Updates!",
      });
    }
    const _id = req.params.id;
    const task = await taskModel.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    res.status(200).json({ task });
  } catch (e) {
    res.status(400).json({ e });
  }
};

export const handleDeleteTask = async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await taskModel.findOneAndDelete({ owner: req.user._id, _id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).json({ message: `Task has been deleted` });
  } catch (error) {
    return res.status(400).send({
      error,
    });
  }
};
