const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Import models
const User = require('./src/models/User');

// Import middleware
const errorHandler = require('./src/middleware/error.middleware');

// Import routes
const apiRoutes = require('./src/routes/index');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobocate';
mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8001/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          user.googleId = profile.id;
          user.picture = profile.photos[0]?.value || user.picture;
          user.provider = 'google';
          user.lastLogin = new Date();
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0]?.value,
            provider: 'google',
            role: 'ROLE_CANDIDATE',
            lastLogin: new Date(),
          });
        }
      } else {
        user.lastLogin = new Date();
        user.picture = profile.photos[0]?.value || user.picture;
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Mount API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
  console.log(`🔍 Job Scraping: ${process.env.JOB_SCRAPING_ENABLED !== 'false' ? 'Enabled' : 'Disabled'}`);
  console.log(`🤖 Auto-Apply: ${process.env.AUTO_APPLICATION_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
});
