import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.HttpStatusCode || err.status || 500;
  console.error('Backend Error Detailed Log:', err);

  return res.status(statusCode).json({
    errorType: err.errorType || 'General',
    errorMessage: err.message || 'Internal Server Error',
    errors: err.errors || null,
    errorRaw: err,
  });
};
