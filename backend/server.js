const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env if present
dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Initialize Express App
const app = express();

// Database Connection
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Assets
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Favicon shortcut handler
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(frontendPath, 'assets', 'favicon.svg'));
});

// API Health Check
const getHealthResponse = () => ({
  status: 'online',
  appName: 'AEIE Career Navigator API',
  tagline: 'Plan Your Skills. Build Your Future.',
  institution: 'UIT Burdwan (2026–2030)',
  creator: 'Deb',
  feedbackEmail: 'debdeveloper2207@gmail.com',
  timestamp: new Date().toISOString(),
  database: getDBStatus(),
});

app.get('/api/health', (req, res) => {
  res.json(getHealthResponse());
});

app.get('/health', (req, res) => {
  res.json(getHealthResponse());
});

// Mount API Routes (under /api)
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/feedback', feedbackRoutes);

// Also mount routes directly so serverless rewrites without /api prefix work seamlessly
app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/resources', resourceRoutes);
app.use('/roadmap', roadmapRoutes);
app.use('/feedback', feedbackRoutes);

// Fallback to index.html for frontend client routing on GET requests
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }
  next();
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Port Configuration (start local listener when run directly outside Vercel/tests)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`AEIE Career Navigator Server Running`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`API Health: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;


module.exports = app;
