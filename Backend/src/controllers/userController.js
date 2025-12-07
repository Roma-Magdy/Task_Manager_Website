const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let preferences = user.notification_preferences;
    if (typeof preferences === 'string') {
        try { preferences = JSON.parse(preferences); } catch (e) { preferences = null; }
    }

    const defaultPreferences = {
      enabled: true, somethingDue: true, taskNotDone: true, taskAssigned: true, projectAssigned: true
    };

    res.json({
      fullName: user.full_name,
      email: user.email,
      preferences: preferences || defaultPreferences
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, password } = req.body;

    // 1. Update Name (Always)
    if (fullName) {
        await UserModel.updateProfile(req.user.id, fullName);
    }

    // 2. Update Password (Only if provided)
    if (password) {
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserModel.updatePassword(req.user.id, hashedPassword);
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    await UserModel.updatePreferences(req.user.id, req.body);
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all users (for team member selection)
 * @route GET /api/users/all
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};