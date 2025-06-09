import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
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






















