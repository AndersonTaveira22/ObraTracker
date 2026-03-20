import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ObraTracker API is running.' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
