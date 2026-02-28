// middlewares/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger";

/* =====================================================
   BASE APP ERROR
===================================================== */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errors?: any[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/* =====================================================
   COMMON ERROR TYPES
===================================================== */
export class ValidationError extends AppError {
  constructor(errors: any[]) {
    super("Validation failed", StatusCodes.BAD_REQUEST, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, StatusCodes.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, StatusCodes.FORBIDDEN);
  }
}

/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  /* -------------------------------
     SAFE LOGGING
  -------------------------------- */
  logger.error({
    message: err.message,
    name: err.name,
    statusCode:
      err instanceof AppError
        ? err.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR,
    path: req.originalUrl,
    method: req.method,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let errors: any[] | undefined;

  /* -------------------------------
     AppError (Custom)
  -------------------------------- */
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  /* -------------------------------
     Mongo Duplicate Key
  -------------------------------- */
  else if ((err as any)?.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    const field = Object.keys((err as any).keyPattern || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  /* -------------------------------
     Mongoose Validation Error
  -------------------------------- */
  else if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errors = Object.values((err as any).errors || {}).map(
      (e: any) => ({
        field: e.path,
        message: e.message,
      })
    );
  }

  /* -------------------------------
     Invalid Mongo ObjectId
  -------------------------------- */
  else if (err.name === "CastError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid ID format";
  }

  /* -------------------------------
     JWT Errors
  -------------------------------- */
  else if (err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid token";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Token expired";
  }

  /* -------------------------------
     Response
  -------------------------------- */
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

/* =====================================================
   ASYNC HANDLER
===================================================== */
export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* =====================================================
   404 HANDLER
===================================================== */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new NotFoundError(`Route ${req.originalUrl}`));
};