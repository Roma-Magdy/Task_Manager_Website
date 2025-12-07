const db = require('../config/db');

class UserModel {
  // Create user
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

  // Get Profile Data
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT user_id, full_name, email, notification_preferences FROM users WHERE user_id = ?', 
      [id]
    );
    return rows[0];
  }

  // Update Only Full Name
  static async updateProfile(id, fullName) {
    const [result] = await db.execute(
      'UPDATE users SET full_name = ? WHERE user_id = ?',
      [fullName, id]
    );
    return result;
  }

  // Update Preferences
  static async updatePreferences(id, preferences) {
    const [result] = await db.execute(
      'UPDATE users SET notification_preferences = ? WHERE user_id = ?',
      [JSON.stringify(preferences), id]
    );
    return result;
  }
}

module.exports = UserModel;