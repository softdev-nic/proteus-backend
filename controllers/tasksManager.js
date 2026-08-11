 const Tasks = require("../Models/TaskSchema");
const User = require("../Models/Users");

const taskMaker = async(req,res)=>{

    const {title,description,priority,dueDate} = req.body
    try{

      const newTask =  new Tasks({
        title,
        description,
        priority,
        dueDate
      })
      await newTask.save()
      res.status(201).json({
        newTask
      })
    }catch(error)
    {
      return res.status(400).json({error:error.message})
    }
    
}
const assignTasks = async (req, res) => {
  try {
  
    const { taskId,userId } = req.body;

    const task = await Tasks.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({
        success: false,
        message: "Task or User not found",
      });
    }

    // Prevent duplicate assignment
    const alreadyAssigned = task.members.some(
      (id) => id.toString() === userId
    );

    if (alreadyAssigned) {
      return res.status(409).json({
        success: false,
        message: "User is already assigned to this task",
      });
    }

    task.members.push(user._id);
    user.tasks.push(task._id);

    await task.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      task,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {

  try {
    const { taskId } = req.params;
 console.log("1 - Delete started");
    const task = await Tasks.findById(taskId);
    

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
  
    // Remove task reference from all users
    await User.updateMany(
      { tasks: task._id },
      { $pull: { tasks: task._id } }
    );

    await Tasks.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
   
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

const changePriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    const allowedPriorities = ["low", "medium", "high"];

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    const task = await Tasks.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.priority = priority;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task priority updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task priority",
      error: error.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Tasks.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({
        success: false,
        message: "Task or User not found",
      });
    }

    const isMember = task.members.some(
      (id) => id.toString() === userId
    );

    if (!isMember) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this task",
      });
    }

    task.members = task.members.filter(
      (id) => id.toString() !== userId
    );

    user.tasks = user.tasks.filter(
      (id) => id.toString() !== taskId
    );

    await task.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Member removed from task successfully",
      task,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing member from task",
      error: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find().populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tasks",
      error: error.message,
    });
  }
};

const assignMember = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Tasks.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({
        success: false,
        message: "Task or User not found",
      });
    }
    
  const alreadyAssigned = task.members.some(
      (id) => id.toString() === userId
    );

    if (alreadyAssigned) {
      return res.status(409).json({
        success: false,
        message: "User is already assigned to this task",
      });
    }

    task.members.push(user._id);
    user.tasks.push(task._id);

    await task.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Member assigned to task successfully",
      task,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning member to task",
      error: error.message,
    });
  }
};
const getTaskDetails = async(req,res)=>{
  try{
  const {taskId} = req.body
  const task = await Tasks.findById(taskId)
  if(!taskId)
  {
    return res.status(200).json({
      error:"task is not available anymore"
    })

  }
  res.status(201).json({task})
}catch(error)
{
  res.status(400).json({
    error:error.message
  })
}
}
const getTasks = async(req,res)=>{
  try{

    const {userId} = req.body
    const user = await User.findById(userId)
    if(!user){
    return res.status(400).json({
      error:"user not found"
    })
  }
  res.send({data:user.tasks})
}catch(error)

{
  res.status(500).json({
    error:error.message
  })
}
}

module.exports = {
  assignTasks,
  taskMaker,
  deleteTask,
  changePriority,
  getAllTasks,
  removeMember,
  assignMember,
  getTaskDetails,
  getTasks
};