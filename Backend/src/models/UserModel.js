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
    const [rows] = await db.execute(
      'SELECT user_id, full_name, email, notification_preferences FROM users WHERE user_id = ?', 
      [id]
    );
    return rows[0];
  }

  static async updateProfile(id, fullName) {
    const [result] = await db.execute(
      'UPDATE users SET full_name = ? WHERE user_id = ?',
      [fullName, id]
    );
    return result;
  }

  static async updatePreferences(id, preferences) {
    const [result] = await db.execute(
      'UPDATE users SET notification_preferences = ? WHERE user_id = ?',
      [JSON.stringify(preferences), id]
    );
    return result;
  }

  // NEW: Update Password
  static async updatePassword(id, passwordHash) {
    const [result] = await db.execute(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [passwordHash, id]
    );
    return result;
  }
}

module.exports = UserModel;