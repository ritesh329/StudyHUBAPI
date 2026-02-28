import { validationResult, FieldValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "./errorHandler";

export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    const formattedErrors = errors.array().map((err) => {
      const fieldError = err as Partial<FieldValidationError>;

      return {
        field: fieldError.path || "unknown",
        message: fieldError.msg || "Invalid value",
      };
    });

    return next(new ValidationError(formattedErrors));
  }

  next();
};