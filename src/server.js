import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

const logger = pino();
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(authRouter);
app.use(contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export function setupServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
