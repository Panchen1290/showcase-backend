import express from 'express';
import agentRoutes from './routes/agentRoutes';
import reportRoutes from './routes/reportRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/reports', reportRoutes);

// Error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
