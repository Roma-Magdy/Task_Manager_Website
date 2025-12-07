const UserModel = require('../models/UserModel');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse preferences (handle if it's string or null)
    let preferences = user.notification_preferences;
    if (typeof preferences === 'string') {
        try {
            preferences = JSON.parse(preferences);
        } catch (e) {
            preferences = null;
        }
    }

    const defaultPreferences = {
      enabled: true,
      somethingDue: true,
      taskNotDone: true,
      taskAssigned: true,
      projectAssigned: true
    };

    res.json({
      // We map 'username' to 'full_name' because we didn't create a username column
      username: user.full_name, 
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
    // We prioritize 'fullName' from the frontend, but fallback to 'username' if needed
    const { fullName, username } = req.body;
    const nameToSave = fullName || username;
    
    await UserModel.updateProfile(req.user.id, nameToSave);
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};