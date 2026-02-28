import { Request, Response, NextFunction } from "express";
import xss from "xss";

export const sanitizeBody = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};