import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import { submissionsRouter } from './routes/submissions';
import { DocusealApiError, HttpError } from './utils/errors';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/submissions', submissionsRouter);

app.use((_request, response) => {
  response.status(404).json({
    message: 'Not found'
  });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    return response.status(error.status).json({
      message: error.message,
      details: error.details
    });
  }

  if (error instanceof DocusealApiError) {
    return response.status(error.status && error.status >= 100 ? error.status : 502).json({
      message: error.message,
      errorCode: error.errorCode,
      details: error.details
    });
  }

  if (error instanceof Error) {
    return response.status(500).json({
      message: error.message
    });
  }

  return response.status(500).json({
    message: 'Unexpected error'
  });
});

app.listen(config.port, () => {
  console.log(`DocuSeal submission service listening on port ${config.port}`);
});
