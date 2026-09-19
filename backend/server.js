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

app.post('/api/chat', async (req, res) => {
  const { message, previousResponseId } = req.body || {};
  const hermesApiKey = process.env.HERMES_API_KEY;

  if (!hermesApiKey) {
    return res.status(503).json({ error: 'Hermes is not configured. Set HERMES_API_KEY in backend/.env.' });
  }

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A non-empty message is required.' });
  }

  if (message.length > 4000) {
    return res.status(400).json({ error: 'Messages must be 4000 characters or fewer.' });
  }

  const payload = { model: process.env.HERMES_MODEL || 'hermes-agent', input: message.trim(), store: true };
  if (previousResponseId) payload.previous_response_id = previousResponseId;

  try {
    const hermesResponse = await fetch(
      `${process.env.HERMES_API_URL || 'http://192.168.1.84:8642'}/v1/responses`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hermesApiKey}`,
          'Content-Type': 'application/json',
          'X-Hermes-Session-Key': process.env.HERMES_SESSION_KEY || 'hermes-portfolio-web',
        },
        body: JSON.stringify(payload),
      },
    );
    const responseBody = await hermesResponse.json();

    if (!hermesResponse.ok) {
      return res.status(502).json({ error: responseBody?.error?.message || 'Hermes request failed.' });
    }

    const reply = responseBody.output
      ?.filter((item) => item.type === 'message')
      .flatMap((item) => item.content || [])
      .find((item) => item.type === 'output_text')?.text;

    if (!reply) return res.status(502).json({ error: 'Hermes returned no text response.' });
    return res.json({ id: responseBody.id, reply });
  } catch (error) {
    return res.status(502).json({ error: `Unable to reach Hermes: ${error.message}` });
  }
});

app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Portfolio API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
