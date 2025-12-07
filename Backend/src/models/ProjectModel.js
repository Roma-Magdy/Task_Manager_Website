const db = require('../config/db');

class ProjectModel {
  // 1. Create Project
  static async create(name, description, managerId, status, dueDate) {
    const sql = `
      INSERT INTO projects (project_name, description, manager_id, status, due_date, created_at) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.execute(sql, [
      name, 
      description, 
      managerId, 
      status || 'Planning', 
      dueDate || null
    ]);
    
    return result.insertId;
  }

  // 2. Get All Projects (With Progress Calculations)
  static async findAll(userId) {
    const sql = `
      SELECT p.*, 
             u.full_name as manager_name,
             (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.project_id) as team_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.project_id) as total_tasks,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.project_id AND t.status = 'done') as completed_tasks
      FROM projects p
      LEFT JOIN project_members pm ON p.project_id = pm.project_id
      JOIN users u ON p.manager_id = u.user_id
      WHERE p.manager_id = ? OR pm.user_id = ?
      GROUP BY p.project_id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.execute(sql, [userId, userId]);
    return rows;
  }

  // 3. Find Single Project by ID
  static async findById(projectId) {
    const sql = `
      SELECT p.*, u.full_name as manager_name, u.email as manager_email
      FROM projects p
      JOIN users u ON p.manager_id = u.user_id
      WHERE p.project_id = ?
    `;
    const [rows] = await db.execute(sql, [projectId]);
    return rows[0];
  }
  
  // 4. Add Member to Project
  static async addMember(projectId, userId, role) {
    // Check if already a member to prevent duplicates
    const checkSql = `SELECT * FROM project_members WHERE project_id = ? AND user_id = ?`;
    const [existing] = await db.execute(checkSql, [projectId, userId]);
    
    if (existing.length === 0) {
      const sql = `INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)`;
      await db.execute(sql, [projectId, userId, role]);
    }
  }

  // 5. Get Project Members (For Details Page)
  static async findMembers(projectId) {
    const sql = `
      SELECT u.user_id as id, u.full_name as name, u.email, pm.role 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.user_id
      WHERE pm.project_id = ?
    `;
    const [rows] = await db.execute(sql, [projectId]);
    return rows;
  }

  // 6. Get Project Tasks (For Details Page)
  static async findTasks(projectId) {
    const sql = `
      SELECT t.*, u.full_name as assignee_name 
      FROM tasks t
      LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
      LEFT JOIN users u ON ta.user_id = u.user_id
      WHERE t.project_id = ?
    `;
    const [rows] = await db.execute(sql, [projectId]);
    return rows;
    }
  

  // Update Project
  static async update(id, name, description, status, dueDate) {
    const sql = `
      UPDATE projects 
      SET project_name = ?, description = ?, status = ?, due_date = ? 
      WHERE project_id = ?
    `;
    const [result] = await db.execute(sql, [name, description, status, dueDate, id]);
    return result;
  }

  //  Delete Project
  static async delete(id) {
    const sql = `DELETE FROM projects WHERE project_id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result;
  }

}

module.exports = ProjectModel;