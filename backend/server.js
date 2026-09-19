const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const skillRoutes = require('./routes/skill');
const experienceRoutes = require('./routes/experience');

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Portfolio API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
