const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Google OAuth
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    }))}`);
  }
);

// LinkedIn OAuth
router.get('/linkedin', (req, res) => {
  const linkedinAuthUrl = 'https://www.linkedin.com/oauth/v2/authorization';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID || '',
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:8001/api/auth/linkedin/callback',
    scope: 'openid profile email',
    state: Math.random().toString(36).substring(7)
  });
  
  res.redirect(`${linkedinAuthUrl}?${params.toString()}`);
});

router.get('/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=linkedin_auth_failed`);
  }
  
  try {
    const axios = require('axios');
    
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:8001/api/auth/linkedin/callback',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const accessToken = tokenResponse.data.access_token;
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const profile = profileResponse.data;
    
    let user = await User.findOne({ linkedinId: profile.sub });
    
    if (!user) {
      user = await User.findOne({ email: profile.email });
      
      if (user) {
        user.linkedinId = profile.sub;
        user.picture = profile.picture || user.picture;
        user.provider = 'linkedin';
        user.lastLogin = new Date();
        await user.save();
      } else {
        user = await User.create({
          linkedinId: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          provider: 'linkedin',
          role: 'ROLE_CANDIDATE',
          lastLogin: new Date(),
        });
      }
    } else {
      user.lastLogin = new Date();
      user.picture = profile.picture || user.picture;
      await user.save();
    }
    
    const token = generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture
    }))}`);
    
  } catch (error) {
    console.error('LinkedIn OAuth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=linkedin_auth_failed`);
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'location', 'summary', 'skills', 'preferredLocations', 'preferredJobTypes', 'autoApply', 'minMatchScore'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;