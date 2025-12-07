const db = require('../config/db');

class UserModel {
  static async create(fullName, email, passwordHash) {
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName, email, passwordHash]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT user_id, full_name, email FROM users WHERE user_id = ?', [id]);
    return rows[0];
  }
}

module.exports = UserModel;