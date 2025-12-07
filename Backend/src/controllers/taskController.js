const TaskModel = require('../models/TaskModel');
const NotificationModel = require('../models/NotificationModel');

exports.createTask = async (req, res) => {
  try {
    const statusMap = { 'To-Do': 'todo', 'In Progress': 'in_progress', 'Completed': 'done' };
    
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority ? req.body.priority.toLowerCase() : 'medium',
      status: statusMap[req.body.status] || 'todo',
      due_date: req.body.dueDate,
      project_id: req.body.project_id || null
    };

    // 1. Create Task
    const taskId = await TaskModel.create(taskData, req.user.id);

    // 2. Assign User & Notify
    // Note: Frontend currently sends a NAME in 'assignee'. 
    // Ideally, frontend should send 'assignee_id'. 
    // We will assume for now we don't have the ID, so skipping notification logic 
    // unless you update frontend to send assignee_id.
    
    // Example Logic if assignee_id was sent:
    if (req.body.assignee_id) {
       await TaskModel.assignUser(taskId, req.body.assignee_id);
       
       if (Number(req.body.assignee_id) !== req.user.id) {
         await NotificationModel.create({
           userId: req.body.assignee_id,
           actorId: req.user.id,
           type: 'task_assigned',
           message: `You were assigned to: ${req.body.title}`,
           taskId: taskId
         });
       }
    }

    res.status(201).json({ message: 'Task created', id: taskId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.findAll(req.user.id);

    const formatted = tasks.map(t => ({
      id: t.task_id,
      title: t.title,
      description: t.description,
      status: t.status === 'in_progress' ? 'In Progress' : t.status === 'done' ? 'Completed' : 'To-Do',
      priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
      assignee: t.assignee_name || 'Unassigned',
      project: t.project_name || 'General',
      dueDate: t.due_date ? new Date(t.due_date).toISOString().split('T')[0] : '',
      createdDate: new Date(t.created_at).toISOString().split('T')[0]
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskStats = async (req, res) => {
    try {
        const stats = await TaskModel.getCounts(req.user.id);
        const dashboardData = [
          { label: 'To-Do', value: Number(stats.todo || 0), icon: 'ListTodo', color: 'bg-blue-500' },
          { label: 'In Progress', value: Number(stats.in_progress || 0), icon: 'Clock', color: 'bg-yellow-500' },
          { label: 'Completed', value: Number(stats.completed || 0), icon: 'CheckCircle', color: 'bg-green-500' },
        ];
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Format date
    if (task.due_date) {
        task.due_date = new Date(task.due_date).toISOString().split('T')[0];
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignee_id } = req.body;
    
    // Map status/priority to lower case for DB if needed
    const data = {
        title, description, priority, status, 
        due_date: dueDate,
        assignee_id
    };
    
    await TaskModel.update(req.params.id, data);
    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await TaskModel.delete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};