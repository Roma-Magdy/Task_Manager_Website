const ProjectModel = require('../models/ProjectModel');

// 1. Get All Projects (List View)
exports.getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.findAll(req.user.id);
    
    // Map DB columns to Frontend format
    const formatted = projects.map(p => {
      const total = p.total_tasks || 0;
      const completed = p.completed_tasks || 0;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        id: p.project_id,
        name: p.project_name,
        description: p.description,
        status: p.status || 'Planning', // Use DB status
        progress: progress,
        dueDate: p.due_date ? new Date(p.due_date).toISOString().split('T')[0] : '', // Use DB date
        teamMembers: p.team_count || 1,
        tasksCount: { total, completed }
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description, status, dueDate } = req.body;
    
    // Create the project
    const projectId = await ProjectModel.create(
        name, 
        description, 
        req.user.id, 
        status, 
        dueDate
    );
    
    // Add the creator as the 'manager' in the members table
    await ProjectModel.addMember(projectId, req.user.id, 'manager');

    // NOTE: Your frontend "Assign Members" field (comma separated) needs handling?
    // For now, we just create the project. You can add logic here to parse emails and add members if you want.

    res.status(201).json({ message: 'Project created', projectId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Project Details (For the Single Project Page)
exports.getProjectDetails = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Fetch all data in parallel for speed
        const [project, members, tasks] = await Promise.all([
            ProjectModel.findById(projectId),
            ProjectModel.findMembers(projectId),
            ProjectModel.findTasks(projectId)
        ]);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        // Calculate Progress
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        // Format for Frontend
        const response = {
            id: project.project_id,
            name: project.project_name,
            description: project.description,
            status: project.status,
            progress: progress,
            dueDate: project.due_date ? new Date(project.due_date).toISOString().split('T')[0] : '',
            createdDate: new Date(project.created_at).toISOString().split('T')[0],
            attachments: [], // We don't have an attachments table yet, sending empty array
            
            // Map Members
            teamMembers: members.map(m => ({
                id: m.id,
                name: m.name,
                role: m.role.charAt(0).toUpperCase() + m.role.slice(1), // manager -> Manager
                avatar: m.name.substring(0, 2).toUpperCase() // "John Doe" -> "JO"
            })),

            // Map Tasks
            tasks: tasks.map(t => ({
                id: t.task_id,
                title: t.title,
                status: t.status === 'in_progress' ? 'In Progress' : t.status === 'done' ? 'Completed' : 'To-Do',
                priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
                assignee: t.assignee_name || 'Unassigned'
            }))
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.updateProject = async (req, res) => {
  try {
    const { name, description, status, dueDate } = req.body;
    await ProjectModel.update(req.params.id, name, description, status, dueDate);
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await ProjectModel.delete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};