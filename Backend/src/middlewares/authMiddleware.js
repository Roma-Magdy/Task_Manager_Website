const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get token from header (Format: "Bearer <token>")
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Add user info to request
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = protect;