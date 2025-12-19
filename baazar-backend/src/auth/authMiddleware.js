// src/auth/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';


// src/auth/authMiddleware.js
export const requireCompleteOnboarding = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    User.findById(decoded.id, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Check if onboarding is complete
      if (!user.onboardingComplete) {
        return res.status(403).json({ 
          message: 'Complete onboarding first',
          requiresOnboarding: true,
          userId: user._id 
        });
      }
      
      req.userId = decoded.id;
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

export const requireAuth = (req, res, next) => {
  try {
    console.log('Checking authentication...');
    console.log('All cookies:', req.cookies);
    console.log('Auth header:', req.headers.authorization);
    
    // Try multiple ways to get token
    const token = 
      req.cookies?.token ||
      req.cookies?.auth_token ||
      req.cookies?.authToken ||
      req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Extracted token:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Not authenticated - No token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully for user:', decoded.id);
    
    req.userId = decoded.id;
    return next();
    
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ 
      message: 'Not authenticated - Invalid token',
      error: err.message 
    });
  }
};