import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { AuthRequest } from "../types/authRequest";
import { AppError } from "./errorHandler";

interface JwtPayload {
  id: string;
  role?: string;
}

/* =====================================================
   AUTHENTICATE ADMIN (HEADER OR COOKIE)
===================================================== */
export const authenticateAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    /* =============================
       1️⃣ Authorization Header
    ============================= */
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    /* =============================
       2️⃣ HTTP-only Cookie Fallback
    ============================= */
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError(
        "Authentication token missing",
        StatusCodes.UNAUTHORIZED
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError(
        "JWT secret not configured",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    /* =============================
       3️⃣ Verify Token
    ============================= */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    if (!decoded?.id) {
      throw new AppError(
        "Invalid authentication token",
        StatusCodes.UNAUTHORIZED
      );
    }

    if (decoded.role !== "admin") {
      throw new AppError(
        "Admin access only",
        StatusCodes.FORBIDDEN
      );
    }

    /* =============================
       4️⃣ Attach User to Request
    ============================= */
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (error: any) {

    // Handle JWT specific errors safely
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Token expired. Please login again.", StatusCodes.UNAUTHORIZED)
      );
    }

    if (error.name === "JsonWebTokenError") {
      return next(
        new AppError("Invalid authentication token", StatusCodes.UNAUTHORIZED)
      );
    }

    next(error);
  }
};