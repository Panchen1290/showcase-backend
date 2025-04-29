import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const err: AppError = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
