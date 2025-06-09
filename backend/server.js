import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Your local Vite dev server
  process.env.FRONTEND_URL, // The deployed frontend URL from Render's environment variables
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// Use the configured CORS options
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/posts', postRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Backend server is running successfully.',
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URI);
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
