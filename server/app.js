import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import applicationRouter from './routes/application.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter); // <-- ADD THIS LINE

// 404 & Central Error Handler stay below...
app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.url} not found` } }));
app.use((err, req, res, next) => res.status(err.statusCode || 500).json({ error: { code: err.code || 'ERROR', message: err.message } }));

export default app;